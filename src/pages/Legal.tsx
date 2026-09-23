import './Legal.css';

export function PrivacyPolicy() {
  return (
    <section className="section legal-page">
      <div className="container legal-page__inner">
        <span className="eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
        <p>
          This page is a placeholder for BEEMS' privacy policy. It should describe what
          personal information is collected through this site (for example, messages
          submitted via the Contact page), how it is stored in Cloud Firestore, how long it
          is kept, and who it may be shared with.
        </p>
        <p>
          Replace this text with BEEMS' full privacy policy before launching the site
          publicly.
        </p>
      </div>
    </section>
  );
}

export function AccessibilityStatement() {
  return (
    <section className="section legal-page">
      <div className="container legal-page__inner">
        <span className="eyebrow">Legal</span>
        <h1>Accessibility Statement</h1>
        <p>
          BEEMS is committed to making this website usable for everyone, including people
          using screen readers, keyboard navigation, or assistive technology. The site is
          built with semantic HTML, visible focus states, and responsive layouts that work
          across desktop, tablet, and mobile devices.
        </p>
        <p>
          If you experience any difficulty accessing content on this site, please get in
          touch via the Contact page so we can help and improve the experience.
        </p>
      </div>
    </section>
  );
}
