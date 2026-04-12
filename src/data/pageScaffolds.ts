export type ScaffoldLink = {
  label: string;
  url: string;
};

export type ScaffoldChildPage = {
  title: string;
  slug: string;
};

export type ScaffoldSection = {
  title: string;
  content?: string[];
  purpose?: string;
  status?: string;
  blockType?: string;
  existingContent?: string;
  links?: ScaffoldLink[];
};

export type ScaffoldPage = {
  title: string;
  slug: string;
  summary: string;
  purpose?: string;
  status?: string;
  existingContent?: string;
  children?: ScaffoldChildPage[];
  sections: ScaffoldSection[];
};

export const pages: ScaffoldPage[] = [
  {
    title: "Home",
    slug: "",
    summary:
      "Landing page scaffold for the PsychedeliCare initiative with mission, pillars, support actions, project teasers, news, social links, and footer placeholders.",
    sections: [
      {
        title: "Our Mission",
        content: [
          "We create the conditions for people to access and explore psychedelic care safely, ethically, and with dignity.",
          "We work to improve public understanding, reduce stigma, support safe and responsible practices, and align science, society, and policy.",
          "We believe that people should be informed, represented, and actively involved in shaping the future of mental health care.",
        ],
        purpose: "Mission description",
        status: "Ready for copy writing",
        links: [{ label: "Read more about our values", url: "/who-we-are/#our-values" }],
      },
      {
        title: "Our Five Pillars",
        content: [
          "Community: We recognise that healing happens within relationships of mutual support and collective action.",
          "Education: We provide accessible, evidence-based information through events, storytelling, and public engagement.",
          "Policy: We help reframe psychedelics from a matter of criminal justice to one of public health and care.",
          "Science & Research: We believe that care, policy, and public understanding must be grounded in rigorous, transparent, and reproducible science.",
          "Wellbeing: We work to foster a society that normalises support, compassion, and help-seeking.",
        ],
        purpose: "Short description of the five pillars",
        blockType: "Five blocks with an intro text above",
        links: [{ label: "Read more on Who We Are", url: "/who-we-are/#our-five-pillars" }],
      },
      {
        title: "Support Us",
        content: [
          "Would you like to support PsychedeliCare or become part of the movement?",
          "Membership and support options.",
          "Open positions.",
          "Links to financial and transparency reports.",
        ],
        purpose: "Different support actions",
      },
      {
        title: "Subscribe to Our Newsletter",
        content: [
          "Stay informed.",
          "Subscribe to the newsletter to receive the latest information and ways to support the PsychedeliCare Initiative.",
          "Subscription form fields: email address and checkbox for consent.",
          "Primary action: Subscribe.",
          'Success feedback: "Thank you".',
        ],
        purpose: "Subscription form",
        status: "Ready for copy writing",
        blockType: "Newsletter subscription form",
      },
      {
        title: "Projects List Teaser",
        content: [
          "A short summary of the European Citizens' Initiative.",
          "A brief intro to the Peer Support Network.",
          "Link onward to the Projects page for more detail.",
        ],
        purpose: "Briefly introduce our projects",
        status: "Ready for copy writing",
        links: [
          {
            label: "European Citizens' Initiative",
            url: "https://citizens-initiative.europa.eu/initiatives/details/2024/000011_en",
          },
          { label: "Projects", url: "/projects/" },
        ],
      },
      {
        title: "Latest News Teaser",
        content: ["Homepage teaser area for the most recent news, reports, or campaign updates."],
      },
      {
        title: "Follow Us on Social Media",
        content: ["Follow PsychedeliCare across social channels."],
        purpose: "Icons to our social media channels",
        status: "Ready for implementation",
        blockType: "Social media buttons",
        links: [
          { label: "Instagram", url: "https://www.instagram.com/psychedelicare.eu/" },
          { label: "LinkedIn", url: "https://www.linkedin.com/company/psychedelicare" },
          { label: "Facebook", url: "https://www.facebook.com/Psychedelicare.EU" },
          { label: "YouTube", url: "https://www.youtube.com/@PsychedeliCare" },
        ],
      },
      {
        title: "Footer",
        content: [
          "Name and contact information.",
          "Links to Impressum and Privacy Policy.",
          "Reuse existing footer content as a baseline.",
        ],
        purpose: "Page footer with main links and contact info",
        status: "Ready for implementation",
        existingContent: "https://psychedelicare.eu/",
        links: [
          { label: "Legal", url: "/legal/" },
          { label: "Privacy Policy", url: "/privacy-policy/" },
        ],
      },
    ],
  },
  {
    title: "Who We Are",
    slug: "who-we-are",
    summary:
      "Overview page for the movement, the coordination board, national teams, pillars, and values that shape PsychedeliCare.",
    status: "Ready for copy writing",
    sections: [
      {
        title: "Who We Are",
        content: [
          "We are a pan-European movement born from a simple belief: people deserve to be healthy.",
          "We are therapists and researchers, artists and caregivers, lawyers and teachers, families and friends, and we are grassroots by origin and by choice.",
          "We approach psychedelic care as a matter of human rights, collective wellbeing, and social responsibility, guided by our shared intention to place dignity, evidence, and humanity at the center of mental healing.",
          "Our movement grows from lived experience, from people speaking openly about suffering and possibility.",
          "Through national groups and local initiatives, we are building a connected European community, united by a shared vision of safe, equitable, and culturally inclusive access to psychedelic care.",
        ],
        purpose: "Introduce the team and movement",
      },
      {
        title: "Coordination Board",
        content: [
          "The Coordination Board supports the strategic direction and coherence of PsychedeliCare.",
          "It brings together individuals with diverse backgrounds and expertise, working collaboratively to guide decisions, ensure continuity, and support the organisation's development.",
          "Rooted in our values, it reflects a shared and participatory approach to leadership, based on trust, dialogue, and collective responsibility.",
          "Repeat the home page intro and add an overview of board members with photo, name, title, and short bio.",
        ],
      },
      {
        title: "National Teams",
        content: [
          "We currently have more than 15 national teams and more are in process of self-organizing.",
          "Would you like to be part of a team? Contact your national coordinator mentioned below.",
          "Your country is not represented yet? You could start a new national team, contact us.",
          "Each national team consists of several people with various backgrounds.",
          "Together they take care of preparing, structuring, and rolling out the initiative's campaign in their respective countries, with the support of the European team.",
          "List national coordinators with photos, names, short bios, and contact links.",
        ],
        purpose: "Introduce the team",
        status: "Ready for copy writing",
        blockType: "Text blocks with gallery-style photos, short bios, and contact links",
        existingContent: "https://psychedelicare.eu/about-us/#national-teams",
      },
      {
        title: "Our Five Pillars",
        content: [
          "Community: We recognise that healing happens within relationships of mutual support and collective action. We build connections across Europe by creating spaces for participation, dialogue, and peer support, reducing isolation and fostering belonging. We ensure that lived experience is not only heard, but actively shapes the change we seek to create.",
          "Education: We provide accessible, evidence-based information through events, storytelling, and public engagement, helping to normalise informed and responsible approaches to psychedelic experiences. We contribute to a new narrative around psychedelic care, grounded in integrity, responsibility, and openness, while addressing misinformation. We work to shift the conversation from stigma to understanding.",
          "Policy: Psychedelics remain regulated under outdated systems designed decades ago, creating a gap between science, policy, and practice. We work to bridge this gap by aligning law with science, society, and human rights, supporting clear and ethical regulatory pathways. We help reframe psychedelics from a matter of criminal justice to one of public health and care, providing evidence-based guidance to decision-makers and connecting institutions, experts, and communities.",
          "Science & Research: We believe that care, policy, and public understanding must be grounded in rigorous, transparent, and reproducible science. We support interdisciplinary exchange through collaboration with universities, hospitals, and research networks. We contribute to the development of ethical standards and translate scientific knowledge into accessible insights for society and policy.",
          "Wellbeing: We believe that a better world is, at its core, a healthier one across all dimensions of life: physical, psychological, social, and ecological. We create spaces for connection, reflection, and growth, promoting trauma-informed approaches, safe practices, and long-term integration while reducing isolation and strengthening empowerment and belonging. We work to foster a society that normalises support, compassion, and help-seeking, starting within our own community, where wellbeing is a shared value and psychedelic care can be responsibly integrated within a culture of connection, dignity, and collective care.",
        ],
        purpose: "Full description of the five pillars",
        status: "Ready for copy writing",
        blockType: "5 columns, mobile 3/2",
      },
      {
        title: "Our Values",
        content: [
          "Respect for Lived Experience: We honour each person's story and recognise lived experience as a valuable source of knowledge that informs everything we do.",
          "Scientific Integrity: We are committed to transparency, responsibility, and grounding our work in solid and reliable evidence.",
          "Inclusivity and Diversity: We welcome a plurality of voices, perspectives, and traditions, and foster dialogue across cultures, disciplines, and ways of knowing.",
          "Ethical Responsibility and Safety: We hold a strong duty of care, placing ethics and safety at the centre of our work.",
          "Ecological Responsibility: We recognise that our work exists within a living planetary system, and we aim to act with awareness of its long-term impact.",
          "Community and Collaboration: We work in non-hierarchical and collaborative ways, fostering mutual support, shared ownership, and collective growth.",
        ],
        purpose: "Values description",
        status: "Ready for copy writing",
        blockType: "Differently coloured blocks",
      },
    ],
  },
  {
    title: "Blog / News",
    slug: "news",
    summary:
      "Landing page for news-related content, aggregating events, national updates, reports, social publications, and newsletter archives.",
    children: [
      { title: "Events", slug: "news/events" },
      { title: "National News", slug: "news/national-news" },
      { title: "Reports", slug: "news/reports" },
      { title: "Social Media Publications", slug: "news/social-media-publications" },
      { title: "Newsletter Archive", slug: "news/newsletter-archive" },
    ],
    sections: [
      {
        title: "News Hub",
        content: [
          "Aggregate feed and navigation entry point for editorial, campaign, and publishing activity.",
          "Subpages cover events, national news, reports, social media publications, and newsletter archives.",
        ],
      },
    ],
  },
  {
    title: "Events",
    slug: "news/events",
    summary: "Scaffold page for events, gatherings, talks, workshops, and campaign moments.",
    sections: [
      {
        title: "Events Listing",
        content: ["Placeholder for upcoming and past events, with room for filters, locations, dates, and recap content."],
      },
    ],
  },
  {
    title: "National News",
    slug: "news/national-news",
    summary: "Scaffold page for country-specific campaign updates and local stories.",
    sections: [
      {
        title: "National Updates",
        content: ["Placeholder for segmented news by country, local initiative, or campaign team."],
      },
    ],
  },
  {
    title: "Reports",
    slug: "news/reports",
    summary: "Scaffold page for transparency reporting and public documentation.",
    sections: [
      {
        title: "Reports",
        content: ["Financial reports and transparency content."],
        purpose: "Public reporting",
      },
    ],
  },
  {
    title: "Social Media Publications",
    slug: "news/social-media-publications",
    summary: "Scaffold page for curated social posts and campaign publishing snapshots.",
    sections: [
      {
        title: "Social Media Publications",
        content: ["Carousel or archive of social media publications."],
        purpose: "Carousel with campaign social content",
      },
    ],
  },
  {
    title: "Newsletter Archive",
    slug: "news/newsletter-archive",
    summary: "Scaffold page for archived newsletters and email updates.",
    sections: [
      {
        title: "Newsletter Archive",
        content: ["Archive of past newsletter editions."],
      },
    ],
  },
  {
    title: "Projects",
    slug: "projects",
    summary:
      "Landing page for PsychedeliCare projects including the ECI, patient community, partnerships, testimonials, and impact reporting.",
    children: [
      { title: "ECI", slug: "projects/eci" },
      { title: "Patients Community", slug: "projects/patients-community" },
      { title: "Partnerships & Collaborations", slug: "projects/partnerships-collaborations" },
      { title: "Testimonials / Interviews", slug: "projects/testimonials-interviews" },
      { title: "Impact Report", slug: "projects/impact-report" },
    ],
    sections: [
      {
        title: "Projects Overview",
        content: [
          "Overview page that introduces PsychedeliCare's initiatives and links visitors into the specific project areas.",
        ],
      },
    ],
  },
  {
    title: "ECI",
    slug: "projects/eci",
    summary: "Scaffold page for the European Citizens' Initiative project.",
    sections: [
      {
        title: "European Citizens' Initiative",
        content: [
          "Placeholder for ECI narrative, goals, milestones, and participation guidance.",
        ],
        links: [
          {
            label: "Current ECI reference",
            url: "https://citizens-initiative.europa.eu/initiatives/details/2024/000011_en",
          },
        ],
      },
    ],
  },
  {
    title: "Patients Community",
    slug: "projects/patients-community",
    summary: "Scaffold page for the patients community initiative.",
    status: "Draft",
    sections: [
      {
        title: "Patients Community",
        content: ["Placeholder for patient community goals, participation model, and support resources."],
        status: "Draft",
      },
    ],
  },
  {
    title: "Partnerships & Collaborations",
    slug: "projects/partnerships-collaborations",
    summary: "Scaffold page for partner organisations and collaboration opportunities.",
    status: "Ready for copy writing",
    existingContent: "https://psychedelicare.eu/partners/",
    sections: [
      {
        title: "Partnerships & Collaborations",
        content: [
          "PsychedeliCare is collaborating with associations and organisations both within and outside the European Union that share our goals and mission.",
          "Do you want to partner with us and support the PsychedeliCare Initiative during the campaign? Let's get in touch.",
        ],
        purpose: "Introduce our partners",
        status: "Ready for copy writing",
        blockType: "Mosaic of partner logos with name, website link, and short description",
        existingContent: "https://psychedelicare.eu/partners/",
      },
    ],
  },
  {
    title: "Testimonials / Interviews",
    slug: "projects/testimonials-interviews",
    summary: "Scaffold page for stories, testimonials, and interviews.",
    sections: [
      {
        title: "Testimonials / Interviews",
        content: ["Placeholder for long-form interviews, campaign voices, and testimonial highlights."],
      },
    ],
  },
  {
    title: "Impact Report",
    slug: "projects/impact-report",
    summary: "Scaffold page for the impact report in PDF and interactive HTML formats.",
    sections: [
      {
        title: "Impact Report",
        content: ["Placeholder for PDF downloads and an interactive HTML version of the impact report."],
      },
    ],
  },
  {
    title: "Resources",
    slug: "resources",
    summary:
      "Landing page for learning materials, studies, safety information, FAQs, organisations, activist packs, and press resources.",
    children: [
      { title: "Scientific Studies", slug: "resources/scientific-studies" },
      {
        title: "Psychedelic Substances, Safety & Legal Issues",
        slug: "resources/psychedelic-substances-safety-legal-issues",
      },
      { title: "FAQ About Psychedelics", slug: "resources/faq-about-psychedelics" },
      {
        title: "Organisations, Communities & Initiatives",
        slug: "resources/organisations-communities-initiatives",
      },
      { title: "Educational Material", slug: "resources/educational-material" },
      { title: "Activist Packs", slug: "resources/activist-packs" },
      { title: "Media / Press Kit", slug: "resources/media-press-kit" },
    ],
    sections: [
      {
        title: "Resources Overview",
        content: [
          "Entry point for educational material, evidence, FAQs, legal and safety background, and supporting media resources.",
        ],
      },
    ],
  },
  {
    title: "Scientific Studies",
    slug: "resources/scientific-studies",
    summary: "Scaffold page for scientific studies on psychedelics and psychedelic-assisted therapies.",
    status: "Ready for copy writing",
    existingContent: "https://psychedelicare.eu/resources-and-faq/",
    sections: [
      {
        title: "Scientific Studies",
        content: [
          "Scientific studies on psychedelics.",
          "Scientific studies on Psychedelic Assisted Therapies (PAT).",
        ],
        purpose: "Information about major studies on substances and PAT",
        status: "Ready for copy writing",
        blockType: "Text blocks with links to studies",
        existingContent: "https://psychedelicare.eu/resources-and-faq/",
        links: [
          {
            label: "Studies on psychedelics",
            url: "https://psychedelicare.eu/scientific-studies/#studies",
          },
          {
            label: "Studies on psychedelic-assisted therapies",
            url: "https://psychedelicare.eu/scientific-studies/#therapy",
          },
        ],
      },
    ],
  },
  {
    title: "Psychedelic Substances, Safety & Legal Issues",
    slug: "resources/psychedelic-substances-safety-legal-issues",
    summary:
      "Scaffold page covering psychedelic substances, safety, legal context, history, and recommended reading.",
    status: "Ready for implementation",
    existingContent: "https://psychedelicare.eu/resources-and-faq/",
    sections: [
      {
        title: "Overview",
        content: [
          "What are psychedelic substances.",
          "Psychedelic substances and safety.",
          "Legal status of psychedelic substances.",
          "History of psychedelics in Europe.",
          "Recommended books and documentaries.",
        ],
        purpose: "Overview of substances and the related issues",
        status: "Ready for implementation",
        blockType: "Text with coloured blocks and illustrations",
        existingContent: "https://psychedelicare.eu/resources-and-faq/",
        links: [
          {
            label: "What are psychedelic substances",
            url: "https://psychedelicare.eu/scientific-studies/#substances",
          },
          {
            label: "Psychedelic substances and safety",
            url: "https://psychedelicare.eu/scientific-studies/#safety",
          },
          {
            label: "Legal status of psychedelic substances",
            url: "https://psychedelicare.eu/legal-and-history/#legal",
          },
          {
            label: "History of psychedelics in Europe",
            url: "https://psychedelicare.eu/legal-and-history/#history",
          },
          {
            label: "Recommended books & documentaries",
            url: "https://psychedelicare.eu/books-and-documentaries/",
          },
        ],
      },
    ],
  },
  {
    title: "FAQ About Psychedelics",
    slug: "resources/faq-about-psychedelics",
    summary: "Scaffold page for frequently asked questions about psychedelics and PAT.",
    status: "Ready for implementation",
    existingContent: "https://psychedelicare.eu/resources-and-faq/",
    sections: [
      {
        title: "FAQ About Psychedelics",
        content: [
          "Explore the most frequently asked questions about psychedelics and psychedelic-assisted therapies.",
        ],
        purpose: "FAQ",
        status: "Ready for implementation",
        existingContent: "https://psychedelicare.eu/resources-and-faq/",
      },
    ],
  },
  {
    title: "Organisations, Communities & Initiatives",
    slug: "resources/organisations-communities-initiatives",
    summary: "Scaffold page for external organisations, research institutes, and community initiatives.",
    status: "Ready for implementation",
    existingContent: "https://psychedelicare.eu/legal-and-history/#organisations",
    sections: [
      {
        title: "Organisations, Communities & Initiatives",
        content: [
          "Here is a non-exhaustive list of organisations, companies, and communities around the world building knowledge and educating the public about psychedelic substances.",
          "Include sections for universities and institutes researching psychedelics, organisations advocating and educating about substances, and communities and psychonaut initiatives.",
          "Cross-link to partners where relevant.",
        ],
        purpose: "Overview of organisations",
        status: "Ready for implementation",
        blockType: "List of links organised by type",
        existingContent: "https://psychedelicare.eu/legal-and-history/#organisations",
      },
    ],
  },
  {
    title: "Educational Material",
    slug: "resources/educational-material",
    summary: "Scaffold page for responsible use guidance and substance fact sheets.",
    sections: [
      {
        title: "Educational Material",
        content: ["Responsible use guidance and substance fact sheets."],
      },
    ],
  },
  {
    title: "Activist Packs",
    slug: "resources/activist-packs",
    summary: "Scaffold page for campaign materials and activist resources.",
    sections: [
      {
        title: "Activist Packs",
        content: ["Placeholder for downloadable campaign packs and activation resources."],
      },
    ],
  },
  {
    title: "Media / Press Kit",
    slug: "resources/media-press-kit",
    summary: "Scaffold page for media resources, brand assets, and press materials.",
    sections: [
      {
        title: "Media / Press Kit",
        content: ["Placeholder for logos, factsheets, press contacts, and media-ready assets."],
      },
    ],
  },
  {
    title: "Legal",
    slug: "legal",
    summary: "Scaffold page for legal information required by German law.",
    status: "Ready for copy writing",
    existingContent: "https://psychedelicare.eu/legal/",
    sections: [
      {
        title: "Legal",
        content: ["Legal information required by German law (Impressum)."],
        purpose: "Legal information required by German law",
        status: "Ready for copy writing",
        existingContent: "https://psychedelicare.eu/legal/",
      },
    ],
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    summary: "Scaffold page for the privacy policy overview.",
    status: "Ready for implementation",
    existingContent: "https://psychedelicare.eu/privacy-policy/",
    sections: [
      {
        title: "Privacy Policy",
        content: ["Legal privacy policy overview."],
        purpose: "Legal privacy policy overview",
        status: "Ready for implementation",
        existingContent: "https://psychedelicare.eu/privacy-policy/",
      },
    ],
  },
];

export const homePage = pages.find((page) => page.slug === "");

export const topLevelPages = pages.filter(
  (page) => page.slug !== "" && !page.slug.includes("/"),
);

export function getPageBySlug(slug: string) {
  return pages.find((page) => page.slug === slug);
}
