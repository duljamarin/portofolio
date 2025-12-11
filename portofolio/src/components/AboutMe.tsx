import React, { useEffect, useState } from 'react';
import '../styles/main.css';

const aboutText = [
  "Hi, I'm Marin Dulja, a full-stack software engineer focused on building scalable, reliable, and modern web applications.",
  "I work with Java, Kotlin, Spring Boot and React.js to deliver solutions that are fast, maintainable, and built to last."
];

const TYPING_SPEED = 45; // ms per character (slower)

const AboutMe: React.FC = () => {
  const [displayed, setDisplayed] = useState(['', '']);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    let line = 0;
    let char = 0;
    let timer: number;
    function type() {
      if (line < aboutText.length) {
        setActiveLine(line);
        if (char < aboutText[line].length) {
          setDisplayed(prev => {
            const updated = [...prev];
            updated[line] = aboutText[line].slice(0, char + 1);
            return updated;
          });
          char++;
          timer = window.setTimeout(type, TYPING_SPEED);
        } else {
          line++;
          char = 0;
          timer = window.setTimeout(type, TYPING_SPEED * 12); // pause between lines
        }
      }
    }
    type();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="about" className="hero-with-photo-section">
      <div className="hero-content">
        <div className="hero-photo">
          <img 
            src="/photo_portofolio.jpg" 
            alt="Marin Dulja - Software Engineer" 
            className="profile-photo"
          />
        </div>
        <div className="hero-text">
          {displayed.map((line, i) => (
            <p
              key={i}
              className="about-text about-animate"
              style={{ color: 'var(--text-soft)', fontSize: '1.35rem', lineHeight: 1.6, minHeight: '2.2em' }}
            >
              {line}
              {i === activeLine && line.length < aboutText[i].length && <span className="blinking-cursor">|</span>}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
