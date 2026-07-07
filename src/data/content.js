export const SITE = {
  name: "Tiffany Gu",
  role: "AI Researcher & Builder",
  subtitle:
    "AI researcher, builder, and systems thinker working across machine learning, scientific computing, and human-centered technology.",
  email: "29tiffanyg [at] gmail [dot] com",
  emailHref: "mailto:29tiffanyg@gmail.com",
};

export const PROJECTS = [
  {
    id: "experience",
    index: "01",
    title: "Experience",
    tag: "Research & Engineering",
    image: "/images/card-experience.jpg",
    intro:
      "Research and engineering roles across labs and teams, where models leave the notebook and meet the real world.",
    paragraphs: [
      "Tiffany's working life sits between the bench and the build: training models for AI-guided chemistry, running large-scale visual analysis pipelines, and making large language models answer faster and cheaper in production.",
      "The common thread is translation — taking a method that works in a paper and shaping it into a system that survives real data, real latency budgets, and real users.",
      "Each role sharpened a different edge: scientific rigor from research groups, speed and pragmatism from engineering teams, and taste from shipping things people actually touch.",
    ],
    facts: [
      ["Discipline", "ML research · systems"],
      ["Focus", "Chemistry · vision · serving"],
      ["Mode", "Lab to production"],
    ],
  },
  {
    id: "journey",
    index: "02",
    title: "My Journey",
    tag: "From Curiosity to Systems",
    image: "/images/card-journey.jpg",
    intro:
      "A path that started with questions about how things work and kept bending toward the tools that answer them.",
    paragraphs: [
      "It began with science — the pull of chemistry and biology, the sense that the natural world is a system waiting to be read. Code arrived as a way to read it faster.",
      "Machine learning turned out to be the bridge: a language in which a molecule, an image, and a sentence are all just structure, and structure can be learned.",
      "The journey since has been deliberate — deeper into the mathematics, closer to the hardware, and always back up to the surface where a person meets the tool.",
    ],
    facts: [
      ["Origin", "Chemistry & biology"],
      ["Bridge", "Machine learning"],
      ["Direction", "Systems people use"],
    ],
  },
  {
    id: "projects",
    index: "03",
    title: "Projects",
    tag: "Selected Builds",
    image: "/images/card-projects.jpg",
    intro:
      "Selected builds across AI-guided science, efficient inference, and interfaces that make research legible.",
    paragraphs: [
      "Projects here span the stack: models that propose and score candidate molecules, pipelines that read millions of images without blinking, and serving layers tuned until latency stops being the story.",
      "Some are research instruments, some are products, and the best are both — technical depth wrapped in an interface calm enough to disappear.",
      "Every build follows the same rule: if it can't be used by someone other than its author, it isn't finished.",
    ],
    facts: [
      ["Range", "Models · pipelines · apps"],
      ["Bias", "Working software"],
      ["Rule", "Usable or unfinished"],
    ],
  },
  {
    id: "hobbies",
    index: "04",
    title: "Hobbies",
    tag: "Life Beyond the Terminal",
    image: "/images/card-hobbies.jpg",
    intro:
      "The analog counterweight: film, ink, and slow crafts that ask for patience instead of throughput.",
    paragraphs: [
      "Away from the keyboard the pace changes. Film photography — where every frame costs something and attention is the currency. Ink and paper, for thinking at the speed of a pen.",
      "These aren't escapes from the technical work; they're its counterweight. Craft that cannot be iterated at 60 frames per second teaches a different kind of precision.",
      "The habit they share with research is noticing — the discipline of looking longer than is comfortable before deciding what matters.",
    ],
    facts: [
      ["Analog", "35mm film · ink"],
      ["Tempo", "Deliberately slow"],
      ["Payoff", "Better noticing"],
    ],
  },
];

export const PILLARS = [
  {
    no: "I",
    title: "AI for Scientific Discovery",
    copy: "Machine learning as a scientific instrument. Models that read spectra, propose molecules, and surface structure in biological data — built to sit inside the scientific method, not beside it. The aim is not automation for its own sake, but a shorter path between a hypothesis and an answer.",
    keys: ["AI-guided chemistry", "Computational biology", "Structure from data"],
    image: "/images/pillar-science.jpg",
    alt: "Thin navy ink drawing of a protein ribbon structure on cream paper",
  },
  {
    no: "II",
    title: "Inference Optimization",
    copy: "Speed is a feature of thought. Work on efficient LLM serving — batching, caching, quantization, and scheduling — turns research-grade models into systems that answer while the question still matters. Every millisecond recovered is headroom for a better model or a calmer interface.",
    keys: ["Efficient serving", "Quantization", "Latency engineering"],
    image: "/images/pillar-inference.jpg",
    alt: "Minimal navy line diagram of a chip die and latency curves on cream paper",
  },
  {
    no: "III",
    title: "Robotics & Machine Perception",
    copy: "Systems that see before they act. Work across computer vision and robotic systems — object detection, tracking, and the pipelines that turn camera frames into decisions a machine can stand behind. The interesting problems live in the loop: perception feeding action, and action changing what there is to perceive.",
    keys: ["Computer vision", "Object detection", "Perception to action"],
    image: "/images/pillar-robotics.jpg",
    alt: "Navy ink diagram of an articulated robotic arm with motion arcs and detection bounding boxes on cream paper",
  },
];

export const ABOUT = [
  "Tiffany Gu builds at the intersection of <em>machine learning</em>, scientific research, and product-minded engineering.",
  "Her work spans AI-guided chemistry, large-scale visual analysis, efficient LLM serving, and human-centered applications.",
  "She is especially interested in research that turns technical depth into <em>systems people can actually use</em>.",
];

export const FOOTER_LINKS = [
  { label: "Email", href: "mailto:29tiffanyg@gmail.com" },
  { label: "GitHub", href: "https://github.com/tiffany-gu" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tiffany-gu" },
  { label: "Google Scholar", href: "https://scholar.google.com/citations?user=IybpkJ8AAAAJ&hl=en" },
  { label: "Resume", href: "mailto:29tiffanyg@gmail.com?subject=Resume%20request" },
];

/** Frame sequence for the hero laptop film. */
export const FRAMES = {
  count: 121,
  path: (i) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`,
};
