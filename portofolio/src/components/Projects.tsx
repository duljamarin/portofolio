import React, { useState } from 'react';
import { projects } from '../data/projects';
import GalleryModal from './GalleryModal';

const FolderIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.525.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const Projects: React.FC = () => {
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);

  return (
    <section id="projects" className="projects-section">
      <div className="section-header fade-up">
        <h2 className="section-title">
          <span className="section-number">02.</span>
          Projects
        </h2>
      </div>

      <div className="project-grid stagger-children">
        {projects.map((project, idx) => (
          <div className="project-card fade-up" key={project.title}>
            {/* Folder icon + badge */}
            <div className="project-card-icon">
              <FolderIcon />
            </div>

            {project.badge && (
              <div className="project-card-badges">
                <a
                  href={project.badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-badge featured"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.badge.text}
                </a>
              </div>
            )}

            {/* Gallery preview */}
            {project.gallery && project.gallery.length > 0 && (
              <div
                className="project-gallery-preview"
                onClick={() => setGalleryOpen(idx)}
              >
                <img
                  src={project.gallery[0]}
                  alt={`${project.title} screenshot`}
                  loading="lazy"
                />
                {project.gallery.length > 1 && (
                  <span className="gallery-count">
                    {project.gallery.length} images
                  </span>
                )}
              </div>
            )}

            <h3 className="project-card-title">{project.title}</h3>

            <p className="project-card-desc">{project.description}</p>

            <div className="project-card-tags">
              {project.tags.map((tag) => (
                <span className="project-tag" key={tag}>{tag}</span>
              ))}
            </div>

            <div className="project-card-links">
              {project.links.map((link) => (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  key={link.url}
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.label.toLowerCase().includes('github') ? (
                    <GitHubIcon />
                  ) : (
                    <ExternalIcon />
                  )}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center fade-up">
        <a
          href="https://github.com/freudmarin"
          target="_blank"
          rel="noopener noreferrer"
          className="view-all-btn"
        >
          View All Projects
          <ExternalIcon />
        </a>
      </div>

      {/* Gallery modals */}
      {projects.map((project, idx) =>
        project.gallery && project.gallery.length > 0 ? (
          <GalleryModal
            key={project.title}
            images={project.gallery}
            title={project.title}
            isOpen={galleryOpen === idx}
            onClose={() => setGalleryOpen(null)}
          />
        ) : null
      )}
    </section>
  );
};

export default Projects;
