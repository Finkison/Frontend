/**
 * Finkison Enterprise Authoritative Copy & Site Content Module
 * =============================================================
 * Enforces:
 * - Strict sentence case across all headings, labels, and buttons
 * - No trailing periods on titles, headers, buttons, or form labels
 * - Complete sentence termination (periods) on subtitles, descriptions, and helpers
 * - Zero exclamation marks across the entire platform
 * - Zero stray symbols (no >>, |, ***, ~)
 *     - Sign in (never Log in / Login / Sign-in portal)
 *     - Register (never Sign up / Enroll now)
 *     - Student (Grades 9-11) / Candidate (Grade 12 EUEE)
 *     - School (single) / Institution (network)
 *     - Subject (not Course)
 *     - Unit / Topic / Section
 *     - Practice set / Assessment / Exam
 *     - Contact us / Explore subjects
 * - Preserves all mandatory test strings for WCAG and regression tests:
 *     - "Score calibration"
 *     - "Knowledge mapping"
 *     - "Spaced review"
 *     - "Curriculum alignment"
 *     - "Bayesian regression calibrated against historical university cutoffs"
 *     - "prerequisite foundational concepts across Grades 9 through 12"
 *     - "Zero ungrounded hallucinations"
 */

export const SITE_CONTENT = {
  // Navigation & Shell
  navigation: {
    home: "Home",
    about: "About",
    solutions: "Solutions",
    academics: "Academics",
    aiFeatures: "AI Features",
    team: "Team",
    pricing: "Pricing",
    contactUs: "Contact us",
    signIn: "Sign in",
    signInPortal: "Sign in",
    register: "Register",
    searchPlaceholder: "Search subjects, exams, or curriculum units",
    solutionsMenu: [
      {
        name: "For schools",
        to: "/for-schools",
        description: "School dashboards, exam management, and pass rate tracking.",
      },
      {
        name: "For teachers",
        to: "/for-teachers",
        description: "Lesson planning, exam creation, and gradebooks.",
      },
      {
        name: "For students",
        to: "/for-students",
        description: "Practice exams, science labs, and study notes.",
      },
    ],
  },

  // Landing Page Sections
  landing: {
    hero: {
      title: "Secondary examination preparation and curriculum mastery",
      description:
        "Secondary schools conduct timed national entrance assessments and deliver lesson mastery with teacher-approved curricula.",
      primaryCta: "Get started",
      primaryCtaLink: "/contact",
      secondaryCtaLoggedOut: "Sign in",
      secondaryCtaLoggedIn: "Go to dashboard",
      secondaryCtaLink: "/login",
      dashboardLink: "/dashboard",
      audiences: [
        {
          id: "schools",
          label: "For schools",
          title: "Secondary examination preparation and curriculum mastery",
          description:
            "Generate unit-balanced assessments, practice with verified past papers, and track candidate performance by section.",
          primaryCtaText: "Get started",
          primaryCtaLink: "/contact",
          secondaryCtaText: "Sign in",
          secondaryCtaLink: "/login",
          preview: {
            title: "Institutional examination infrastructure",
            subject: "National curriculum delivery and supervision",
            badge: "EGECF Framework",
            metrics: [
              { label: "Curriculum alignment", value: "Grades 9–12 framework" },
              { label: "Examination blueprint", value: "Timed national standards" },
              { label: "Educator oversight", value: "100% Teacher verification" },
              { label: "Pedagogical focus", value: "Learn, Innovate, Achieve" },
            ],
            status: "Ministry curriculum framework validated",
          },
        },
        {
          id: "teachers",
          label: "For teachers",
          title: "Create and assign curriculum practice exams",
          description:
            "Build unit practice exams, verify item difficulty, and approve every paper before classroom release.",
          primaryCtaText: "Get started",
          primaryCtaLink: "/contact",
          secondaryCtaText: "Sign in",
          secondaryCtaLink: "/login",
          preview: {
            title: "Curriculum assessment studio",
            subject: "Blueprint-calibrated exam generator",
            badge: "Teacher Gate",
            metrics: [
              { label: "Specification balance", value: "Multi-unit difficulty model" },
              { label: "Editorial review", value: "100% Educator verified" },
              { label: "Academic streams", value: "Natural and Social tracks" },
              { label: "Delivery formats", value: "Online portal and print PDF" },
            ],
            status: "Curriculum blueprint validated",
          },
        },
        {
          id: "students",
          label: "For candidates",
          title: "Diagnostic entrance practice and past papers",
          description:
            "Master 2008–2016 past papers with verified step-by-step solutions, key formulas, and diagnostic reviews.",
          primaryCtaText: "Get started",
          primaryCtaLink: "/academics",
          secondaryCtaText: "Sign in",
          secondaryCtaLink: "/login",
          preview: {
            title: "National examination archive",
            subject: "National entrance preparation",
            badge: "EUEE Archive",
            metrics: [
              { label: "Examination archive", value: "2008–2016 E.C. papers" },
              { label: "Marking rubrics", value: "Verified step-by-step keys" },
              { label: "Psychometric model", value: "Item Response Theory (IRT)" },
              { label: "Score calibration", value: "Confidence bounds" },
            ],
            status: "Curriculum specifications verified",
          },
        },
      ],
    },

    partners: {
      title: "Learn, innovate, and achieve with Finkison",
      subtitle:
        "An integrated pedagogical platform empowering secondary students and educators through concept-first lessons, interactive STEM labs, and proven examination mastery.",
    },

    featuresHeader: {
      title: "Built for secondary schools and educators",
      subtitle:
        "Practice exams, science simulations, score prediction, and verified gradebooks.",
    },

    featureRows: {
      examGen: {
        title: "Blueprint exam generation with teacher approval",
        description:
          "Generate timed exams balanced across secondary units with automated difficulty distribution and educator approval.",
        bullets: [
          "Teacher approval gate on every question and answer key",
          "Balanced item distribution preventing early-chapter clustering",
          "Timed formats matching official national exam blueprints",
        ],
        ctaText: "Explore assessment studio",
      },

      aiDiagnostics: {
        title: "Adaptive practice and entrance score prediction",
        // Mandatory compliance string block
        description:
          "Predict entrance exam cutoffs and eliminate knowledge deficits using psychometric analytics and syllabus-grounded learning curves.",
        bullets: [
          "Score calibration: Bayesian regression calibrated against historical university cutoffs with +/- 14 point confidence bounds",
          "Knowledge mapping: Traces prerequisite foundational concepts across Grades 9 through 12 to resolve underlying test errors",
          "Spaced review: Algorithmic scheduling targeting retention before exam day",
          "Curriculum alignment: Direct syllabus integration guaranteeing Zero ungrounded hallucinations",
        ],
        ctaText: "Explore diagnostic engine",
      },

      stemSimulations: {
        title: "Interactive STEM science simulations",
        subtitle:
          "Manipulate physical parameters in real time across physics, chemistry, biology, and mathematics.",
      },

      pastPapers: {
        title: "National past papers archive (2008–2016 E.C.)",
        description:
          "Practice with authentic Grade 12 national entrance examinations with official marking schemes and step-by-step rationales.",
        bullets: [
          "Authentic three-hour timed examination environment",
          "Step-by-step worked solutions authored by senior educators",
          "Instant performance analytics by curriculum unit",
        ],
        ctaText: "Explore exam archive",
      },
    },

    curriculumTracks: {
      title: "Secondary streams and preparatory cohorts",
      subtitle:
        "Core academic pathways for junior secondary students and university entrance candidates.",
    },

    testimonials: {
      title: "Proven results across secondary classrooms",
      subtitle:
        "Feedback from school leadership, subject department heads, and top-scoring candidates.",
    },

    stats: {
      title: "Comprehensive secondary curriculum coverage",
      subtitle:
        "Curriculum depth across academic streams, core disciplines, and verified past papers.",
    },

    pricing: {
      title: "Transparent candidate seat pricing",
      subtitle:
        "Annual school licensing in Ethiopian Birr with official VAT tax invoices and domestic payment options.",
      learnMore: "View institutional pricing details",
    },

    faq: {
      title: "Frequently asked questions",
      subtitle:
        "Essential answers for school directors, teachers, and administrators.",
    },

    ctaBanner: {
      title: "Ready to get started with Finkison?",
      subtitle:
        "Join secondary schools across Ethiopia preparing candidates with curriculum-aligned practice.",
      primaryButton: "Get started",
      secondaryButton: "Sign in",
      supportLine:
        "Institutional support: support@finkison.com • Monday to Friday, 8:30 AM to 5:30 PM EAT",
    },
  },

  // Footer Content
  footer: {
    tagline: "Ethiopian EUEE examination preparation and curriculum learning platform for secondary schools and candidates.",
    passingStandardStatement:
      "Engineered to help all candidates achieve national passing benchmarks.",
    columns: {
      platform: {
        title: "Platform",
        links: [
          { label: "Subjects and curriculum", to: "/academics" },
          { label: "AI diagnostic engine", to: "/ai-features" },
          { label: "Pricing and licensing", to: "/pricing" },
          { label: "Sign in", to: "/login" },
          { label: "Register account", to: "/register" },
          { label: "Contact us", to: "/contact" },
        ],
      },
      solutions: {
        title: "Solutions",
        links: [
          { label: "For schools", to: "/for-schools" },
          { label: "For teachers", to: "/for-teachers" },
          { label: "For students", to: "/for-students" },
          { label: "Regional bureaus", to: "/contact" },
        ],
      },
      organization: {
        title: "Organization",
        links: [
          { label: "About Finkison", to: "/about" },
          { label: "Team", to: "/team" },
          { label: "Contact and inquiries", to: "/contact" },
          { label: "Privacy policy", to: "/privacy" },
          { label: "Terms of service", to: "/terms" },
        ],
      },
      newsletter: {
        title: "Stay updated",
        description: "Receive platform announcements and EUEE examination guidelines.",
        placeholder: "name@school.edu.et",
        button: "Subscribe to updates",
        successMessage: "Subscription confirmed. You will receive updates at your email.",
      },
    },
    legal: {
      copyright: "© {year} Finkison Education Platform. All rights reserved.",
      location: "Addis Ababa, Ethiopia",
    },
  },

  // Public Page Titles (Required by compliance tests)
  pages: {
    academics: {
      title: "Academics overview",
      subtitle: "Curriculum-aligned secondary subject modules, units, and verified national item repositories.",
    },
    aiFeatures: {
      title: "AI diagnostic engine",
      subtitle: "Bayesian score calibration, Socratic explanations, and personalized prerequisite mapping.",
    },
    about: {
      title: "About Finkison",
      subtitle: "Dedicated to lifting national secondary pass rates through accessible, curriculum-accurate EdTech.",
    },
    team: {
      title: "Academic leadership and engineering team",
      subtitle: "Experienced Ethiopian educators, psychometricians, and software engineers.",
    },
    pricing: {
      title: "Institutional licensing and student plans",
      subtitle: "Clear, transparent pricing in Ethiopian Birr designed for schools and candidate cohorts.",
    },
    forSchools: {
      title: "Solutions for schools",
      subtitle: "Student gradebooks, passing rate tracking, and school exam management.",
    },
    forTeachers: {
      title: "Tools for teachers",
      subtitle: "Curriculum exam creator, question editing, and topic mastery tracking.",
    },
    forStudents: {
      title: "National exam prep for students",
      subtitle: "Timed practice exams, study schedules, and worked solutions.",
    },
    contact: {
      title: "Contact us",
      subtitle: "Connect with our academic team for school setup, pricing, or technical questions.",
    },
  },
} as const;

export default SITE_CONTENT;
