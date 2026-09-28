"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
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
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);
  const audioInput = useRef<HTMLInputElement>(null);
  const imagePreviewUrl = useRef<string | null>(null);
  const audioPreviewUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
      if (audioPreviewUrl.current) URL.revokeObjectURL(audioPreviewUrl.current);
    };
  }, []);

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError("");
    setNotice("");

    if (!file) {
      removeImage();
      return;
    }

    if (!acceptedImageTypes.includes(file.type as (typeof acceptedImageTypes)[number])) {
      removeImage();
      setError("Choose a PNG, JPEG, or WebP image.");
      return;
    }

    if (file.size > uploadLimits.imageBytes) {
      removeImage();
      setError("The image must be 5 MB or smaller.");
      return;
    }

    if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
    imagePreviewUrl.current = URL.createObjectURL(file);
    setImagePreview(imagePreviewUrl.current);
    setImage(file);
  }

  function chooseAudio(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError("");
    setNotice("");

    if (!file) {
      removeAudio();
      return;
    }

    const isWav =
      acceptedAudioTypes.includes(file.type as (typeof acceptedAudioTypes)[number]) ||
      file.name.toLowerCase().endsWith(".wav");

    if (!isWav) {
      removeAudio();
      setError("Choose a WAV file. OneContext intentionally does not transcode audio.");
      return;
    }

    if (file.size > uploadLimits.audioBytes) {
      removeAudio();
      setError("The voice note must be 10 MB or smaller.");
      return;
    }

    if (audioPreviewUrl.current) URL.revokeObjectURL(audioPreviewUrl.current);
    audioPreviewUrl.current = URL.createObjectURL(file);
    setAudioPreview(audioPreviewUrl.current);
    setAudio(file);
  }

  function removeImage() {
    if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
    imagePreviewUrl.current = null;
    setImagePreview(null);
    setImage(null);
    if (imageInput.current) imageInput.current.value = "";
  }

  function removeAudio() {
    if (audioPreviewUrl.current) URL.revokeObjectURL(audioPreviewUrl.current);
    audioPreviewUrl.current = null;
    setAudioPreview(null);
    setAudio(null);
    if (audioInput.current) audioInput.current.value = "";
  }

  function validateSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!text.trim() && !image && !audio) {
      setError("Add written context, a screenshot, or a WAV voice note before analyzing.");
      return;
    }

    setNotice("Inputs are valid and ready for the server integration.");
  }

  return (
    <form className="input-panel" onSubmit={validateSubmission}>
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
          value={text}
          maxLength={uploadLimits.textCharacters}
          onChange={(event) => {
            setText(event.target.value);
            setError("");
            setNotice("");
          }}
          placeholder="This started happening after I changed my account settings…"
        />
        <span className="field-limit">
          {text.length} / {uploadLimits.textCharacters.toLocaleString()}
        </span>
      </div>

      <div className="upload-grid">
        <div className={`upload-box ${image ? "has-file" : ""}`}>
          <label htmlFor="image">
            <input
              ref={imageInput}
              id="image"
              name="image"
              type="file"
              accept={acceptedImageTypes.join(",")}
              onChange={chooseImage}
            />
            {imagePreview ? (
              <span className="image-preview">
                <Image src={imagePreview} alt="Selected screenshot preview" fill unoptimized />
              </span>
            ) : (
              <span className="upload-content">
                <span className="file-icon">
                  <UploadIcon kind="image" />
                </span>
                <strong>Add screenshot</strong>
                <small>PNG, JPEG or WebP · up to 5 MB</small>
              </span>
            )}
          </label>
          {image && (
            <div className="file-footer">
              <span title={image.name}>{image.name}</span>
              <button type="button" onClick={removeImage} aria-label="Remove screenshot">
                ×
              </button>
            </div>
          )}
        </div>

        <div className={`upload-box ${audio ? "has-file" : ""}`}>
          <label htmlFor="audio">
            <input
              ref={audioInput}
              id="audio"
              name="audio"
              type="file"
              accept={`${acceptedAudioTypes.join(",")},.wav`}
              onChange={chooseAudio}
            />
            <span className="upload-content">
              <span className="file-icon">
                <UploadIcon kind="audio" />
              </span>
              <strong title={audio?.name}>{audio?.name ?? "Add voice note"}</strong>
              <small>{audio ? "Ready for native audio input" : "WAV · up to 10 MB"}</small>
            </span>
          </label>
          {audio && audioPreview && (
            <div className="audio-footer">
              <audio controls src={audioPreview}>
                Your browser does not support audio playback.
              </audio>
              <button type="button" onClick={removeAudio} aria-label="Remove voice note">
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="form-message error-message" role="alert">
          <span>!</span> {error}
        </div>
      )}

      {notice && (
        <div className="form-message notice-message" role="status">
          <span>✓</span> {notice}
        </div>
      )}

      <button className="analyze-button" type="submit">
        Analyze issue
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M14 7l5 5-5 5" />
        </svg>
      </button>
      <p className="privacy-note">
        WAV is intentional: this demo focuses on native multimodal reasoning, not transcoding.
      </p>
    </form>
  );
}
