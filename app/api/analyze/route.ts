import { NextResponse } from "next/server";
import Together from "together-ai";
import { z } from "zod";
import {
  acceptedAudioTypes,
  acceptedImageTypes,
  analysisSchema,
  uploadLimits,
} from "@/lib/analysis";

export const runtime = "nodejs";

const MODEL_ID = "thinkingmachines/Inkling";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "input_audio"; input_audio: { data: string; format: "wav" } };

type TogetherRequest = {
  model: typeof MODEL_ID;
  messages: Array<
    | { role: "system"; content: string }
    | { role: "user"; content: ContentPart[] }
  >;
  max_tokens: number;
  temperature: number;
  reasoning_effort: "low";
  response_format: {
    type: "json_schema";
    json_schema: {
      name: string;
      schema: Record<string, unknown>;
      strict: true;
    };
  };
};

type TogetherResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
};

const systemPrompt = `You analyze product and issue feedback for a technical demo.
Combine every supplied modality into one grounded understanding of the reported issue.
Distinguish what the user wrote, what is visible, and what is audible. Do not invent
details. If a modality is absent or adds no useful information, return an empty array
for its context field. Respond only with JSON matching the supplied schema.`;

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function isNonEmptyFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function isAcceptedType<const T extends readonly string[]>(types: T, value: string) {
  return types.includes(value as T[number]);
}

function isWav(file: File) {
  return (
    isAcceptedType(acceptedAudioTypes, file.type) ||
    file.name.toLowerCase().endsWith(".wav")
  );
}

async function encodeFile(file: File) {
  return Buffer.from(await file.arrayBuffer()).toString("base64");
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("Expected a multipart form submission.");
  }

  const textEntry = formData.get("text");
  const text = typeof textEntry === "string" ? textEntry.trim() : "";
  const imageEntry = formData.get("image");
  const audioEntry = formData.get("audio");
  const image = isNonEmptyFile(imageEntry) ? imageEntry : null;
  const audio = isNonEmptyFile(audioEntry) ? audioEntry : null;

  if (!text && !image && !audio) {
    return errorResponse("Add written context, a screenshot, or a WAV voice note.");
  }

  if (text.length > uploadLimits.textCharacters) {
    return errorResponse(
      `Written context must be ${uploadLimits.textCharacters.toLocaleString()} characters or fewer.`,
    );
  }

  if (image) {
    if (!isAcceptedType(acceptedImageTypes, image.type)) {
      return errorResponse("The screenshot must be a PNG, JPEG, or WebP image.");
    }

    if (image.size > uploadLimits.imageBytes) {
      return errorResponse("The screenshot must be 5 MB or smaller.");
    }
  }

  if (audio) {
    if (!isWav(audio)) {
      return errorResponse(
        "The voice note must be a WAV file. OneContext does not transcode audio.",
      );
    }

    if (audio.size > uploadLimits.audioBytes) {
      return errorResponse("The voice note must be 10 MB or smaller.");
    }
  }

  const modalities = [
    ...(text ? (["text"] as const) : []),
    ...(image ? (["image"] as const) : []),
    ...(audio ? (["audio"] as const) : []),
  ];

  if (process.env.ONECONTEXT_DEMO_MODE === "true") {
    return NextResponse.json({
      data: {
        summary:
          "A user cannot sign in because the account is locked. A comparison account works in the same browser, suggesting the problem is specific to this account rather than the login page generally.",
        intent: "Report and resolve an account-specific storefront access problem.",
        important_details: [
          "The login attempt is rejected before the user can access the storefront.",
          "The reporter reproduced the behavior in Chrome.",
          "A different demo account can sign in successfully from the same browser.",
        ],
        visual_context: image
          ? [
              "Sample observation: the login screen displays an account-locked error after submission.",
            ]
          : [],
        audio_context: audio
          ? [
              "Sample observation: the reporter says the locked-out account fails consistently while the standard account works.",
            ]
          : [],
        suggested_action:
          "Confirm the account lock state, review the reason and unlock policy, and provide the user with an appropriate recovery path.",
      },
      meta: {
        model: "No model (sample data)",
        modalities,
        mode: "sample",
      },
    });
  }

  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    return errorResponse(
      "The server is missing TOGETHER_API_KEY. Add it to .env.local and restart the app.",
      500,
    );
  }

  const content: ContentPart[] = [
    {
      type: "text",
      text: text
        ? `Written context from the user:\n${text}`
        : "No written context was supplied. Analyze the attached media only.",
    },
  ];

  if (image) {
    content.push({
      type: "image_url",
      image_url: {
        url: `data:${image.type};base64,${await encodeFile(image)}`,
      },
    });
  }

  if (audio) {
    content.push({
      type: "input_audio",
      input_audio: {
        data: await encodeFile(audio),
        format: "wav",
      },
    });
  }

  const jsonSchema = z.toJSONSchema(analysisSchema) as Record<string, unknown>;
  const body: TogetherRequest = {
    model: MODEL_ID,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content },
    ],
    max_tokens: 1_000,
    temperature: 0.2,
    reasoning_effort: "low",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "issue_feedback_analysis",
        schema: jsonSchema,
        strict: true,
      },
    },
  };

  try {
    const together = new Together({
      apiKey,
      maxRetries: 1,
      timeout: 90_000,
    });

    // The published SDK transport supports the current API wire format even though
    // its generated chat content union does not yet include input_audio.
    const response = await together.post<TogetherRequest, TogetherResponse>(
      "/chat/completions",
      { body },
    );
    const raw = response.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("Together returned an empty response.");
    }

    const parsed = analysisSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.error("Together response failed validation", parsed.error.flatten());
      return errorResponse("The model returned an unexpected response shape. Try again.", 502);
    }

    return NextResponse.json({
      data: parsed.data,
      meta: {
        model: MODEL_ID,
        modalities,
        mode: "live",
      },
    });
  } catch (error) {
    console.error("Together inference failed", error);
    return errorResponse(
      "Together could not analyze this submission. Check the API key, model access, and inputs, then try again.",
      502,
    );
  }
}
