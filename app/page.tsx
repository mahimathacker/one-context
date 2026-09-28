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

        <span className="demo-badge">
          <i /> Developer demo
        </span>
      </header>

      <div className="page-shell" id="top">
        <section className="hero">
          <p className="eyebrow">One model · One request · Shared context</p>
          <h1>
            Let the model see the <em>whole issue.</em>
          </h1>
          <p className="hero-copy">
            Combine written context, a screenshot, and a WAV voice note in one native
            multimodal inference workflow with Together AI Serverless.
          </p>

          <div className="flow-chips" aria-label="OneContext input flow">
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
