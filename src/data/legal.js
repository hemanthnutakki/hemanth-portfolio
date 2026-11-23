import { profile } from './profile'

// All policy text lives here. It describes how THIS website actually works (verified against the code):
// no cookies, no local/session storage, no analytics, no network calls of its own; third parties: Google Fonts on page load,
// EmailJS only when the contact form is submitted, and the hosting provider. If you change the architecture, update these pages.
const EMAIL = profile.email
const MAIL = `[${EMAIL}](mailto:${EMAIL})`
export const HOST_NAME = 'Netlify' // change if the site is hosted elsewhere
export const LEGAL_UPDATED = '21 November 2026'
const U = LEGAL_UPDATED

export const LEGAL_PAGES = {
  '/privacy': {
    title: 'Privacy Policy', updated: U,
    intro: 'This policy explains what personal information this portfolio website handles, why, and what choices you have. It is written in plain language and is intended to be read alongside the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025 (India), whose main obligations are being phased in. It is a personal website, not a business, and it does not claim any privacy or security certification.',
    sections: [
      { id: 'who', title: 'Who is responsible', body: [`This website is a personal portfolio operated by N. Hemanth (\u201CI\u201D, \u201Cme\u201D). I decide why and how the information described below is used. Contact: ${MAIL}.`] },
      { id: 'summary', title: 'In short', body: [{ ul: [
        'I only collect what you choose to send through the contact form.',
        'There are no accounts, no analytics, no advertising or tracking cookies, and no newsletter or mailing list.',
        'I do not sell or rent your information.',
        'A few third-party services process technical data so the site can load and the form can deliver your message. They are listed below.'] }] },
      { id: 'collect', title: 'Information I collect', body: [
        { ul: [
          '**Contact form:** your name, email address, subject and message, plus the fact that you ticked the consent box. Only what you type.',
          '**If you email me directly:** whatever you choose to send.',
          '**Hosting data:** like any website, the hosting provider\u2019s servers process technical request data (such as IP address, browser and device type, pages requested, date and time). See \u201CThird-party services\u201D. I do not run analytics and I do not use this data to identify individual visitors.'] },
        'I do not collect accounts or passwords, precise location, payment details or any other category of data. Please do not put sensitive information (for example financial details, health information or government ID numbers) in your message.'] },
      { id: 'browser', title: 'What happens only in your browser', body: ['Interactive features (the Kanna mascot, the 3D scenes, scroll effects and the prompt laboratory) run on your own device. They use your cursor position, scroll position, screen size and your system \u201Creduce motion\u201D setting only to animate the page. This is not recorded, stored or sent anywhere. The \u201CCopy prompt\u201D button writes to your clipboard only when you click it.'] },
      { id: 'use', title: 'How I use your information', body: [
        { ul: ['To read and reply to your message.', 'To discuss opportunities, collaboration or questions about my work.', 'To keep a record of correspondence.', 'To filter spam and abuse.', 'To meet legal obligations, if any apply.'] },
        'I do not use your information for marketing lists, profiling, automated decision-making or advertising.'] },
      { id: 'consent', title: 'Consent and withdrawing it', body: [
        'The contact form asks you to tick a box before sending. By doing so you agree that I may use the details you submit for the purposes in this policy.',
        `You can withdraw consent at any time, as easily as you gave it, by emailing ${MAIL}. Withdrawal does not affect use before it. After you withdraw I will stop using your details and delete them unless the law requires me to keep them.`] },
      { id: 'services', title: 'Third-party services', body: [
        { table: { label: 'Third-party services', head: ['Service', 'Why it is involved', 'Data involved'], rows: [
          ['EmailJS', 'Delivers contact-form messages to my email. Used only when you submit the form.', 'Name, email, subject and message. EmailJS also keeps its own technical records under its privacy policy.'],
          [`${HOST_NAME} (hosting)`, 'Serves the website files over HTTPS.', 'Standard request data such as IP address, browser and device type and pages requested.'],
          ['Google Fonts', 'Loads the Inter, Space Grotesk and JetBrains Mono fonts when a page loads.', 'Your browser contacts Google\u2019s servers, so your IP address and browser details are visible to Google.'],
          ['My email provider', 'Receives and stores messages sent to me.', 'The messages and addresses you send to me.']] } },
        '**Firebase and databases:** this website does not use Firebase or any database. Some of my other projects (for example FluxReviews and CraveKart) use Firebase and other services, but they are separate products with their own practices.',
        'This website does not use analytics tools, advertising networks, social-media plugins or tag managers. Each provider above has its own privacy policy, which applies to the data it handles.'] },
      { id: 'cookies', title: 'Cookies and analytics', body: ['This website does not set cookies, does not use local or session storage and does not run analytics. Details are in the [Cookie Policy](/cookies).'] },
      { id: 'sharing', title: 'Sharing and transfers', body: [
        'I do not sell or rent your personal information. Your details are handled only by the providers above, as needed to deliver, store and answer your message. I may disclose information if the law requires it or to protect rights and safety.',
        'Some providers operate servers outside India, so your information may be processed outside India. I cannot control exactly where.'] },
      { id: 'security', title: 'Storage, security and retention', body: [
        'Messages are stored in my email account and may also appear in the sending history that EmailJS keeps under its own settings and policies. The website is served over HTTPS by the hosting provider. I use reasonable measures, such as a protected email account, but no method of transmission or storage is completely secure.',
        'I keep correspondence only as long as it is needed to respond and for reasonable record-keeping. There is no automatic deletion: I delete messages when they are no longer needed or when you ask me to. If a personal-data breach affecting you occurs, I will inform you and the relevant authority as the law requires.'] },
      { id: 'rights', title: 'Your rights', body: [
        'Under Indian data-protection law you may:',
        { ul: ['ask for a summary of the personal data I hold about you and how it is used;', 'ask me to correct, complete or update it;', 'ask me to erase it;', 'withdraw your consent;', 'nominate another person to exercise these rights for you if you are unable to;', 'make a grievance about how your data is handled.'] },
        `Email ${MAIL} from the address you used on the form so I can match your request. I will respond within a reasonable period and no later than 90 days.`] },
      { id: 'grievance', title: 'Questions and complaints', body: [
        `Contact: ${MAIL}. I have not appointed a separate Data Protection Officer; this contact handles all privacy questions and requests.`,
        'If I have not resolved your concern, you may complain to the Data Protection Board of India in the way the law provides.'] },
      { id: 'children', title: 'Children', body: ['This website is not directed at children under 18 and I do not knowingly collect their information. If you are under 18, please do not use the contact form. If I learn that I received a child\u2019s information, I will delete it.'] },
      { id: 'changes', title: 'Changes to this policy', body: ['I may update this policy. The \u201CLast updated\u201D date above shows the latest version.'] }
    ]
  },

  '/terms': {
    title: 'Terms and Conditions', updated: U,
    intro: 'These terms apply when you use this portfolio website. By using it you agree to them. If you do not agree, please do not use the site.',
    sections: [
      { id: 'use', title: 'Using this website', body: ['This website presents the work, education and background of N. Hemanth. You may browse it for personal, professional or educational purposes, for example to evaluate my profile or to contact me.'] },
      { id: 'acceptable', title: 'Acceptable use', body: ['You agree not to:', { ul: ['attack, probe or try to disrupt the website, its hosting or its services;', 'use automated tools in a way that places an unreasonable load on the site;', 'send spam, harassing, unlawful or misleading messages through the contact form;', 'pretend to be someone else or misrepresent your identity or purpose;', 'copy, republish or sell the site, its design, code or mascot in breach of the [Copyright Notice](/copyright).'] }] },
      { id: 'ip', title: 'Intellectual property', body: ['Original content on this website belongs to N. Hemanth, subject to third-party licenses and project-specific ownership. The [Copyright and Intellectual Property Notice](/copyright) explains what you may and may not do, and [Credits](/credits) lists the open-source components used.'] },
      { id: 'links', title: 'Third-party websites', body: ['This website links to other websites (for example project sites and publications). I do not control them and am not responsible for their content, availability or privacy practices. A link is not an endorsement.'] },
      { id: 'accuracy', title: 'Accuracy of information', body: ['I try to keep the information accurate and current, but it may contain errors or become outdated. Academic results, dates and project descriptions are provided by me in good faith. Please verify anything important with me or with the relevant institution or organisation.'] },
      { id: 'content', title: 'Changes to content and availability', body: ['I may change, update or remove any content, feature or part of the website, or suspend it, at any time without notice. I do not guarantee that the website will always be available or free of errors.'] },
      { id: 'liability', title: 'Limitation of liability', body: ['The website is provided \u201Cas is\u201D. To the fullest extent permitted by law, I am not liable for any loss or damage arising from using the website or relying on its content. Nothing in these terms limits any right or liability that cannot be limited by law.'] },
      { id: 'noffer', title: 'No offer or agreement', body: ['Nothing on this website is an offer of services or employment, or creates a contract between you and me. Any engagement would need a separate written agreement.'] },
      { id: 'privacy', title: 'Your information', body: ['Information you send through the contact form is handled as described in the [Privacy Policy](/privacy).'] },
      { id: 'law', title: 'Governing law', body: ['These terms are governed by the laws of India. Any dispute is subject to the courts of competent jurisdiction in India.'] },
      { id: 'changes', title: 'Changes to these terms', body: ['I may update these terms. The \u201CLast updated\u201D date above shows the latest version. Continued use after a change means you accept it.'] },
      { id: 'contact', title: 'Contact', body: [`Questions about these terms: ${MAIL}.`] }
    ]
  },

  '/cookies': {
    title: 'Cookie Policy', updated: U,
    intro: 'This page lists the cookies, browser storage and tracking technologies this website actually uses. It will be updated if that changes.',
    sections: [
      { id: 'summary', title: 'In short', body: [{ note: 'This website does not set any cookies and does not use local storage, session storage or similar tracking technologies of its own.' }] },
      { id: 'list', title: 'What the website uses', body: [
        { table: { label: 'Technologies used', head: ['Technology', 'Used?', 'Notes'], rows: [
          ['First-party cookies', 'No', 'The website does not set cookies.'],
          ['Local storage, session storage, IndexedDB', 'No', 'Nothing is saved in your browser. Preferences such as \u201Creduce motion\u201D are read from your system and not stored.'],
          ['Analytics', 'No', 'No analytics or visitor-tracking tools are installed.'],
          ['Advertising or social-media trackers', 'No', 'No ad networks, pixels or social plugins.'],
          ['Fingerprinting', 'No', 'The website does not attempt to identify your device.']] } }] },
      { id: 'third', title: 'Third-party requests', body: [
        'Without using cookies, your browser still contacts some third parties:',
        { ul: ['**Google Fonts** (fonts.googleapis.com and fonts.gstatic.com) when a page loads, to fetch fonts. Google can see your IP address and browser details.', '**EmailJS** only when you submit the contact form.', `**Hosting provider** (${HOST_NAME}) whenever pages and files are served, which receives standard request data.`] },
        'These providers have their own policies and may use technical identifiers that I do not control. I have not enabled analytics, A/B testing or similar hosting features.'] },
      { id: 'consent', title: 'Consent banner', body: ['Because the website does not use non-essential cookies or trackers, it shows no cookie banner. If that changes I will update this policy and ask for your consent first where the law requires it.'] },
      { id: 'control', title: 'Your choices', body: ['You can block or delete cookies and stored data in your browser settings. You can also block third-party font requests with a browser extension; the website still works using fallback fonts.'] },
      { id: 'contact', title: 'Questions', body: [`Contact: ${MAIL}. See also the [Privacy Policy](/privacy).`] }
    ]
  },

  '/copyright': {
    title: 'Copyright and Intellectual Property Notice', updated: U, copyright: true,
    intro: 'This notice explains who owns the content of this website and how it may be used.',
    sections: [
      { id: 'ownership', title: 'Ownership', body: ['The original content of this website belongs to N. Hemanth: its text, layout and visual design, the code written for it, the Kanna mascot design and animation, and the preview image and favicon. Parts of the website were created with AI-assisted development tools and reviewed by me. I own this content to the extent the law recognises.'] },
      { id: 'permitted', title: 'What you may do', body: [{ ul: ['view the website and share links to it;', 'quote short excerpts with a clear credit and a link back;', 'print or keep copies of pages for personal, educational or recruitment-evaluation purposes.'] }] },
      { id: 'not', title: 'What needs permission', body: ['Please do not copy, republish, redistribute, sell or build on the website, its design, code, text or the Kanna mascot without my written permission. To ask, write to ' + MAIL + '.'] },
      { id: 'third', title: 'Third-party components', body: ['The website uses open-source software and fonts under their own licenses. This notice does not change those licenses. See [Credits](/credits).'] },
      { id: 'projects', title: 'Project-specific ownership', body: [
        'Projects and work described here (such as FluxReviews, CraveKart, the Incedo internship project, academic projects and my IEEE publication) are summaries of my contribution. Ownership of those projects, their code, brand names and data may belong to me, my co-founders, my employer or my university. Showing them here does not claim or transfer ownership.',
        'My IEEE paper is subject to IEEE\u2019s copyright terms and the authors\u2019 publication agreement. This website only links to it and gives a short summary.'] },
      { id: 'marks', title: 'Trademarks', body: ['Names, logos and trademarks of other companies and products belong to their owners and appear only to identify them.'] },
      { id: 'report', title: 'Reporting a concern', body: [`If you believe something here infringes your rights, email ${MAIL} with the page, what you believe is infringed and how to contact you. I will review it promptly.`] }
    ]
  },

  '/disclaimer': {
    title: 'Disclaimer', updated: U,
    intro: 'Please read this together with the [Terms and Conditions](/terms).',
    sections: [
      { id: 'general', title: 'General information only', body: ['Everything on this website is general information about my education, experience and projects. It is not professional, legal, financial or technical advice, and it should not be relied on as such.'] },
      { id: 'accuracy', title: 'Accuracy', body: ['I take care to keep it correct, but I make no guarantee that it is complete, current or error-free. Academic results, achievements and dates are stated by me. Please verify anything important.'] },
      { id: 'illustrative', title: 'Illustrative and simplified content', body: [{ ul: ['The prompt laboratory shows **illustrative examples** of prompt structure. Its outputs are not real AI model responses.', 'Diagrams, such as the network-congestion workflow, are simplified summaries and leave out confidential detail.', 'Kanna\u2019s speech and explanations are pre-written captions, not live AI responses.', 'The technology lists describe tools I have worked with. They are not ratings, certifications or claims of expertise levels.'] }] },
      { id: 'ai', title: 'AI-assisted development', body: ['This website and parts of its content were created with AI-assisted development tools and reviewed by me. Errors may remain.'] },
      { id: 'confidential', title: 'Confidential information', body: ['Descriptions of professional and team projects are intentionally high level. They do not contain confidential information of any employer or client.'] },
      { id: 'links', title: 'External links', body: ['Links to other websites are provided for convenience. I do not control or endorse them.'] },
      { id: 'availability', title: 'Availability and compatibility', body: ['I do not guarantee uninterrupted access. The 3D features need a browser with WebGL; a simpler version is shown if it is unavailable.'] },
      { id: 'contact', title: 'Contact', body: [`${MAIL}`] }
    ]
  },

  '/accessibility': {
    title: 'Accessibility Statement', updated: U,
    intro: 'I want this website to be usable by as many people as possible, including people who use keyboards, screen readers or reduced-motion settings.',
    sections: [
      { id: 'goal', title: 'Goal', body: ['I aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1, level AA, where practical. This is a goal, not a certification: the website has not been formally audited or certified by a third party.'] },
      { id: 'measures', title: 'What is in place', body: [{ ul: [
        'Navigation and controls can be used with a keyboard, with visible focus outlines and a \u201CSkip to content\u201D link.',
        'Pages use headings, landmarks and labelled controls so screen readers can navigate them.',
        'The 3D visuals are decorative. The same information is available as ordinary text, buttons and lists (for example the technology chips and the workflow stages).',
        'Your system \u201Creduce motion\u201D setting is respected: flying, tilting, typing effects and automatic explanations are switched off or simplified.',
        'Kanna\u2019s explanations can be paused, skipped or stopped at any time.',
        'Layouts adapt to phones, tablets and desktops. Legal pages use plain text with no animation.'] }] },
      { id: 'limits', title: 'Known limitations', body: [{ ul: [
        'No formal accessibility audit has been carried out, so some issues may exist.',
        'Kanna\u2019s speech bubbles are announced by screen readers as they appear and automatic explanations run for around 30 seconds. They can be stopped with the Stop button.',
        'Some pages rely on motion and 3D effects for atmosphere. They do not carry information that is not also available as text.'] }] },
      { id: 'feedback', title: 'Feedback and alternative formats', body: [`If you find a barrier or need information in another format, email ${MAIL}. Please say which page and what device or assistive technology you use. I will do my best to help.`] }
    ]
  },

  '/credits': {
    title: 'Third-Party Credits and Open Source Licenses', updated: U,
    intro: 'This website is built with the open-source software and resources below. Thank you to their authors and maintainers.',
    sections: [
      { id: 'libraries', title: 'Open-source libraries', body: [
        { table: { label: 'Open-source libraries', head: ['Library', 'Used for', 'License'], rows: [
          ['React and React DOM', 'User interface', 'MIT'],
          ['Three.js', '3D graphics', 'MIT'],
          ['React Three Fiber', 'Three.js in React', 'MIT'],
          ['Drei', 'Helpers for React Three Fiber', 'MIT'],
          ['Framer Motion', 'Animation', 'MIT'],
          ['Lenis', 'Smooth scrolling', 'MIT'],
          ['Lucide React', 'Icons', 'ISC'],
          ['EmailJS browser SDK', 'Contact-form delivery', 'MIT'],
          ['Tailwind CSS, PostCSS, Autoprefixer', 'Styling', 'MIT'],
          ['Vite and the Vite React plugin', 'Build tooling', 'MIT']] } },
        'License names reflect each project\u2019s published licensing at the time of writing. The license text shipped with each package is the authoritative version.'] },
      { id: 'fonts', title: 'Fonts', body: ['Inter, Space Grotesk and JetBrains Mono, licensed under the SIL Open Font License 1.1 and delivered through Google Fonts.'] },
      { id: 'icons', title: 'Icons', body: ['Icons are from Lucide (ISC license).'] },
      { id: 'models', title: '3D models and assets', body: ['No third-party 3D models, textures or environment images are used. The Kanna mascot and all 3D scenes are generated in code from basic shapes, and the lighting uses light panels defined in code.'] },
      { id: 'images', title: 'Images and illustrations', body: ['No third-party images or illustrations are used. The project illustrations are drawn in code, and the favicon and link-preview image were created for this website.'] },
      { id: 'apis', title: 'External services and APIs', body: ['The only external API used by this website is EmailJS, for delivering contact-form messages. No maps, social-media, analytics or database services are used. Hosting is provided by ' + HOST_NAME + ' and fonts are served by Google Fonts.'] },
      { id: 'links', title: 'Linked work', body: ['The website links to my project FluxReviews and to my IEEE publication. Those are external resources owned by their respective owners.'] }
    ]
  }
}

export const NOT_FOUND = { title: 'Page not found', updated: null, intro: 'This page does not exist. Use the links below to return to the portfolio or browse the policies.', sections: [] }
