export type Language = 'en' | 'ar';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  metricsPreview: string;
}

export interface PortfolioItem {
  id: string;
  brandName: string;
  industry: string;
  services: string[];
  summary: string;
  image: string;
  isConcept: boolean;
  conceptBadgeText: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  keyOutcome: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  timeline: string;
}

export interface PillarItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface ValuePropItem {
  title: string;
  description: string;
  highlight: string;
}

export interface AgencyCommitmentItem {
  title: string;
  quote: string;
  authorTitle: string;
  verifiedLabel: string;
}

export interface VideoStripFormat {
  id: string;
  name: string;
  tagline: string;
  description: string;
  vimeoId: string;
  badge: string;
}

export interface VideoStripSection {
  badge: string;
  headline: string;
  subheadline: string;
  formats: VideoStripFormat[];
}

export interface SiteContent {
  nav: {
    home: string;
    about: string;
    services: string;
    work: string;
    whyUs: string;
    process: string;
    contact: string;
    ctaButton: string;
    languageToggle: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    supportingText: string;
    primaryCta: string;
    secondaryCta: string;
    activeCampaignsLabel: string;
    viewsTicker: string;
    reelLabel: string;
    viralHookBadge: string;
  };
  intro: {
    badge: string;
    headline: string;
    subheadline: string;
    body1: string;
    body2: string;
    coreValues: { title: string; desc: string }[];
  };
  servicesSection: {
    badge: string;
    headline: string;
    subheadline: string;
    items: ServiceItem[];
  };
  videoStripSection: VideoStripSection;
  portfolioSection: {
    badge: string;
    headline: string;
    subheadline: string;
    conceptNote: string;
    viewCaseStudy: string;
    items: PortfolioItem[];
  };
  whySection: {
    badge: string;
    headline: string;
    subheadline: string;
    pillars: PillarItem[];
  };
  processSection: {
    badge: string;
    headline: string;
    subheadline: string;
    steps: ProcessStep[];
  };
  valueSection: {
    badge: string;
    headline: string;
    subheadline: string;
    items: ValuePropItem[];
  };
  testimonialsSection: {
    badge: string;
    headline: string;
    subheadline: string;
    note: string;
    items: AgencyCommitmentItem[];
  };
  contactSection: {
    badge: string;
    headline: string;
    subheadline: string;
    form: {
      fullName: string;
      fullNamePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      company: string;
      companyPlaceholder: string;
      service: string;
      budget: string;
      budgetPlaceholder: string;
      details: string;
      detailsPlaceholder: string;
      submitBtn: string;
      submittingBtn: string;
      successTitle: string;
      successMsg: string;
      directChat: string;
      referenceIdLabel: string;
      sendAnother: string;
    };
    budgetOptions: { value: string; label: string }[];
    serviceOptions: { id: string; label: string }[];
    agencyHubs: { city: string; region: string; status: string }[];
  };
  footer: {
    description: string;
    quickLinks: string;
    servicesTitle: string;
    connectTitle: string;
    locationsTitle: string;
    copyright: string;
    disclaimer: string;
  };
}

