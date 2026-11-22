import React from 'react';
import Footer from '../components/Footer';
import { MentorBook, MentorOffers, MentorSteps } from '../components/Mentoring';
import { Reveal } from '../components/fx/Reveal';
import { CrossLinks, FaqList, PageHero, PageSection } from '../components/page/PageParts';
import { mentoringCopy } from '../data/mentoring';
import { usePage } from '../pageContext';
import { PERSON, pathOf } from '../seo/site';

/** /mentoring/ (English) and /sq/mentorim-java/ (Albanian): same layout, copy from mentoring.ts. */
const MentoringPage: React.FC = () => {
  const { lang } = usePage();
  const routeId = lang === 'sq' ? 'mentoringSq' : 'mentoring';
  const copy = mentoringCopy[lang];
  const page = copy.page;
  const [mockOffer, trainingOffer] = copy.offers;

  return (
    <>
      <PageHero
        routeId={routeId}
        eyebrow={page.eyebrow}
        title={page.h1(PERSON)}
        lede={page.lede}
        languageSwitch={page.languageSwitch}
      >
        <div className="hero-ctas page-ctas">
          <a href={mockOffer.cta.href} className="btn-primary">{mockOffer.cta.label}</a>
          <a href={trainingOffer.cta.href} className="btn-ghost">{trainingOffer.cta.label}</a>
        </div>
      </PageHero>

      <PageSection title={page.whoHeading}>
        <ul className="page-list page-list--large">
          {page.who.map((line) => (
            <Reveal as="li" key={line} y={12}>
              {line}
            </Reveal>
          ))}
        </ul>
      </PageSection>

      <PageSection title={page.offersHeading} className="mentoring-page-offers">
        <MentorOffers lang={lang} />
      </PageSection>

      <PageSection title={page.mockHeading}>
        <Reveal as="p" className="page-prose">{page.mockText}</Reveal>
      </PageSection>

      <PageSection title={page.trainingHeading}>
        {page.trainingText.map((paragraph) => (
          <Reveal as="p" key={paragraph} className="page-prose">{paragraph}</Reveal>
        ))}
      </PageSection>

      <PageSection title={page.bookHeading}>
        <MentorSteps lang={lang} />
        <MentorBook lang={lang} />
      </PageSection>

      <PageSection title={page.mentorHeading}>
        {page.mentorText(PERSON).map((paragraph) => (
          <Reveal as="p" key={paragraph} className="page-prose">{paragraph}</Reveal>
        ))}
        {page.quote && (
          <Reveal className="page-quote" y={12}>
            <blockquote>
              <p>&ldquo;{page.quote.text}&rdquo;</p>
            </blockquote>
            <p className="page-quote-cite">{page.quote.cite}</p>
          </Reveal>
        )}
        <CrossLinks
          links={[
            { href: pathOf('home'), label: page.links.home, hrefLang: lang === 'sq' ? 'en' : undefined },
            { href: pathOf('freelance'), label: page.links.freelance, hrefLang: lang === 'sq' ? 'en' : undefined },
          ]}
        />
      </PageSection>

      <PageSection title={page.faqHeading}>
        <FaqList items={page.faq} />
      </PageSection>

      <Footer />
    </>
  );
};

export default MentoringPage;
