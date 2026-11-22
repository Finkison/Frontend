export const SITE_CONTENT = {
  navigation: {
    home: "Home",
    about: "About",
    solutions: "Solutions",
    academics: "Curriculum",
    aiFeatures: "Learning tools",
    team: "How we work",
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
        description: "Coordinate classes, staff, assessment, and learning progress.",
      },
      {
        name: "For teachers",
        to: "/for-teachers",
        description: "Prepare assessments, assign work, and review class results.",
      },
      {
        name: "For families",
        to: "/for-families",
        description: "Follow a learner's progress and stay in touch with teachers.",
      },
      {
        name: "For students",
        to: "/for-students",
        description: "Learn topics, practise skills, and review key ideas.",
      },
    ],
  },

  landing: {
    hero: {
      eyebrow: "AI-supported learning | Ethiopian secondary education, Grades 9-12",
      title: "Learn with purpose. Reach your potential.",
      description:
        "Curriculum lessons, guided practice, science activities, and progress tools for students, teachers, and schools.",
      primaryCta: "Explore learning tools",
      primaryCtaLink: "/ai-features",
      secondaryCta: "Explore school tools",
      secondaryCtaLink: "/for-schools",
    },
  },

  footer: {
    tagline: "Learning and teaching tools for Ethiopian secondary education, from everyday lessons to exam practice.",
    columns: {
      platform: {
        title: "Explore",
        links: [
          { label: "Curriculum", to: "/academics" },
          { label: "Learning tools", to: "/ai-features" },
          { label: "Plans and pricing", to: "/pricing" },
        ],
      },
      solutions: {
        title: "For",
        links: [
          { label: "Schools", to: "/for-schools" },
          { label: "Teachers", to: "/for-teachers" },
          { label: "Students", to: "/for-students" },
          { label: "Families", to: "/for-families" },
        ],
      },
      organization: {
        title: "About",
        links: [
          { label: "About Finkison", to: "/about" },
          { label: "How we work", to: "/how-we-work" },
          { label: "Contact us", to: "/contact" },
          { label: "Security", to: "/security" },
          { label: "Privacy policy", to: "/privacy" },
          { label: "Terms of service", to: "/terms" },
        ],
      },
    },
    legal: {
      location: "Addis Ababa, Ethiopia",
    },
  },

  pages: {
    academics: {
      title: "Explore the curriculum",
      subtitle: "Find lessons by grade and subject.",
    },
    aiFeatures: {
      title: "Learning and assessment tools",
      subtitle: "Curriculum learning, guided practice, science exploration, and AI-supported study.",
    },
    about: {
      title: "About Finkison",
      subtitle: "An AI-supported learning and school platform built around Ethiopia's secondary curriculum.",
    },
    team: {
      title: "How we work",
      subtitle: "Education, assessment, technology, and school support.",
    },
    pricing: {
      title: "Plans and pricing",
      subtitle: "School plans from ETB 250 per student each month, individual student subscriptions, and Enterprise setup for larger organizations.",
    },
    forSchools: {
      title: "Tools for secondary schools",
      subtitle: "Coordinate classes, staff, assessment, and student progress.",
    },
    forTeachers: {
      title: "Tools for teachers",
      subtitle: "Plan assessments, assign work, and review student and class progress.",
    },
    forStudents: {
      title: "Study tools for students",
      subtitle: "Build subject knowledge, practise intentionally, and track what you have covered.",
    },
    contact: {
      title: "Contact us",
      subtitle: "Questions about access, school setup, or Finkison? Get in touch.",
    },
  },
} as const;

export default SITE_CONTENT;
