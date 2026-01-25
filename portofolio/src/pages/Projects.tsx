import React from 'react';
import { projects } from '../data/projects';
import AnimationWrapper from '../components/AnimationWrapper';
import ProjectCard from '../components/ProjectCard';

const Projects: React.FC = () => {
  return (
    <AnimationWrapper>
      <section className="container" style={{ marginTop: '3rem' }}>
        <AnimationWrapper delay={0.1}>
          <h1 className="fancy" style={{ textAlign: 'center' }}>Innovative Projects</h1>
        </AnimationWrapper>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Projects;