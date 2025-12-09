import "../styles/main.css";

export default function ContactButtons() {
  return (
    <div className="contact-buttons">
      <a
        className="neon-btn"
        href="/Marin_Dulja_CV.pdf"
        download
        target="_blank"
        rel="noopener noreferrer"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6em' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
            <path d="M10 2v10m0 0l-4-4m4 4l4-4M4 16h12" stroke="#eafcfb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download CV
        </span>
      </a>
      <a
        className="neon-btn"
        href="mailto:duljamarin@gmail.com"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6em' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
            <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0l5 5 5-5" stroke="#eafcfb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Email Me
        </span>
      </a>
    </div>
  );
}
