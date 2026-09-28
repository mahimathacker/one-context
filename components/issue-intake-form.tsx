"use client";

import { FormEvent } from "react";
import {
  acceptedAudioTypes,
  acceptedImageTypes,
  uploadLimits,
} from "@/lib/analysis";

function UploadIcon({ kind }: { kind: "image" | "audio" }) {
  return kind === "image" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="2" />
      <path d="m5 18 5-5 3 3 2-2 4 4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="3" width="8" height="12" rx="4" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
    </svg>
  );
}

export function IssueIntakeForm() {
  function preventSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="input-panel" onSubmit={preventSubmission}>
      <div className="panel-heading">
        <div>
          <span className="step">01</span>
          <h2>Add issue context</h2>
        </div>
        <p>Every input is optional. Add one or combine all three.</p>
      </div>

      <label className="field-label" htmlFor="context">
        Written context <span>Optional</span>
      </label>
      <div className="textarea-wrap">
        <textarea
          id="context"
          name="text"
          maxLength={uploadLimits.textCharacters}
          placeholder="This started happening after I changed my account settings…"
        />
        <span className="field-limit">
          Up to {uploadLimits.textCharacters.toLocaleString()} characters
        </span>
      </div>

      <div className="upload-grid">
        <label className="upload-box" htmlFor="image">
          <input
            id="image"
            name="image"
            type="file"
            accept={acceptedImageTypes.join(",")}
          />
          <span className="file-icon">
            <UploadIcon kind="image" />
          </span>
          <strong>Add screenshot</strong>
          <small>PNG, JPEG or WebP · up to 5 MB</small>
        </label>

        <label className="upload-box" htmlFor="audio">
          <input
            id="audio"
            name="audio"
            type="file"
            accept={`${acceptedAudioTypes.join(",")},.wav`}
          />
          <span className="file-icon">
            <UploadIcon kind="audio" />
          </span>
          <strong>Add voice note</strong>
          <small>WAV · up to 10 MB</small>
        </label>
      </div>

      <button className="analyze-button" type="submit">
        Analyze issue
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M14 7l5 5-5 5" />
        </svg>
      </button>
      <p className="privacy-note">
        Your API key stays on the server. Inference wiring is added in a later step.
      </p>
    </form>
  );
}
