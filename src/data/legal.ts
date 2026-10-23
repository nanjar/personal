export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPage = {
  slug: string;
  navLabel: string;
  title: string;
  accent: string;
  subtitle: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

export const legalPages: LegalPage[] = [
  {
    slug: 'privacy-policy',
    navLabel: 'Privacy',
    title: 'Privacy',
    accent: 'policy.',
    subtitle: 'Your privacy matters. Here is what this site does — and does not do — with your information.',
    description:
      'Privacy policy for NanjarBudiman.com, covering information collection, cookies, third-party services, and data security.',
    updated: '9 June 2026',
    sections: [
      {
        heading: 'Information we collect',
        paragraphs: [
          'We may collect personal information voluntarily provided by visitors, including names, email addresses, and contact details when you get in touch.',
          'We may also collect non-personal information such as browser type, IP address, pages visited, and website usage analytics.',
        ],
      },
      {
        heading: 'How we use information',
        bullets: [
          'To respond to inquiries and collaboration requests.',
          'To improve website performance and accessibility.',
          'To understand traffic trends and which work is useful.',
          'To maintain the security and integrity of the site.',
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'NanjarBudiman.com may use cookies and similar technologies to improve user experience and website functionality.',
          'Third-party embeds — such as YouTube videos or Spotify players — may set their own cookies when you choose to load them. You can control cookies through your browser settings.',
        ],
      },
      {
        heading: 'Third-party services',
        paragraphs: [
          'We may use analytics, hosting, video, and music-streaming providers that process information according to their own privacy policies.',
        ],
      },
      {
        heading: 'Data security',
        paragraphs: [
          'Reasonable security measures are implemented to protect your information. No method of transmission or storage is completely secure, so absolute security cannot be guaranteed.',
        ],
      },
      {
        heading: 'External links',
        paragraphs: [
          'We are not responsible for the privacy practices of external websites linked from this site. Review their policies before sharing information with them.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'This Privacy Policy may be updated periodically. The effective date at the top of this page reflects the current version.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For privacy-related inquiries, please reach out through the contact page or send a direct message on Instagram.',
        ],
      },
    ],
  },
  {
    slug: 'terms-of-service',
    navLabel: 'Terms',
    title: 'Terms of',
    accent: 'service.',
    subtitle: 'The ground rules for using this website and its content.',
    description:
      'Terms of service for NanjarBudiman.com, covering intellectual property, user conduct, liability, and governing law.',
    updated: '9 June 2026',
    sections: [
      {
        heading: 'Acceptance',
        paragraphs: ['By accessing this website, you agree to comply with these Terms of Service.'],
      },
      {
        heading: 'Intellectual property',
        paragraphs: ['All content published on this website is protected by intellectual property laws.'],
        bullets: [
          'Personal and non-commercial sharing is permitted with clear attribution.',
          'Unauthorized reproduction, redistribution, or commercial use is prohibited.',
          'AI-assisted works may also be subject to the terms of the models and platforms used to create them.',
        ],
      },
      {
        heading: 'User conduct',
        bullets: [
          'No unlawful use of this website.',
          'No malicious activity, scraping that degrades service, or attempted intrusion.',
          'No unauthorized access attempts against this site or its infrastructure.',
        ],
      },
      {
        heading: 'Disclaimer',
        paragraphs: [
          'Information provided on this website is for general informational and educational purposes only. It should not be treated as professional advice.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          'NanjarBudiman.com shall not be liable for any damages arising from the use of this website or reliance on the information published here.',
        ],
      },
      {
        heading: 'External links',
        paragraphs: [
          'External links are provided for convenience and do not imply endorsement. We are not responsible for the content or availability of third-party sites.',
        ],
      },
      {
        heading: 'Updates',
        paragraphs: ['We reserve the right to modify these Terms at any time. Continued use constitutes acceptance.'],
      },
      {
        heading: 'Governing law',
        paragraphs: [
          'These Terms shall be governed by the applicable laws of the Republic of Indonesia.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: ['Please reach out through the contact page for any legal inquiries.'],
      },
    ],
  },
  {
    slug: 'cookie-policy',
    navLabel: 'Cookies',
    title: 'Cookie',
    accent: 'policy.',
    subtitle: 'A short, clear note on cookies and the third-party embeds that may use them.',
    description:
      'Cookie policy for NanjarBudiman.com, including how YouTube and Spotify embeds may set cookies.',
    updated: '9 June 2026',
    sections: [
      {
        heading: 'What cookies are',
        paragraphs: [
          'Cookies are small text files stored by your browser. They help websites remember preferences, measure traffic, or enable embedded media.',
        ],
      },
      {
        heading: 'Cookies on this site',
        paragraphs: [
          'This site is designed to work without advertising cookies. It does not currently run an advertising network or sell visitor data.',
        ],
      },
      {
        heading: 'Third-party embeds',
        paragraphs: [
          'When you play a video or load a Spotify player, the relevant provider may set cookies or similar technologies. Those services operate under their own cookie and privacy policies.',
        ],
      },
      {
        heading: 'Managing cookies',
        paragraphs: [
          'You can block or delete cookies through your browser settings. Blocking third-party cookies may prevent embedded video or audio players from working properly.',
        ],
      },
    ],
  },
  {
    slug: 'disclaimer',
    navLabel: 'Disclaimer',
    title: 'General',
    accent: 'disclaimer.',
    subtitle: 'Transparency about the information, advice, and AI-assisted material published here.',
    description:
      'Disclaimer for NanjarBudiman.com covering general information, professional advice, AI-generated content, and liability.',
    updated: '9 June 2026',
    sections: [
      {
        heading: 'General information',
        paragraphs: [
          'The information provided on NanjarBudiman.com is published in good faith and for general informational and educational purposes only.',
          'While every effort is made to ensure accuracy and reliability, no warranties or guarantees are made regarding completeness, accuracy, or suitability of any information published here.',
        ],
      },
      {
        heading: 'Professional advice',
        paragraphs: [
          'Nothing on this website should be considered legal, financial, business, medical, or professional advice. Seek appropriate professional consultation before making decisions based on this content.',
        ],
      },
      {
        heading: 'AI-generated content',
        paragraphs: [
          'Some articles, music, images, videos, or other creative materials may be generated or enhanced using artificial intelligence technologies. All AI-assisted content is reviewed and curated before publication; however, AI outputs may contain inaccuracies or unintended errors.',
        ],
      },
      {
        heading: 'External links',
        paragraphs: [
          'This website may link to third-party sites for additional information or convenience. NanjarBudiman.com has no control over their content or availability and does not necessarily endorse the views expressed there.',
        ],
      },
      {
        heading: 'Copyright and fair use',
        paragraphs: [
          'All original content published on this website is protected by copyright laws unless otherwise stated. References, quotations, and external media are used under fair-use principles where applicable.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          'Under no circumstances shall NanjarBudiman.com or its owner be liable for any loss or damage arising from the use of this website or reliance on any information provided.',
        ],
      },
      {
        heading: 'Updates',
        paragraphs: [
          'This disclaimer may be updated periodically without prior notice. Continued use of the website constitutes acceptance of any modifications.',
        ],
      },
    ],
  },
  {
    slug: 'ai-content-disclosure',
    navLabel: 'AI disclosure',
    title: 'AI content',
    accent: 'disclosure.',
    subtitle: 'Where AI ends, where the human begins, and what that means for the work you see here.',
    description:
      'AI content disclosure for NanjarBudiman.com, explaining how artificial intelligence is used across music, video, and writing.',
    updated: '9 June 2026',
    sections: [
      {
        heading: 'AI is part of the process',
        paragraphs: [
          'The work on this site is AI-assisted by design. Music, visuals, video, and writing may be generated, edited, or enhanced with generative models — including text, image, audio, and video tools.',
          'AI is used as a production tool, not as a replacement for authorship. Direction, selection, editing, and final judgment remain human.',
        ],
      },
      {
        heading: 'What may be AI-assisted',
        bullets: [
          'Songs and instrumental pieces, including vocals, arrangement, and production elements.',
          'Cinematic visuals, keyframes, image-to-video sequences, and post-production elements.',
          'Cover artwork, thumbnails, and some editorial images.',
          'Drafting, research assistance, or editing support for written notes.',
        ],
      },
      {
        heading: 'Human review',
        paragraphs: [
          'AI-assisted material is reviewed before publication. That does not guarantee factual accuracy or freedom from bias; generative outputs can contain errors, artifacts, or unintended resemblances.',
        ],
      },
      {
        heading: 'Transparency and credit',
        paragraphs: [
          'Specific tools are named in articles where that information is useful. If you need to know how a particular piece was made — or whether it is suitable for a specific use — ask before relying on it.',
        ],
      },
      {
        heading: 'Third-party terms',
        paragraphs: [
          'AI-generated work may be subject to the terms of the platforms and models used in its creation. Those terms can affect commercial use, attribution, and distribution.',
        ],
      },
    ],
  },
  {
    slug: 'editorial-policy',
    navLabel: 'Editorial',
    title: 'Editorial',
    accent: 'policy.',
    subtitle: 'How the journal is written, reviewed, corrected, and kept honest.',
    description:
      'Editorial policy for NanjarBudiman.com, covering accuracy, AI use, corrections, and independence.',
    updated: '9 June 2026',
    sections: [
      {
        heading: 'Purpose',
        paragraphs: [
          'Articles on this site are written to be useful: practical notes from making music, video, and automation with AI. They are not written to chase volume or search traffic.',
        ],
      },
      {
        heading: 'Accuracy and testing',
        paragraphs: [
          'Technical instructions are based on hands-on work wherever possible. Commands, versions, and interfaces can change; readers should verify details against current documentation before relying on them.',
        ],
      },
      {
        heading: 'AI assistance',
        paragraphs: [
          'AI tools may be used for research support, drafting, or editing. The author remains responsible for the final argument, recommendations, and any errors that remain.',
        ],
      },
      {
        heading: 'Corrections',
        paragraphs: [
          'If you find an error, please reach out through the contact page. Substantive corrections will be made in the article rather than silently removed.',
        ],
      },
      {
        heading: 'Independence and sponsorship',
        paragraphs: [
          'There is no paid placement or sponsored ranking on this site. If a future article is sponsored or produced in partnership, that relationship will be disclosed clearly.',
        ],
      },
    ],
  },
  {
    slug: 'copyright',
    navLabel: 'Copyright',
    title: 'Copyright',
    accent: 'notice.',
    subtitle: 'What is protected, what is permitted, and how to ask for permission.',
    description:
      'Copyright notice for NanjarBudiman.com, covering original work, limited quotation, and permissions.',
    updated: '9 June 2026',
    sections: [
      {
        heading: 'Copyright',
        paragraphs: [
          '© 2026 NanjarBudiman.com. All rights reserved unless otherwise stated.',
          'Original writing, music, video, artwork, and site design are protected by copyright. Limited quotation with clear attribution and a link back is permitted.',
        ],
      },
      {
        heading: 'Permitted use',
        bullets: [
          'Short quotations for commentary, review, or education, with attribution.',
          'Sharing links to articles, videos, or releases.',
          'Embedding public videos through the official platform players.',
        ],
      },
      {
        heading: 'Not permitted',
        bullets: [
          'Republishing full articles, tracks, or videos without written permission.',
          'Commercial use of original assets without a licence.',
          'Removing credits, watermarks, or attribution.',
        ],
      },
      {
        heading: 'Permissions',
        paragraphs: [
          'For licensing, commissions, or republishing requests, please reach out through the contact page with the specific work and intended use.',
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}
