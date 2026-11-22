import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { OfferGrid } from '../components/Offer';
import { LockIn } from '../components/fx/LockIn';
import { Reveal } from '../components/fx/Reveal';
import { ArrowIcon, CrossLinks, FaqList, PageHero, PageSection } from '../components/page/PageParts';
import { contact, emailHref } from '../data/contact';
import { certifications } from '../data/education';
import { freelance } from '../data/freelance';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { PERSON, pathOf } from '../seo/site';

const featuredProjects = projects.filter((project) => project.featured);

const FreelancePage: React.FC = () => (
  <>
    <PageHero
      routeId="freelance"
      eyebrow={freelance.eyebrow}
      title={freelance.h1(PERSON)}
      lede={freelance.lede(PERSON)}
    >
      <div className="hero-ctas page-ctas">
        <a href={emailHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
          {contact.ctaLabel} <ArrowIcon />
        </a>
        <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <FaWhatsapp aria-hidden="true" /> {contact.whatsapp.label}
        </a>
      </div>
    </PageHero>

    <PageSection title={freelance.servicesHeading}>
      <Reveal as="p" className="page-prose">{freelance.servicesIntro}</Reveal>
      <OfferGrid />
    </PageSection>

    <PageSection title={freelance.domainsHeading}>
      <div className="page-cards">
        {freelance.domains.map((domain, i) => (
          <LockIn key={domain.title} className="page-card-lockin fx-ring" index={i} intensity={0.6}>
            <article className="page-card">
              <h3 className="page-card-title">{domain.title}</h3>
              <p>{domain.text}</p>
            </article>
          </LockIn>
        ))}
      </div>
    </PageSection>

    <PageSection title={freelance.stackHeading}>
      <Reveal as="p" className="page-prose">{freelance.stackIntro}</Reveal>
      <div className="stack-groups">
        {skillGroups.map((group) => (
          <Reveal key={group.id} className="stack-group" y={16}>
            <h3 className="card-label">{group.label}</h3>
            <ul className="deck-tags">
              {group.skills.map((skill) => (
                <li key={skill} className="deck-tag">{skill}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <Reveal className="stack-certs" y={12}>
        <h3 className="card-label">{freelance.certificationsLabel}</h3>
        <ul className="page-list">
          {certifications.map((cert) => (
            <li key={cert.title}>
              {cert.verifyUrl ? (
                <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">
                  {cert.code ? `${cert.title} (${cert.code})` : cert.title}
                </a>
              ) : (
                cert.title
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </PageSection>

    <PageSection title={freelance.termsHeading}>
      <dl className="terms-list">
        {freelance.terms.map((item) => (
          <Reveal key={item.term} className="terms-row" y={12}>
            <dt className="card-label">{item.term}</dt>
            <dd>{item.text}</dd>
          </Reveal>
        ))}
      </dl>
    </PageSection>

    <PageSection title={freelance.projectsHeading}>
      <div className="project-cards">
        {featuredProjects.map((project, i) => {
          const image = project.gallery?.[0];
          return (
            <LockIn key={project.title} as="article" className="project-card fx-ring" index={i} intensity={0.6}>
              {image && (
                <div className="project-card-media">
                  <img
                    src={image.src}
                    alt={`${project.title} screenshot`}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="project-card-body">
                {project.label && <p className="card-label">{project.label}</p>}
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description}</p>
                <ul className="deck-tags">
                  {project.tags.map((tag) => (
                    <li key={tag} className="deck-tag">{tag}</li>
                  ))}
                </ul>
                <div className="deck-links">
                  {project.links.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="deck-link">
                      {link.label} <ArrowIcon />
                    </a>
                  ))}
                </div>
              </div>
            </LockIn>
          );
        })}
      </div>
    </PageSection>

    <PageSection title={freelance.faqHeading}>
      <FaqList items={freelance.faq} />
      <CrossLinks
        links={[
          { href: pathOf('mentoring'), label: freelance.links.mentoring },
          { href: pathOf('home'), label: freelance.links.home },
        ]}
      />
    </PageSection>

    <Contact />
    <Footer />
  </>
);

export default FreelancePage;
