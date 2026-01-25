import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import AnimationWrapper from '../components/AnimationWrapper';

const Home: React.FC = () => {
   return (
      <AnimationWrapper>
         <section id="projects" className="container" style={{ textAlign: 'center' }}>
            <h2 className="fancy" style={{color: '#fff'}}>Projects</h2>
            <div className="project-grid">
               {projects.map((project) => (
                  <ProjectCard key={project.title} project={project} />
               ))}
            </div>
         </section>
      </AnimationWrapper>
      );
   };

   export default Home;