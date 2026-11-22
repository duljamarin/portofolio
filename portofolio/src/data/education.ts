// Degrees and certifications. EducationSection renders them; the Person JSON-LD
// (alumniOf, hasCredential) and the mentoring and freelance copy read them.

export type Degree = {
  degree: string;
  school: string;
  grade: string;
  period: string;
  url: string;
};

export type Certification = {
  issuer: string;
  title: string;
  /** Exam code, when the certification has one. */
  code?: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  meta?: string;
  verifyUrl?: string;
  stat?: { value: string; label: string };
};

export const education: Degree[] = [
  { degree: 'Bachelor of Computer Science', school: 'University of Tirana', grade: '8.18/10', period: '2015 – 2018', url: 'https://www.unitir.edu.al/' },
  { degree: 'MSc. of Computer Science', school: 'University of Tirana', grade: '8.1/10', period: '2018 – 2020', url: 'https://www.unitir.edu.al/' },
];

export const certifications: Certification[] = [
  {
    issuer: 'Microsoft',
    title: 'Microsoft Certified: Azure Developer Associate',
    code: 'AZ-204',
    image: '/azure-certification.webp',
    alt: 'Microsoft Certified: Azure Developer Associate',
    width: 800,
    height: 440,
    verifyUrl: 'https://learn.microsoft.com/en-us/users/marindulja-4281/credentials/95bcad6e81b05db8',
  },
  {
    issuer: 'TestGorilla',
    title: 'TestGorilla: Spring - 98th Percentile',
    image: '/testgorilla-spring.webp',
    alt: 'TestGorilla Spring assessment, verified result, 98th percentile',
    width: 800,
    height: 537,
    meta: 'Verified result · valid through August 2028',
    stat: { value: '98th', label: 'percentile' },
  },
];

/** The Azure certification, with its exam code: "Microsoft Certified: Azure Developer Associate (AZ-204)". */
export const azureCertification = certifications[0];
export const azureCertificationName = `${azureCertification.title} (${azureCertification.code})`;

/** The university both degrees are from. */
export const university = { name: education[0].school, url: education[0].url };
