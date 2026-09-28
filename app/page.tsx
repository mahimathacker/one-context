import { IssueIntakeForm } from "@/components/issue-intake-form";

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

        <section className="workspace" aria-label="OneContext demo workspace">
          <IssueIntakeForm />

          <aside className="result-placeholder">
            <div className="panel-heading">
              <div>
                <span className="step">02</span>
                <h2>Structured understanding</h2>
              </div>
            </div>
            <div className="placeholder-copy">
              <span>TXT + IMG + WAV</span>
              <h3>One result, grounded in every input</h3>
              <p>The validated analysis will appear here after inference.</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
