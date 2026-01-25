import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/projects';
import GalleryModal from './GalleryModal';

type ProjectCardProps = {
   project: Project;
};

const cardVariants = {
   hidden: { opacity: 0, y: 40 },
   visible: { opacity: 1, y: 0 },
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
   const [zoomed, setZoomed] = useState(false);
   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
   const cardRef = useRef<HTMLDivElement>(null);

   const handleCardClick = () => {
      setZoomed(true);
      setTimeout(() => setZoomed(false), 200);
   };

   const handleGalleryOpen = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (project.gallery && project.gallery.length > 0) {
         setIsGalleryOpen(true);
      }
   };

   return (
      <>
         <motion.div
            ref={cardRef}
            className={`project-card${zoomed ? ' zoomed-inplace-card' : ''}${project.gallery && project.gallery.length > 0 ? ' project-card-featured' : ''}`}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
         >
         {/* Featured Badge */}
         {project.badge && (
            <div style={{
               marginBottom: '0.75rem',
               display: 'inline-block'
            }}>
               <a
                  href={project.badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                     display: 'inline-flex',
                     alignItems: 'center',
                     gap: '6px',
                     padding: '6px 12px',
                     borderRadius: '6px',
                     fontSize: '0.85rem',
                     fontWeight: 600,
                     fontFamily: 'Montserrat, Inter, sans-serif',
                     background: project.badge.color === 'purple' 
                        ? 'linear-gradient(135deg, #5a4fcf 0%, #5e3a8e 100%)'
                        : project.badge.color === 'blue'
                        ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                        : project.badge.color === 'green'
                        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                        : project.badge.color === 'orange'
                        ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
                        : 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                     color: '#fff',
                     textDecoration: 'none',
                     boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                     transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                     cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'translateY(-2px)';
                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
                  }}
                  onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {project.badge.text}
               </a>
            </div>
         )}

         <div className="project-title" style={{
            fontFamily: 'Montserrat, Inter, Segoe UI, Roboto, Arial, sans-serif',
            color: 'var(--neon)',
            fontWeight: 800,
            fontSize: '1.55rem',
            letterSpacing: '0.02em',
            textShadow: '0 0 8px rgba(79,248,210,0.25)',
            marginBottom: '1rem'
         }}>{project.title}</div>

            {project.gallery && project.gallery.length > 0 ? (
               <div className="project-gallery-featured" onClick={handleGalleryOpen}>
                  <div className="gallery-container-featured">
                     <img
                        src={project.gallery[0]}
                        alt={`${project.title} - Featured screenshot`}
                        loading="lazy"
                     />
                     <div className="gallery-overlay">
                        <span className="gallery-hint">🖼️ Click to View Full Gallery</span>
                     </div>
                  </div>
                  {project.gallery.length > 1 && (
                     <div className="gallery-badge-featured">{project.gallery.length} Images</div>
                  )}
               </div>
            ) : null}

         <div className="project-desc" style={{
            fontFamily: 'Montserrat, Inter, Segoe UI, Roboto, Arial, sans-serif',
            color: 'var(--text-main)',
            fontWeight: 500,
            fontSize: '1.05rem',
            letterSpacing: '0.01em'
         }}>{project.description}</div>
         <div className="project-tags">
            {project.tags.map((tag) => (
               <span className="tag" key={tag}>{tag}</span>
            ))}
         </div>
         <div className="project-links">
            {project.links.map((link) => (
               <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.url} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {link.label.toLowerCase().includes('github') ? (
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }} aria-label="GitHub">
                        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.525.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                     </svg>
                  ) : null}
                  {link.label}
               </a>
            ))}
         </div>
      </motion.div>

      {/* Gallery Modal - Only render for projects with gallery */}
      {project.gallery && project.gallery.length > 0 && (
         <GalleryModal
            images={project.gallery}
            title={project.title}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
         />
      )}
      </>
   );
};

export default ProjectCard;