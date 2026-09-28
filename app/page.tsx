import { AnalysisWorkspace } from "@/components/analysis-workspace";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OneContext home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          OneContext
        </a>

        <div className="header-meta" aria-label="Inference configuration">
          <span>Model</span>
          <strong>Inkling</strong>
          <span>Runtime</span>
          <strong>Serverless</strong>
        </div>
      </header>

      <div className="page-shell" id="top">
        <section className="hero">
          <div className="hero-index" aria-hidden="true">
            OC / 001
          </div>
          <p className="eyebrow">Multimodal issue intake / one inference call</p>
          <h1>
            Three inputs.<br />
            <em>One shared context.</em>
          </h1>
          <p className="hero-copy">
            Give Inkling the written report, the screenshot, and the original voice note
            together—without building separate transcription and vision pipelines.
          </p>

          <div className="signal-line" aria-label="OneContext input flow">
            <span>Text</span>
            <b>+</b>
            <span>Image</span>
            <b>+</b>
            <span>Audio</span>
            <i>
              <ArrowIcon />
            </i>
            <strong>One inference</strong>
          </div>
        </section>

        <AnalysisWorkspace />
      </div>
    </main>
  );
}