export const contentMap: Record<Language, SiteContent> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      work: "Our Work",
      whyUs: "Why Slice",
      process: "Process",
      contact: "Contact",
      ctaButton: "Let's Talk",
      languageToggle: "العربية",
    },
    hero: {
      badge: "Creative Social & Performance Agency",
      headlinePart1: "WE MAKE BRANDS",
      headlineHighlight: "IMPOSSIBLE",
      headlinePart2: "TO IGNORE.",
      supportingText: "Creative strategies, scroll-stopping content, and performance-driven campaigns that help brands stand out and grow across Egypt and the Gulf.",
      primaryCta: "Let's Build Something",
      secondaryCta: "Explore Our Work",
      activeCampaignsLabel: "Active Creator Network",
      viewsTicker: "100% Focused on Brand Retention & Conversions",
      reelLabel: "Slice Production Studio // MENA",
      viralHookBadge: "High-Retention Creative",
    },
    intro: {
      badge: "Brand Introduction",
      headline: "YOUR BRAND DESERVES MORE THAN JUST ATTENTION.",
      subheadline: "Attention is fleeting. Relevance, emotional pull, and commercial conversion build market leaders.",
      body1: "At Slice Marketing Agency, we discard generic agency playbooks. In a crowded digital landscape where feeds refresh by the millisecond, your brand needs content engineered to stop thumbs and creative strategies anchored in commercial reality.",
      body2: "We bridge the gap between disruptive creative storytelling and rigorous performance media buying. From viral short-form video to full-funnel paid acquisition and bespoke brand identity, we partner with ambitious enterprises across Egypt and the GCC to command category authority.",
      coreValues: [
        { title: "No Fluff, Pure Impact", desc: "Every campaign asset is purpose-built to either cement brand prestige or drive measurable revenue." },
        { title: "Bicultural MENA Fluency", desc: "Deep cultural resonance across Egyptian wit, Gulf luxury nuances, and regional consumer psychology." },
        { title: "Speed & Creative Rigor", desc: "Rapid concept-to-execution timelines backed by daily performance analysis and continuous creative iteration." }
      ]
    },
    servicesSection: {
      badge: "Core Capabilities",
      headline: "ENGINEERED FOR MODERN DIGITAL CONSUMPTION.",
      subheadline: "Integrated capabilities built to drive engagement, cultural relevance, and sustainable pipeline growth.",
      items: [
        {
          id: "social-media-management",
          number: "01",
          title: "Social Media Management",
          tagline: "Omnichannel presence, consistent brand tone, and community leadership.",
          description: "End-to-end management of your social presence across Instagram, TikTok, LinkedIn, and X. We handle creative calendars, community moderation, reactive trend-jacking, and brand authority.",
          deliverables: ["Monthly Content Calendars", "Active Community Engagement", "Tone-of-Voice Alignment", "Monthly Insight Reporting"],
          metricsPreview: "Daily active feed curation"
        },
        {
          id: "content-strategy-creation",
          number: "02",
          title: "Content Strategy & Creation",
          tagline: "Editorial storytelling that commands mindshare.",
          description: "We craft distinctive content architectures built around recurring audience hooks, educational pillars, and entertainment formats designed to retain audience attention through the final second.",
          deliverables: ["Pillar-Based Narrative Strategy", "High-Volume Reel Frameworks", "Carousel & Static Design", "Copywriting & Scripts"],
          metricsPreview: "Tailored to audience dwell time"
        },
        {
          id: "paid-advertising-performance",
          number: "03",
          title: "Paid Advertising & Performance",
          tagline: "Profitable customer acquisition with creative testing at scale.",
          description: "Full-funnel media buying across Meta Ads, TikTok Ads, Google, and Snapchat. We pair analytical targeting with relentless ad creative iteration to lower CAC and maximize blended ROAS.",
          deliverables: ["Full-Funnel Campaign Architecture", "Creative Fatigue Defense", "A/B Hook & Angle Testing", "Real-Time Tracking & Pixel Audits"],
          metricsPreview: "Data-backed conversion funnels"
        },
        {
          id: "branding-visual-identity",
          number: "04",
          title: "Branding & Visual Identity",
          tagline: "Unforgettable brand aesthetics tailored for screen-first eras.",
          description: "Complete visual identity design that stands out on 6-inch screens and billboard formats alike. Logo systems, typography guidelines, packaging, and digital brand toolkits that exude confidence.",
          deliverables: ["Visual Identity Systems", "Digital Brand Guidelines", "Packaging & Social Assets", "Motion Design Principles"],
          metricsPreview: "Distinctive brand recognition"
        },
        {
          id: "ugc-short-form-video",
          number: "05",
          title: "UGC & Short-Form Video Production",
          tagline: "Authentic, relatable creator content that converts skeptics into buyers.",
          description: "We recruit, brief, and direct native creators to deliver high-converting user-generated content. Raw, honest, and persuasive video formats engineered specifically for TikTok and Instagram Reels.",
          deliverables: ["Vetted Creator Network", "Custom Directing & Scripts", "Hook Variation Delivery", "Platform Native Post-Production"],
          metricsPreview: "Optimized for 3s hook retention"
        },
        {
          id: "influencer-marketing",
          number: "06",
          title: "Influencer Marketing",
          tagline: "Strategic collaborations with creators who actually influence purchase decisions.",
          description: "End-to-end creator partnerships from discovery and contract negotiation to brief alignment and campaign tracking. We eliminate wasted spend on unengaged follower counts.",
          deliverables: ["Audience Overlap & Fraud Audits", "Creative Alignment Briefs", "End-to-End Contract Handling", "Attribution & Sales Tracking"],
          metricsPreview: "Verified creator alignment"
        },
        {
          id: "creative-campaigns",
          number: "07",
          title: "Creative Campaigns",
          tagline: "Cultural moments, product launches, and seasonal activations.",
          description: "High-octane campaigns designed around product releases, Ramadan moments, Black Friday, and seasonal peaks that spark organic conversation and dominate public feeds.",
          deliverables: ["Big Idea Conceptualization", "Cross-Channel Rollout Plans", "Hero Film & Teaser Stills", "PR & Social Amplification"],
          metricsPreview: "Turnkey seasonal activations"
        },
        {
          id: "digital-marketing-consulting",
          number: "08",
          title: "Digital Marketing Consulting",
          tagline: "High-level strategic advisory for executive leadership and internal teams.",
          description: "Fractional CMO and growth consulting to audit your current marketing stack, upskill your in-house creatives, and design scalable customer journey funnels that deliver predictable growth.",
          deliverables: ["Full Funnel & Channel Audits", "In-House Team Workshops", "MarTech Stack Recommendations", "Executive Quarterly Roadmaps"],
          metricsPreview: "Strategic growth guidance"
        }
      ]
    },
    videoStripSection: {
      badge: "Viral Reel Formats",
      headline: "CONTENT IS NOT THE SAME FOR EVERYONE.",
      subheadline: "We test enough formats to know what spreads and what gets scrolled past, but most importantly what works for your brand.",
      formats: [
        {
          id: "storytelling",
          name: "Storytelling",
          tagline: "High-Dwell Narrative",
          description: "The format that built the foundation of viral engagement. Stories and human narratives people watch until the very end.",
          vimeoId: "1195094508",
          badge: "Watch Time Leader"
        },
        {
          id: "skits",
          name: "Skits & Situational",
          tagline: "Humor & Friction Hooks",
          description: "Acting out a real customer friction point so it actually lands. Relatable, funny, and shareable, with the brand message organically built right in.",
          vimeoId: "1196280245",
          badge: "Maximum Shares"
        },
        {
          id: "voxpop",
          name: "Street & Voxpop",
          tagline: "Raw Social Proof",
          description: "Street interviews and unscripted reactions, but faster and more raw. The kind of unfiltered content people watch start to finish.",
          vimeoId: "1195094599",
          badge: "High Authenticity"
        },
        {
          id: "ugc-hooks",
          name: "UGC & Founder Hooks",
          tagline: "Direct Commercial Pull",
          description: "Fast-paced creator demonstrations and sensory visuals engineered to convert skeptics and drive immediate cart checkouts.",
          vimeoId: "1195094508",
          badge: "Conversion Engine"
        }
      ]
    },
    portfolioSection: {
      badge: "Curated Work",
      headline: "CAMPAIGNS DESIGNED TO COMMAND THE FEED.",
      subheadline: "Selected creative blueprints and concept case studies illustrating our design standard, content rhythm, and strategic architecture.",
      conceptNote: "Note: The following projects are presented as curated agency concept blueprints to demonstrate creative execution and strategic capability. Real client case studies can be plugged in directly.",
      viewCaseStudy: "View Case Blueprint",
      items: [
        {
          id: "streetwear-atelier",
          brandName: "AURA // ATELIER",
          industry: "High-End Streetwear & Apparel",
          services: ["Creative Direction", "TikTok Content Strategy", "Performance Meta Ads"],
          summary: "An avant-garde apparel release targeting youth culture in Cairo and Riyadh, combining moody editorial aesthetic with viral unboxing shorts.",
          image: "/assets/project-streetwear.jpg",
          isConcept: true,
          conceptBadgeText: "CONCEPT CASE BLUEPRINT",
          challenge: "Differentiating a premium urban fashion label in a crowded regional market dominated by fast fashion brands without eroding luxury appeal.",
          solution: "Built a 3-act launch campaign: Act I mystery teasers, Act II high-concept lookbook reels, and Act III creator try-on reels with direct checkout links.",
          deliverables: ["14 Short-Form Reel Concepts", "Editorial Photography Assets", "Targeted Paid Traffic Funnel", "Interactive Lookbook Design"],
          keyOutcome: "Engineered to deliver high average order value (AOV) and organic saves on Instagram."
        },
        {
          id: "blackwood-coffee",
          brandName: "BLACKWOOD COFFEE CO.",
          industry: "Specialty Roastery & F&B",
          services: ["Brand Packaging", "UGC Video Production", "Community Growth"],
          summary: "Rebranding and short-form video series for an artisanal coffee roaster, driving customer foot-traffic and e-commerce cold brew subscription sales.",
          image: "/assets/project-coffee.jpg",
          isConcept: true,
          conceptBadgeText: "CONCEPT CASE BLUEPRINT",
          challenge: "Communicating the nuanced craft of single-origin coffee to everyday consumers without sounding overly technical or intimidating.",
          solution: "Humanized the brand through barista vox-pop videos, home-brewing micro-tutorials, and ASMR packaging reels emphasizing sensory richness.",
          deliverables: ["Bottle & Bag Packaging Overhaul", "Weekly Recipe Short-Form Series", "Creator Tasting Gift Boxes", "Local Geo-Targeted Meta Ads"],
          keyOutcome: "Positioned the brand as the premier daily coffee ritual for creative professionals."
        },
        {
          id: "creator-studio-reel",
          brandName: "SLICE ORIGINAL CREATOR LAB",
          industry: "Digital Media & Creator Culture",
          services: ["UGC Production", "Viral Content Engineering", "Creative Direction"],
          summary: "Our in-house production framework demonstrating the psychology of high-dwell short-form video for regional digital-first brands.",
          image: "/assets/hero-reel.jpg",
          isConcept: true,
          conceptBadgeText: "AGENCY SHOWCASE BLUEPRINT",
          challenge: "Capturing and maintaining attention within the first 1.5 seconds of user feed discovery across Instagram and TikTok algorithms.",
          solution: "Pioneered high-contrast visual cues, kinetic caption styles, and relatable narrative pacing tailored specifically for Arab audiences.",
          deliverables: ["Proprietary Hook Library", "Dynamic Audio Synchronization", "Algorithmic Retention Testing", "Creator Briefing System"],
          keyOutcome: "Demonstrates baseline creative execution standard for all client partner productions."
        }
      ]
    },
    whySection: {
      badge: "Why Slice?",
      headline: "THE SLICE METHODOLOGY.",
      subheadline: "Four non-negotiable principles that separate memorable brand growth from wasted marketing budgets.",
      pillars: [
        {
          number: "01",
          title: "Strategy Before Execution",
          subtitle: "We never shoot a single reel without a commercial objective.",
          description: "Too many agencies rush into posting pretty pictures with no connection to the balance sheet. Every campaign Slice produces starts with consumer positioning, competitive white-space mapping, and business goals."
        },
        {
          number: "02",
          title: "Creative That Stands Out",
          subtitle: "In a world of templated feeds, originality is your only defense.",
          description: "We refuse to churn out bland, cookie-cutter agency fodder. We design daring visuals, sharp editorial hooks, and culturally rich stories that cut through the endless digital noise and make people stop."
        },
        {
          number: "03",
          title: "Data-Informed Decisions",
          subtitle: "Intuition sparks the idea. Quantitative feedback scales it.",
          description: "We scrutinize view-through rates, hook retention curves, cost-per-acquisition, and audience sentiment daily. Our creative team listens to the data, and our media buyers adapt in real time."
        },
        {
          number: "04",
          title: "Continuous Optimization",
          subtitle: "Marketing is never 'finished' after launch day.",
          description: "Consumer behavior shifts and algorithms update constantly. We relentlessly test new creative variants, iterate on winner hooks, cut underperformers, and compound your digital momentum month over month."
        }
      ]
    },
    processSection: {
      badge: "Our Process",
      headline: "HOW WE BRING BRANDS TO LIFE.",
      subheadline: "A deliberate, battle-tested four-stage journey from blank page to market leadership.",
      steps: [
        {
          step: "01",
          title: "Discover",
          timeline: "Week 01",
          description: "We immerse ourselves in your business model, customer psychology, past marketing assets, and competitors. We unearth the authentic angle that will make your brand distinctive."
        },
        {
          step: "02",
          title: "Strategize",
          timeline: "Week 02",
          description: "We build your comprehensive roadmap: content pillars, creative moodboards, channel allocation, campaign hooks, and conversion funnel milestones."
        },
        {
          step: "03",
          title: "Create & Launch",
          timeline: "Week 03 — 04",
          description: "Production begins. Scripting, filming, graphic design, editing, and paid ad campaign configuration. We deploy the creative with surgical targeting."
        },
        {
          step: "04",
          title: "Analyze & Optimize",
          timeline: "Ongoing Sprint",
          description: "We evaluate real performance data, double down on high-converting creative angles, refine audience segments, and scale what works."
        }
      ]
    },
    valueSection: {
      badge: "Real Business Value",
      headline: "MEASURABLE COMMERCIAL ADVANTAGE.",
      subheadline: "We measure success by commercial reality, brand positioning, and sustainable customer equity.",
      items: [
        {
          title: "Stronger Brand Positioning",
          description: "Elevate your business from a commoditized vendor into a recognizable, authoritative category icon.",
          highlight: "Category Authority"
        },
        {
          title: "Consistent Quality at Scale",
          description: "Eliminate irregular posting and ad-hoc aesthetics with a streamlined, high-tempo editorial production machine.",
          highlight: "Zero Content Droughts"
        },
        {
          title: "Meaningful Audience Engagement",
          description: "Build an active community of loyal advocates who interact with your content, recommend your products, and defend your brand.",
          highlight: "True Community"
        },
        {
          title: "Objective-Driven Campaigns",
          description: "Every dollar spent on paid channels is aligned directly with measurable business objectives, not vanity likes.",
          highlight: "Commercial Alignment"
        },
        {
          title: "Data-Informed Evolution",
          description: "Make confident growth decisions supported by transparent performance dashboards and direct creative attribution.",
          highlight: "Transparent Insights"
        }
      ]
    },
    testimonialsSection: {
      badge: "Client Collaboration Standard",
      headline: "OUR PARTNERSHIP COMMITMENT.",
      subheadline: "We work as an embedded creative and performance arm for ambitious businesses.",
      note: "We value genuine, long-term partnerships over vanity agency showcases. Here is our operating standard:",
      items: [
        {
          title: "Dedicated Creative Direction",
          quote: "You will never be handed off to junior interns. Senior creative directors and media buyers remain directly involved on your account every week.",
          authorTitle: "Creative Leadership Guarantee",
          verifiedLabel: "Slice Operating Standard"
        },
        {
          title: "Radical Transparency",
          quote: "Real numbers, honest reporting, and zero smoke and mirrors. When an ad creative underperforms, we explain why and fix it within 24 hours.",
          authorTitle: "Accountability Principle",
          verifiedLabel: "Core Agency Policy"
        },
        {
          title: "Regional Market Precision",
          quote: "Marketing in Cairo requires different cultural reflexes than marketing in Dubai or Riyadh. We tailor language, humor, and visual cues accordingly.",
          authorTitle: "Cultural Localization",
          verifiedLabel: "MENA Native Fluency"
        }
      ]
    },
    contactSection: {
      badge: "Start A Project",
      headline: "READY TO MAKE YOUR BRAND STAND OUT?",
      subheadline: "Tell us where your brand is today and where you want to take it. We will review your inquiry and schedule an initial strategic consultation.",
      form: {
        fullName: "Your Name",
        fullNamePlaceholder: "e.g. Karim El-Sayed",
        email: "Business Email",
        emailPlaceholder: "karim@company.com",
        company: "Company or Brand Name",
        companyPlaceholder: "e.g. Nile Artisan Co.",
        service: "Primary Service of Interest",
        budget: "Estimated Monthly Budget (USD)",
        budgetPlaceholder: "Select your investment range",
        details: "Tell Us About Your Project & Goals",
        detailsPlaceholder: "Describe your current challenges, desired timeline, target audience, and what success looks like for your brand...",
        submitBtn: "Submit Strategic Inquiry",
        submittingBtn: "Transmitting Inquiry...",
        successTitle: "Inquiry Received Successfully",
        successMsg: "Thank you for reaching out to Slice. Your project details have been logged in our intake queue. Our senior strategy team will review your brief within 24 business hours.",
        directChat: "Need a quicker response? Chat directly with our regional partnership lead via WhatsApp:",
        referenceIdLabel: "Inquiry Reference ID",
        sendAnother: "Submit Another Inquiry"
      },
      budgetOptions: [
        { value: "under-3k", label: "$1,500 – $3,000 / month (Early Stage)" },
        { value: "3k-7k", label: "$3,000 – $7,000 / month (Growth Tier)" },
        { value: "7k-15k", label: "$7,000 – $15,000 / month (Scale Tier)" },
        { value: "above-15k", label: "$15,000+ / month (Enterprise & Multi-Market)" },
        { value: "one-off-project", label: "One-Off Campaign or Brand Overhaul" }
      ],
      serviceOptions: [
        { id: "social-media", label: "Social Media Management" },
        { id: "content-creation", label: "Content Strategy & Creation" },
        { id: "paid-ads", label: "Paid Ads & Performance" },
        { id: "branding", label: "Branding & Visual Identity" },
        { id: "ugc-video", label: "UGC & Short-Form Video" },
        { id: "influencer", label: "Influencer Marketing" },
        { id: "campaigns", label: "Creative Campaigns" },
        { id: "consulting", label: "Digital Consulting" }
      ],
      agencyHubs: [
        { city: "Cairo", region: "Egypt & North Africa", status: "Active Production Hub" },
        { city: "Dubai", region: "United Arab Emirates", status: "GCC Client Relations" },
        { city: "Riyadh", region: "Kingdom of Saudi Arabia", status: "Expansion Desk" }
      ]
    },
    footer: {
      description: "SLICE is a high-impact digital growth and creative social marketing agency. We engineer campaigns that command attention and drive revenue across Egypt and the Gulf.",
      quickLinks: "Quick Navigation",
      servicesTitle: "Services",
      connectTitle: "Direct Channels",
      locationsTitle: "Agency Hubs",
      copyright: `© ${new Date().getFullYear()} SLICE MARKETING AGENCY. All rights reserved.`,
      disclaimer: "All portfolio materials shown are curated concept demonstrations and agency prototypes created for Slice Marketing Agency."
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      work: "أعمالنا",
      whyUs: "لماذا سلايس",
      process: "منهجية العمل",
      contact: "تواصل معنا",
      ctaButton: "ابدأ مشروعك",
      languageToggle: "English",
    },
    hero: {
      badge: "وكالة متخصصة في المحتوى الإبداعي والنمو الرقمي",
      headlinePart1: "نجعل علامتك التجارية",
      headlineHighlight: "مستحيلة",
      headlinePart2: "التجاهل.",
      supportingText: "استراتيجيات إبداعية، ومحتوى يخطف الانتباه، وحملات تسويقية قائمة على الأداء لمساعدة الشركات الطموحة على التميز والنمو في مصر والخليج العربي.",
      primaryCta: "لنصنع شيئاً فارقاً",
      secondaryCta: "استكشف أعمالنا",
      activeCampaignsLabel: "شبكة صناع محتوى معتمدة",
      viewsTicker: "تركيز ١٠٠٪ على ولاء الجمهور والمبيعات",
      reelLabel: "استوديو إنتاج سلايس // الشرق الأوسط",
      viralHookBadge: "محتوى يحبس الأنفاس",
    },
    intro: {
      badge: "مقدمة عن الوكالة",
      headline: "علامتك التجارية تستحق أكثر من مجرد مشاهدات عابرة.",
      subheadline: "الانتباه المؤقت لا يبني شركات مستدامة؛ ما يبنيها هو التأثير العاطفي والتحويل الفعلي للمبيعات.",
      body1: "في وكالة سلايس (SLICE)، نرفض القوالب المكررة والحلول الجاهزة. في عالم رقمي متسارع تُمرر فيه المنشورات في أجزاء من الثانية، تحتاج علامتك إلى محتوى مدروس نفسياً ليوقف الإبهام ويترك أثراً ذهنياً عميقاً.",
      body2: "نحن نجمع بين السرد القصصي الإبداعي المبتكر وإدارة الحملات الإعلانية الممولة المبنية على الأرقام الدقيقة. من مقاطع الفيديو القصيرة الفيروسية إلى الهوية البصرية المتكاملة، نساعد الشركات في مصر والخليج على تصدر مجالاتها بثقة.",
      coreValues: [
        { title: "أثر حقيقي بلا مبالغات", desc: "كل قطعة محتوى ننتجها مصممة لتعزيز مكانة علامتك أو دفع مبيعات ملموسة." },
        { title: "فهم ثقافي عميق للمنطقة", desc: "ندرك تماماً الفروق الدقيقة بين خفة الظل المصرية وثقافة الفخامة في الخليج العربي." },
        { title: "سرعة وإتقان لا يقبلان التهاون", desc: "تنفيذ احترافي في مواعيد دقيقة مع تحليل يومي مستمر لتحسين النتائج." }
      ]
    },
    servicesSection: {
      badge: "خدماتنا المتكاملة",
      headline: "مصممة خصيصاً لأنماط الاستهلاك الرقمي الحديث.",
      subheadline: "حلول شاملة لبناء حضور قوي، والتأثير الثقافي، والنمو التجاري المستدام.",
      items: [
        {
          id: "social-media-management",
          number: "01",
          title: "إدارة وسائل التواصل الاجتماعي",
          tagline: "حضور متسق، ونبرة صوت مميزة، وبناء مجتمع مخلص لعلامتك.",
          description: "إدارة شاملة لحساباتك عبر إنستغرام وتيك توك ولينكد إن وإكس. نضع خطط النشر الاستراتيجية، وندير التفاعل مع المتابعين، ونبني سلطة علامتك في السوق.",
          deliverables: ["خطة محتوى شهرية شاملة", "إدارة التفاعل اليومي", "توحيد نبرة صوت العلامة", "تقارير أداء تحليلية دورية"],
          metricsPreview: "إدارة يومية دقيقة"
        },
        {
          id: "content-strategy-creation",
          number: "02",
          title: "استراتيجية وصناعة المحتوى",
          tagline: "قصص إبداعية تأسر انتباه الجمهور حتى الثانية الأخيرة.",
          description: "نبني هيكلية محتوى متفردة تعتمد على زوايا جذب مبتكرة، وقيم تعليمية وترفيهية مصممة خصيصاً لرفع معدلات المشاهدة والاحتفاظ بالجمهور.",
          deliverables: ["استراتيجية ركائز المحتوى", "أفكار مقاطع ريلز وتيك توك سريعة الانتشار", "تصاميم كلاسيكية وتفاعلية", "كتابة نصوص وسيناريوهات مؤثرة"],
          metricsPreview: "مصممة لأطول وقت مشاهدة"
        },
        {
          id: "paid-advertising-performance",
          number: "03",
          title: "الإعلانات الممولة والتسويق بالأداء",
          tagline: "جلب عملاء جدد بكفاءة وربحية عالية.",
          description: "إدارة متطورة للحملات الإعلانية عبر ميتا، تيك توك، جوجل، وسناب شات. ندمج الاستهداف الدقيق مع الاختبار المستمر للإعلانات لخفض تكلفة الاكتساب وزيادة العائد على الإنفاق.",
          deliverables: ["بناء مسارات التحويل المتكاملة", "تجديد دوري للإعلانات لمنع الإرهاق", "اختبار زوايا الجذب (A/B Testing)", "إعداد بكسل التتبع والتحليلات"],
          metricsPreview: "مسارات تحويل مبنية على البيانات"
        },
        {
          id: "branding-visual-identity",
          number: "04",
          title: "الهوية البصرية والعلامة التجارية",
          tagline: "هوية بصرية استثنائية تواكب العصر الرقمي.",
          description: "تصميم أنظمة بصرية متكاملة تبدو آسرة على شاشات الهواتف كما في المطبوعات واللوحات الإعلانية. شعارات، خطوط، وتغليف يعكس مكانة علامتك الراقية.",
          deliverables: ["نظام هوية بصرية متكامل", "دليل استخدام العلامة التجارية", "تصاميم التغليف وحسابات السوشيال", "قواعد الحركة والأنيميشن"],
          metricsPreview: "حضور بصري لا ينسى"
        },
        {
          id: "ugc-short-form-video",
          number: "05",
          title: "فيديو UGC والمقاطع القصيرة",
          tagline: "محتوى واقعي وموثوق يحول المشاهدين إلى مشترين حقيقيين.",
          description: "نختار ونوجه نخبة من صناع المحتوى لإنتاج تجارب حقيقية ومقاطع ريلز مقنعة تم تصميمها لتحقيق أعلى معدلات ثقة وانتشار ومبيعات.",
          deliverables: ["شبكة صناع محتوى مفحوصة", "كتابة سيناريوهات طبيعية مقنعة", "زوايا افتتاحية متعددة لكل إعلان", "مونتاج رقمي سريع واحترافي"],
          metricsPreview: "مصمم لأول ٣ ثوانٍ حاسمة"
        },
        {
          id: "influencer-marketing",
          number: "06",
          title: "التسويق عبر المؤثرين",
          tagline: "شراكات استراتيجية مع شخصيات تمتلك تأثيراً شرائياً فعلياً.",
          description: "إدارة متكاملة من الاختيار الدقيق وتدقيق المتابعين المزيفين إلى صياغة العقود وتتبع المبيعات لضمان عدم إهدار ميزانيتك على أرقام وهمية.",
          deliverables: ["تدقيق وفحص جودة الجمهور", "صياغة الموجهات الإبداعية للتعاون", "إدارة العقود والتفاوض المالي", "تتبع العائد والمبيعات"],
          metricsPreview: "تأثير موثوق وملموس"
        },
        {
          id: "creative-campaigns",
          number: "07",
          title: "الحملات الإبداعية والموسمية",
          tagline: "صناعة لحظات لافتة وتدشين منتجات تسيطر على المحادثات.",
          description: "حملات كبرى معدّة لمواسم رمضان، الجمعة البيضاء، وإطلاق المنتجات الحصرية تثير تفاعلاً واسعاً وتجعل علامتك حديث وسائل التواصل.",
          deliverables: ["ابتكار الفكرة المحورية الكبرى", "خطة إطلاق متعددة القنوات", "إنتاج الفيديو الرئيسي والمواد المرافقة", "تنسيق الظهور والانتشار"],
          metricsPreview: "حملات استثنائية متكاملة"
        },
        {
          id: "digital-marketing-consulting",
          number: "08",
          title: "استشارات التسويق الرقمي",
          tagline: "توجيه استراتيجي عالي المستوى للإدارات التنفيذية.",
          description: "جلسات استشارية لمراجعة أدواتك التسويقية الحالية، وتدريب فريقك الداخلي، وبناء مسارات نمو قابلة للتوسع تحقق أهدافك التوسعية بوضوح.",
          deliverables: ["تدقيق شامل للقنوات الإعلانية", "ورش عمل متقدمة لفرق العمل", "توصيات لأفضل البرمجيات التسويقية", "خريطة طريق ربع سنوية"],
          metricsPreview: "استشارات تسويقية نموّية"
        }
      ]
    },
    videoStripSection: {
      badge: "قوالب المحتوى الفيروسي",
      headline: "صناعة المحتوى ليست قالباً واحداً للجميع.",
      subheadline: "اختبرنا مئات الزوايا لنعرف ما ينتشر بقوة وما يتم تجاوزه بالتمرير، والأهم ما يصنع نتائج حقيقية لعلامتك.",
      formats: [
        {
          id: "storytelling",
          name: "السرد القصصي (Storytelling)",
          tagline: "أعلى معدل احتفاظ بالمشاهدة",
          description: "الأسلوب الأقوى لبناء ولاء عميق. قصص واقعية ومؤثرة تجبر المتابع على البقاء حتى آخر ثانية.",
          vimeoId: "1195094508",
          badge: "أعلى وقت مشاهدة"
        },
        {
          id: "skits",
          name: "المواقف التمثيلية (Skits)",
          tagline: "فكاهة ذكية وخطافات موقفية",
          description: "تجسيد مواقف يومية حقيقية يمر بها عميلك بأسلوب ممتع وسريع الانتشار، مع دمج رسالة علامتك دون ابتذال.",
          vimeoId: "1196280245",
          badge: "الأكثر مشاركة"
        },
        {
          id: "voxpop",
          name: "المقابلات العفوية (Voxpop)",
          tagline: "مصداقية الشارع المباشرة",
          description: "لقاءات سريعة وتفاعلية في الشارع والمجمعات بروح طبيعية ودون تصنع، تلتقط فضول المتابع فوراً.",
          vimeoId: "1195094599",
          badge: "أعلى ثقة ومصداقية"
        },
        {
          id: "ugc-hooks",
          name: "فيديوهات صناع المحتوى (UGC)",
          tagline: "تحويل مباشر للمبيعات",
          description: "استعراض حقيقي للمنتج وتجارب استخدام سريعة تهدم كل تردد وتدفع لطلب الشراء الفوري.",
          vimeoId: "1195094508",
          badge: "محرك التحويلات"
        }
      ]
    },
    portfolioSection: {
      badge: "نماذج الأعمال",
      headline: "حملات صُممت لتتصدر المشهد.",
      subheadline: "مخططات إبداعية ونماذج لمشاريع مفاهيمية تجسد معاييرنا في الإخراج الفني والإيقاع الاستراتيجي.",
      conceptNote: "ملاحظة: المشاريع المعروضة أدناه هي نماذج مفاهيمية توضيحية صممتها الوكالة لعرض القدرات الإبداعية، ويمكن ربط المشاريع الحية لاحقاً بكل سهولة.",
      viewCaseStudy: "عرض المخطط الإبداعي",
      items: [
        {
          id: "streetwear-atelier",
          brandName: "أورا // أتيليه",
          industry: "أزياء عصرية راقية وملابس شارع فاخرة",
          services: ["التوجيه الإبداعي", "محتوى تيك توك", "إعلانات ميتا الممولة"],
          summary: "إطلاق تشكيلة ملابس فريدة تستهدف جمهور الشباب في القاهرة والرياض، تجمع بين الفخامة ومقاطع الفيديو العفوية لتجربة الملابس.",
          image: "/assets/project-streetwear.jpg",
          isConcept: true,
          conceptBadgeText: "مخطط لمشروع مفاهيمي",
          challenge: "إبراز علامة أزياء فاخرة وسط منافسة شرسة من العلامات التجارية السريعة، مع الحفاظ على هيبتها وجودتها العالية.",
          solution: "بناء حملة ثلاثية المراحل: تشويق غامض، ثم استعراض سينمائي للقطع، ثم مقاطع تفاعلية مع صناع محتوى بروابط شراء مباشرة.",
          deliverables: ["١٤ فكرة ريلز قصيرة مبتكرة", "جلسة تصوير افتتاحية راقية", "مسار إعلاني ممول موجه بدقة", "تصميم كتالوج تفاعلي للمجموعة"],
          keyOutcome: "صُممت لتحقيق أعلى قيمة لطلب الشراء وتفاعل عضوي كثيف على إنستغرام."
        },
        {
          id: "blackwood-coffee",
          brandName: "بلاك وود كوفي",
          industry: "محمصة ومشروبات قهوة مختصة",
          services: ["تصميم التغليف", "فيديوهات صناع المحتوى", "بناء المجتمع"],
          summary: "إعادة بناء الهوية وإنتاج مقاطع فيديو قصيرة لمحمصة قهوة راقية، لزيادة زيارات الفروع ومبيعات الاشتراكات الشهرية عبر المتجر الإلكتروني.",
          image: "/assets/project-coffee.jpg",
          isConcept: true,
          conceptBadgeText: "مخطط لمشروع مفاهيمي",
          challenge: "إيصال ثقافة القهوة المختصة المعقدة للعملاء العاديين بأسلوب ممتع وجذاب بعيداً عن المصطلحات الصعبة.",
          solution: "تقريب العلامة من الناس عبر لقاءات سريعة مع الباريستا، ودروس تحضير منزلية خفيفة، ومقاطع صوتية ASMR تبرز جودة البن.",
          deliverables: ["تطوير علب وتغليف أكياس القهوة", "سلسلة وصفات أسبوعية سريعة", "صناديق تذوق خاصة بصناع المحتوى", "إعلانات جغرافية موجهة لمحبي القهوة"],
          keyOutcome: "ترسيخ العلامة كخيار أول لعشاق القهوة المختصة والمحترفين."
        },
        {
          id: "creator-studio-reel",
          brandName: "مختبر سلايس الإبداعي",
          industry: "الإعلام الرقمي وثقافة صناع المحتوى",
          services: ["إنتاج UGC", "هندسة المحتوى الفيروسي", "الإخراج الفني"],
          summary: "منظومة الإنتاج الداخلية لدينا التي توضح علم النفس الكامن وراء صناعة مقاطع الفيديو القصيرة التي تحبس انتباه المتابع العربي.",
          image: "/assets/hero-reel.jpg",
          isConcept: true,
          conceptBadgeText: "نموذج استوديو الوكالة",
          challenge: "التقاط انتباه المستخدم في أول ثانية ونصف ومنعه من التمرير في خوارزميات إنستغرام وتيك توك.",
          solution: "ابتكار خطافات بصرية عالية التباين، وخطوط متحركة حيوية، وإيقاع سردي سريع يواكب عادات المشاهد العربي.",
          deliverables: ["مكتبة خطافات بصرية حصرية", "مزامنة صوتية حركية دقيقة", "اختبارات لمعدل الاحتفاظ بالجمهور", "نظام توجيه صناع المحتوى"],
          keyOutcome: "المعيار الأساسي للجودة المعتمد في جميع إنتاجاتنا لعملائنا."
        }
      ]
    },
    whySection: {
      badge: "لماذا سلايس؟",
      headline: "منهجية سلايس في العمل.",
      subheadline: "أربعة مبادئ أساسية لا نساوم عليها تصنع الفارق بين النمو الحقيقي والهدر المالي.",
      pillars: [
        {
          number: "01",
          title: "الاستراتيجية قبل التنفيذ",
          subtitle: "لا ننتج فيديو واحد دون هدف تجاري واضح.",
          description: "الكثير من الوكالات تسارع إلى نشر صور جذابة لا صلة لها بالمبيعات. في سلايس، تبدأ كل خطوة بدراسة الجمهور وتحديد الفرص غير المستغلة في السوق."
        },
        {
          number: "02",
          title: "إبداع يكسر المألوف",
          subtitle: "في بحر من المنشورات المتشابهة، التميز هو وسيلتك الوحيدة للبقاء.",
          description: "نرفض تكرار التصاميم الباهتة. نصنع محتوى يمتلك شخصية جريئة، وقصصاً حقيقية تلامس مشاعر الناس وتجبرهم على التوقف والتفاعل."
        },
        {
          number: "03",
          title: "قرارات مدعومة بالأرقام",
          subtitle: "الحدس يولد الفكرة، ولكن البيانات هي ما تجعلها تنجح وتتوسع.",
          description: "نراقب معدلات المشاهدة، وتكلفة جلب العميل، وتفاعل الجمهور بشكل يومي. فريقنا الإبداعي يستمع للبيانات، ومديرو الإعلانات يطورون الخطط فوراً."
        },
        {
          number: "04",
          title: "تطوير مستمر لا يتوقف",
          subtitle: "التسويق لا ينتهي بمجرد إطلاق الحملة.",
          description: "سلوك المستهلكين وخوارزميات المنصات تتغير باستمرار. نحن نختبر زوايا إعلانية جديدة أسبوعياً، ونوقف ما لا يعمل، ونضاعف ميزانيات ما يحقق أرباحاً حقيقية."
        }
      ]
    },
    processSection: {
      badge: "خطوات العمل",
      headline: "كيف نأخذ علامتك إلى القمة.",
      subheadline: "رحلة مدروسة من ٤ مراحل واضحة تنقلك من الفكرة إلى تصدر السوق.",
      steps: [
        {
          step: "01",
          title: "الاكتشاف والتحليل",
          timeline: "الأسبوع الأول",
          description: "نتعمق في دراسة نموذج عملك، ونفسية عملائك، وحملاتك السابقة، ونقاط ضعف المنافسين لاكتشاف الزاوية المميزة التي ستجعلك مختلفاً."
        },
        {
          step: "02",
          title: "بناء الاستراتيجية",
          timeline: "الأسبوع الثاني",
          description: "نصيغ خطة العمل الكاملة: ركائز المحتوى، لوحات الإلهام البصري، توزيع الميزانيات، وزوايا الجذب لكل منصة تسويقية."
        },
        {
          step: "03",
          title: "الإنتاج والإطلاق",
          timeline: "الأسبوع الثالث — الرابع",
          description: "نبدأ الإنتاج الفعلي: كتابة السيناريوهات، التصوير، المونتاج، وإطلاق الحملات الإعلانية الممولة مع توجيه دقيق للجمهور المستهدف."
        },
        {
          step: "04",
          title: "التحليل والتطوير",
          timeline: "تطوير دوري مستمر",
          description: "نحلل بيانات التفاعل والمبيعات الفعلية، ونوسع نطاق الإعلانات الأكثر نجاحاً، ونحسن مسارات التحويل لضمان أقصى عائد مستدام."
        }
      ]
    },
    valueSection: {
      badge: "القيمة المضافة",
      headline: "فارق تجاري ملموس لأعمالك.",
      subheadline: "نقيس نجاحنا بالنتائج الواقعية ومكانة علامتك في السوق، لا بالأرقام الشكلية.",
      items: [
        {
          title: "مكانة سوقية مرموقة",
          description: "الارتقاء بعلامتك التجارية لتصبح اسماً رائداً يحظى بالثقة والاحترام في قطاعك.",
          highlight: "ريادة القطاع"
        },
        {
          title: "جودة مستمرة واستقرار في النشر",
          description: "التخلص من العشوائية والانقطاع عبر ماكينة إنتاج إبداعية تضمن ظهوراً احترافياً متواصلاً.",
          highlight: "حضور دائم"
        },
        {
          title: "تفاعل حقيقي ومجتمع مخلص",
          description: "بناء قاعدة متابعين أوفياء يتفاعلون مع منشوراتك، ويرشحون منتجاتك، ويدافعون عن علامتك.",
          highlight: "جمهور وفيّ"
        },
        {
          title: "حملات موجهة لتحقيق المبيعات",
          description: "توجيه كل ميزانية إعلانية نحو أهداف تجارية واضحة وقابلة للقياس وليس مجرد إعجابات عابرة.",
          highlight: "عائد استثماري"
        },
        {
          title: "قرارات مبنية على رؤى شفافة",
          description: "اتخاذ خطوات توسعية واثقة مدعومة بتقارير دورية واضحة ومباشرة دون تعقيد أو تضليل.",
          highlight: "شفافية مطلقة"
        }
      ]
    },
    testimonialsSection: {
      badge: "معايير التعاون",
      headline: "التزامنا تجاه شركاء النجاح.",
      subheadline: "نعمل كفريق إبداعي وتسويقي مدمج ومكرس لنجاح الشركات الطموحة.",
      note: "نفضل العلاقات المهنية طويلة الأمد على الحملات السريعة. إليك المعايير التي نلتزم بها معك:",
      items: [
        {
          title: "إشراف إبداعي مباشر من الخبراء",
          quote: "لن يُترك حسابك لمتدربين غير متمرسين؛ المديرون الإبداعيون وخبراء الإعلانات يتابعون حسابك واستراتيجيتك أسبوعياً وبشكل مباشر.",
          authorTitle: "ضمان الإشراف القيادي",
          verifiedLabel: "معيار سلايس الثابت"
        },
        {
          title: "شفافية ومصداقية كاملة",
          quote: "أرقام حقيقية وتقارير صادقة بلا تجميل. إذا لم يؤدِ إعلان ما بالصورة المطلوبة، نوضح السبب ونطور البديل خلال ٢٤ ساعة.",
          authorTitle: "مبدأ المسؤولية",
          verifiedLabel: "سياسة الوكالة الصارمة"
        },
        {
          title: "دقة الفهم المحلي والإقليمي",
          quote: "التسويق في القاهرة يتطلب نبرة تختلف عن دبي أو الرياض؛ نراعي اللهجات والحس الفكاهي والعادات الاستهلاكية لكل سوق بدقة.",
          authorTitle: "التوطين الثقافي",
          verifiedLabel: "خبرة عربية أصيلة"
        }
      ]
    },
    contactSection: {
      badge: "ابدأ مشروعك",
      headline: "جاهز لتجعل علامتك التجارية في الصدارة؟",
      subheadline: "أخبرنا أين تقف علامتك اليوم وأين تطمح للوصول. سنراجع تفاصيل مشروعك ونحدد موعداً لجلسة استشارية أولى.",
      form: {
        fullName: "الاسم الكامل",
        fullNamePlaceholder: "مثال: كريم السيد",
        email: "البريد الإلكتروني للعمل",
        emailPlaceholder: "karim@company.com",
        company: "اسم الشركة أو العلامة التجارية",
        companyPlaceholder: "مثال: شركة النيل الحرفية",
        service: "الخدمة الرئيسية المطلوبة",
        budget: "الميزانية الشهرية المقدرة (بالدولار)",
        budgetPlaceholder: "اختر نطاق الاستثمار التقريبي",
        details: "أخبرنا عن مشروعك وأهدافك",
        detailsPlaceholder: "صف التحديات الحالية، والجدول الزمني المأمول، والجمهور المستهدف، وما يعنيه النجاح بالنسبة لعلامتك...",
        submitBtn: "إرسال تفاصيل المشروع",
        submittingBtn: "جاري إرسال الطلب...",
        successTitle: "تم استلام طلبك بنجاح",
        successMsg: "شكراً لاهتمامك بالتعاون مع سلايس. تم تسجيل تفاصيل مشروعك في قائمة المراجعة، وسيتواصل معك فريق الاستراتيجية خلال ٢٤ ساعة عمل.",
        directChat: "هل تفضل استجابة أسرع؟ تحدث مباشرة مع مسؤول علاقات الشركاء عبر واتساب:",
        referenceIdLabel: "رقم مرجع الطلب",
        sendAnother: "إرسال طلب مشروع آخر"
      },
      budgetOptions: [
        { value: "under-3k", label: "$١,٥٠٠ – $٣,٠٠٠ / شهرياً (المرحلة التأسيسية)" },
        { value: "3k-7k", label: "$٣,٠٠٠ – $٧,٠٠٠ / شهرياً (مرحلة النمو والتوسع)" },
        { value: "7k-15k", label: "$٧,٠٠٠ – $١٥,٠٠٠ / شهرياً (مرحلة التوسع السريع)" },
        { value: "above-15k", label: "$١٥,٠٠٠+ / شهرياً (شركات كبرى وأسواق متعددة)" },
        { value: "one-off-project", label: "مشروع حملة خاصة أو إعادة إطلاق هوية" }
      ],
      serviceOptions: [
        { id: "social-media", label: "إدارة وسائل التواصل" },
        { id: "content-creation", label: "استراتيجية وصناعة المحتوى" },
        { id: "paid-ads", label: "الإعلانات الممولة والأداء" },
        { id: "branding", label: "الهوية البصرية" },
        { id: "ugc-video", label: "فيديوهات UGC القصيرة" },
        { id: "influencer", label: "التسويق عبر المؤثرين" },
        { id: "campaigns", label: "الحملات الإبداعية" },
        { id: "consulting", label: "الاستشارات التسويقية" }
      ],
      agencyHubs: [
        { city: "القاهرة", region: "مصر وشمال أفريقيا", status: "مركز الإنتاج الرئيسي" },
        { city: "دبي", region: "الإمارات العربية المتحدة", status: "مكتب علاقات الخليج" },
        { city: "الرياض", region: "المملكة العربية السعودية", status: "مكتب التوسع الإقليمي" }
      ]
    },
    footer: {
      description: "سلايس (SLICE) هي وكالة متخصصة في المحتوى الإبداعي وصناعة النمو الرقمي. نصمم حملات تفرض حضورها بقوة وتدفع العائدات في مصر ومنطقة الخليج.",
      quickLinks: "روابط سريعة",
      servicesTitle: "خدماتنا",
      connectTitle: "قنوات التواصل",
      locationsTitle: "مكاتبنا",
      copyright: `© ${new Date().getFullYear()} وكالة سلايس للتسويق (SLICE). جميع الحقوق محفوظة.`,
      disclaimer: "جميع المشاريع المعروضة بالموقع هي نماذج ومخططات إبداعية صممتها الوكالة لعرض قدراتها المهنية."
    }
  }
};
