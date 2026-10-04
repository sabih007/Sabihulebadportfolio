export type FaqItem = {
  id: string;
  question: string;
  answer: string[];
};

export const faq: FaqItem[] = [
  {
    id: "project-types",
    question: "What types of projects do you work on?",
    answer: [
      "Websites, custom web applications, eCommerce experiences, redesigns and development projects.",
    ],
  },
  {
    id: "design-and-development",
    question: "Do you handle both design and development?",
    answer: [
      "Yes. Projects can include UI/UX, frontend development, backend functionality or complete end-to-end implementation depending on requirements.",
    ],
  },
  {
    id: "redesign",
    question: "Can you redesign an existing website?",
    answer: [
      "Yes. Existing websites can be modernised while preserving important content, functionality, integrations and business workflows.",
    ],
  },
  {
    id: "international",
    question: "Do you work with international clients?",
    answer: [
      "Yes. Client work has been delivered remotely for businesses in different countries and time zones.",
    ],
  },
  {
    id: "timeline",
    question: "How long does a website take?",
    answer: [
      "It depends on scope. The number of templates, the amount of custom functionality, whether content and assets are ready, and how many rounds of feedback are planned all change the schedule significantly.",
      "Rather than quoting a universal turnaround, I scope the work first and give you a timeline for your project, with the dependencies that could move it stated up front.",
    ],
  },
  {
    id: "support",
    question: "Do you provide ongoing support?",
    answer: [
      "Support and ongoing improvements can be discussed based on the project — from occasional help when something needs changing, through to continued development after launch.",
    ],
  },
];
