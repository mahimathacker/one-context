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

        <section className="workspace-shell" aria-label="OneContext demo workspace">
          <div>
            <span className="step">01</span>
            <p>Multimodal issue intake</p>
          </div>
          <span className="workspace-status">Interface coming next</span>
        </section>
      </div>
    </main>
  );
}
