import { z } from "zod";

export const analysisSchema = z.object({
  summary: z.string().describe("A concise combined understanding of the issue."),
  intent: z.string().describe("What the person is trying to report or resolve."),
  important_details: z.array(z.string()).describe("Relevant facts across all inputs."),
  visual_context: z.array(z.string()).describe("Useful details visible in the image."),
  audio_context: z.array(z.string()).describe("Useful details present in the voice note."),
  suggested_action: z.string().describe("A practical next step for handling the issue."),
});

export type Analysis = z.infer<typeof analysisSchema>;

export const uploadLimits = {
  textCharacters: 4_000,
  imageBytes: 5 * 1024 * 1024,
  audioBytes: 10 * 1024 * 1024,
} as const;

export const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;

// WAV is intentional: this demo is about native multimodal reasoning, not transcoding.
export const acceptedAudioTypes = ["audio/wav", "audio/x-wav", "audio/wave"] as const;
