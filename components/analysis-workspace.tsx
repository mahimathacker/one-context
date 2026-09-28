"use client";

import { ReactNode, useState } from "react";
import { analysisResponseSchema, AnalysisResponse } from "@/lib/analysis";
import { IssueIntakeForm } from "@/components/issue-intake-form";

function ResultBlock({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="result-block">
      <div className="result-block-title">
        <span>{index}</span>
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function DetailList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className="empty-value">{empty}</p>;

  return (
    <ul className="detail-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function ResultPanel({
  result,
  isAnalyzing,
}: {
  result: AnalysisResponse | null;
  isAnalyzing: boolean;
}) {
  return (
    <aside className={`result-panel ${result ? "has-result" : ""}`} aria-live="polite">
      <div className="panel-heading result-heading">
        <div>
          <span className="step">02</span>
          <h2>Structured understanding</h2>
        </div>
        {result && <span className="result-status">Analysis complete</span>}
      </div>

      {!result && !isAnalyzing && (
        <div className="placeholder-copy">
          <span>TXT + IMG + WAV</span>
          <h3>One result, grounded in every input</h3>
          <p>The validated analysis will appear here after inference.</p>
        </div>
      )}

      {isAnalyzing && (
        <div className="result-loading">
          <div className="signal-scan" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <p>Inkling is reasoning over the supplied context.</p>
          <span>One multimodal request in progress</span>
        </div>
      )}

      {result && (
        <div className="result-content">
          <div className="result-meta">
            <span>{result.meta.model}</span>
            <div>
              {result.meta.modalities.map((modality) => (
                <b key={modality}>{modality}</b>
              ))}
            </div>
          </div>

          <ResultBlock index="01" title="Summary">
            <p className="summary-text">{result.data.summary}</p>
          </ResultBlock>

          <div className="result-grid">
            <ResultBlock index="02" title="Intent">
              <p>{result.data.intent}</p>
            </ResultBlock>
            <ResultBlock index="03" title="Suggested action">
              <p>{result.data.suggested_action}</p>
            </ResultBlock>
          </div>

          <ResultBlock index="04" title="Important details">
            <DetailList
              items={result.data.important_details}
              empty="No important details identified."
            />
          </ResultBlock>

          <div className="result-grid">
            <ResultBlock index="05" title="Visual context">
              <DetailList
                items={result.data.visual_context}
                empty="No image context supplied."
              />
            </ResultBlock>
            <ResultBlock index="06" title="Audio context">
              <DetailList
                items={result.data.audio_context}
                empty="No audio context supplied."
              />
            </ResultBlock>
          </div>
        </div>
      )}
    </aside>
  );
}

export function AnalysisWorkspace() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [serverError, setServerError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function analyze(formData: FormData) {
    setServerError("");
    setResult(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof payload === "object" && payload && "error" in payload
            ? String(payload.error)
            : "Analysis failed. Please try again.";
        throw new Error(message);
      }

      const parsed = analysisResponseSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error("The server returned an unexpected response.");
      }

      setResult(parsed.data);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Analysis failed. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <section className="workspace" aria-label="OneContext demo workspace">
      <IssueIntakeForm
        isAnalyzing={isAnalyzing}
        serverError={serverError}
        onAnalyze={analyze}
        onInputChange={() => setServerError("")}
      />
      <ResultPanel result={result} isAnalyzing={isAnalyzing} />
    </section>
  );
}
