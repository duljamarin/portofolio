import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { projects, type Project } from '../data/projects';
import GalleryModal from './GalleryModal';
import { fadeIn, DUR, STAGGER } from '../animations';

const COLS = 6;

const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.525.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const TYPE_LABEL: Record<Project['type'], string> = {
  main: 'Main',
  fullstack: 'Fullstack',
  contractor: 'Contractor',
};

const featured = projects[0];
const remaining = projects.slice(1);

const filterCounts = remaining.reduce<Record<string, number>>((acc, p) => {
  acc[p.type] = (acc[p.type] ?? 0) + 1;
  return acc;
}, {});

const filterOptions: { key: string; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: remaining.length },
  ...Object.entries(filterCounts).map(([type, count]) => ({
    key: type,
    label: TYPE_LABEL[type as Project['type']] ?? type,
    count,
  })),
];

const featuredBadge = featured.badge?.text ?? TYPE_LABEL[featured.type];

const Projects: React.FC = () => {
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(
    () => (filter === 'all' ? remaining : remaining.filter((p) => p.type === filter)),
    [filter]
  );

  return (
    <section id="projects" className="projects-section">
      <motion.div
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeIn}
        transition={{ duration: DUR * 2, ease: [0.2, 0.6, 0.2, 1] }}
      >
        <h2 className="section-title">Selected <span className="accent">Projects</span></h2>
        <p className="section-subtitle">
          A selection of work - from enterprise backends processing millions of
          transactions to full-stack apps shipped from scratch.
        </p>
      </motion.div>

      {/* Featured project */}
      <motion.div
        className="project-featured"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeIn}
        transition={{ duration: DUR * 2, ease: [0.2, 0.6, 0.2, 1] }}
      >
        <div
          className="project-featured-media"
          onClick={() => (featured.gallery ? setGalleryOpen(0) : undefined)}
        >
          {featured.gallery && featured.gallery[0] && (
            <img
              src={featured.gallery[0]}
              alt={`${featured.title} preview`}
              width={960}
              height={600}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
        <div>
          <span className="project-featured-badge">{featuredBadge}</span>
          <h3 className="project-featured-title">{featured.title}</h3>
          <p className="project-featured-desc">{featured.description}</p>
          <ul className="project-card-tags">
            {featured.tags.map((tag) => (
              <li className="project-tag" key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="project-card-links">
            {featured.links.map((link) => (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                key={link.url}
              >
                {link.label.toLowerCase().includes('github') ? <GitHubIcon /> : <ExternalIcon />}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <div className="project-filter" role="tablist" aria-label="Filter projects by type">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={filter === opt.key}
            className="project-filter-btn"
            data-active={filter === opt.key || undefined}
            onClick={() => setFilter(opt.key)}
          >
            {opt.label} <span className="project-filter-count">{opt.count}</span>
          </button>
        ))}
      </div>

      {/* Remaining project grid */}
      <motion.div className="project-grid" layout>
        {filtered.map((project, idx) => {
          const span = Math.round((project.weight ?? 1) * (COLS / 2));
          return (
            <motion.div
              className="project-card"
              data-type={project.type}
              key={project.title}
              layout
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={fadeIn}
              transition={{ duration: DUR * 2, delay: Math.min(idx * STAGGER, DUR * 4), ease: [0.2, 0.6, 0.2, 1] }}
              style={{ gridColumn: `span ${span}` }}
            >
              {project.gallery && project.gallery.length > 0 && (
                <div
                  className="project-gallery-preview"
                  onClick={() => setGalleryOpen(remaining.indexOf(project) + 1)}
                >
                  <img
                    src={project.gallery[0]}
                    alt={`${project.title} screenshot`}
                    width={600}
                    height={180}
                    loading="lazy"
                    decoding="async"
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

              <ul className="project-card-tags">
                {project.tags.map((tag) => (
                  <li className="project-tag" key={tag}>{tag}</li>
                ))}
              </ul>

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
                    {link.label.toLowerCase().includes('github') ? <GitHubIcon /> : <ExternalIcon />}
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: DUR * 2, ease: [0.2, 0.6, 0.2, 1] }}
      >
        <a
          href="https://github.com/duljamarin?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="view-all-btn"
        >
          View All Projects
          <ExternalIcon />
        </a>
      </motion.div>

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
