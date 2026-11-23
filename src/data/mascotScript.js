// Central configuration for Kanna: per section, what she says, how she acts and what she looks at.
// targets = selectors (inside the section) for heading / sub / content gaze. Every line restates facts from profile.js.
export const SECTION_SCRIPT = {
  top: { title: 'Welcome', short: 'Hi, I\u2019m Kanna, Hemanth\u2019s tiny AI guide. Scroll on and I\u2019ll explain what you\u2019re looking at.', gesture: 'wave', mood: 'friendly', pose: 'confident' },
  about: { title: 'About', short: 'This is Hemanth: B.Tech CSE (Data Science) at SRM IST with a 9.39 CGPA. He likes intelligent systems, backend work and machine learning.', gesture: 'tilt', mood: 'thinking', pose: 'relaxed' },
  experience: { title: 'Experience', short: 'His Incedo internship: an early warning system for telecom network congestion. Let me walk you through how it works.', gesture: 'present', mood: 'friendly', pose: 'confident', script: 'incedo', auto: true, targets: { sub: ['h3', 'h4', '[data-gaze]'] } },
  projects: { title: 'Projects', short: 'Five projects, from FluxReviews to CraveKart. Hover or focus a card and I\u2019ll tell you what it does.', gesture: 'point', mood: 'curious', pose: 'lean' },
  research: { title: 'Research', short: 'An IEEE paper comparing Random Forest and KNN for loan default prediction, plus his research interests and IEEE reviewer work.', gesture: 'think', mood: 'thinking', pose: 'relaxed' },
  achievements: { title: 'Achievements', short: '4th rank at Hack Fusion 2024, 150+ problems solved, RMO Stage 2, and research presented at the IEEE World Skills Conference 2025.', gesture: 'fistPump', mood: 'happy', pose: 'confident' },
  leadership: { title: 'Leadership', short: 'He is a Convenor for operations and resources at SRM\u2019s Directorate of Student Affairs (MILAN), and was on the winning Incedo Premier League team.', gesture: 'nod', mood: 'friendly', pose: 'confident' },
  skills: { title: 'Technical toolkit', short: 'His toolkit as a 3D universe. Hover a node to see how he used it, or click for details. Want a guided tour?', gesture: 'present', mood: 'happy', pose: 'lean', script: 'toolkit', action: 'Give me a tour', targets: { sub: ['[data-gaze]', 'h3'] } },
  'ai-prompting': { title: 'AI Prompt Engineering', short: 'Here is how Hemanth works with AI. A quick look at what makes a prompt work.', gesture: 'point', mood: 'curious', pose: 'lean', script: 'prompt', auto: true, targets: { sub: ['[data-gaze]', 'h3'] } },
  contact: { title: 'Contact', short: 'Have an idea or an opportunity? Send Hemanth a message. He would love to hear from you.', gesture: 'greet', mood: 'friendly', pose: 'confident' }
}

export const PROJECT_SAY = {
  fluxreviews: 'FluxReviews: Hemanth\u2019s movie reviews and OTT updates platform. He founded it with four co-founders and built it with Firebase and the TMDB API.',
  cravekart: 'CraveKart is still in progress: weather-based food picks, group ordering with real-time sync, and budget meals.',
  ews: 'His Incedo project: Isolation Forest and rules detect congestion, then an LSTM forecasts it for Amber cells.',
  potato: 'A CNN that classifies potato leaf diseases such as Early Blight and Late Blight, with a Flutter app interface.',
  gesture: 'A computer-vision app that controls system volume with hand gestures, built with Python and OpenCV.'
}

const st = (n) => `[data-stage="${n}"]`
export const SCRIPTS = {
  incedo: {
    section: 'experience', anchor: '[data-gaze="pipeline"]',
    steps: [
      { text: 'Hemanth\u2019s Incedo project: catching telecom network congestion before it becomes a problem.', target: '#experience article h3', gesture: 'present', mood: 'friendly' },
      { text: '1. Input: operational and performance metrics from towers and cells.', target: st(1), gesture: 'point', mood: 'curious', sync: { stage: 1 } },
      { text: '2. Preprocessing: cleaning the data and engineering features.', target: st(2), gesture: 'point', mood: 'curious', sync: { stage: 2 } },
      { text: '3. Detection: Isolation Forest plus rule-based logic flags abnormal behaviour.', target: st(3), gesture: 'point', mood: 'thinking', sync: { stage: 3 } },
      { text: '4. Status: each cell is Red (critical), Amber (warning) or Green (normal).', target: st(4), gesture: 'present', mood: 'curious', sync: { stage: 4 } },
      { text: '5. Forecasting: an LSTM predicts when Amber cells may become congested.', target: st(5), gesture: 'present', mood: 'thinking', sync: { stage: 5 } },
      { text: '6. REST APIs: separate Detection and Prediction APIs.', target: st(6), gesture: 'point', mood: 'curious', sync: { stage: 6 } },
      { text: '7. Integration: Detection API for the Frontend team, Prediction API for the AI Agent team.', target: st(7), gesture: 'point', mood: 'friendly', sync: { stage: 7 } },
      { text: '8. Early warning: detection plus forecasting enables proactive monitoring.', target: st(8), gesture: 'fistPump', mood: 'happy', sync: { stage: 8 } }
    ]
  },
  prompt: {
    section: 'ai-prompting', anchor: '[data-lab="stage"]',
    steps: [
      { text: 'AI Prompt Engineering: a good answer starts with a clear instruction.', target: '#ai-prompting h2', gesture: 'present', mood: 'friendly', sync: { mode: 'structured' } },
      { text: 'Role: who the AI should act as.', target: '[data-part="role"]', gesture: 'point', mood: 'curious', sync: { part: 'role', mode: 'structured' } },
      { text: 'Context: the background it needs.', target: '[data-part="context"]', gesture: 'point', mood: 'curious', sync: { part: 'context' } },
      { text: 'Task: what exactly to do.', target: '[data-part="task"]', gesture: 'point', mood: 'thinking', sync: { part: 'task' } },
      { text: 'Constraints: the rules and limits.', target: '[data-part="constraints"]', gesture: 'point', mood: 'thinking', sync: { part: 'constraints' } },
      { text: 'Output format: the shape of the answer.', target: '[data-part="output"]', gesture: 'point', mood: 'curious', sync: { part: 'output' } },
      { text: 'Basic prompt: vague answer. Structured prompt: usable answer.', target: '[data-lab="compare"]', gesture: 'present', mood: 'curious', sync: { part: null, mode: 'compare' } },
      { text: 'Hemanth uses this with AI assistants in FluxReviews, CraveKart and this portfolio.', target: '[data-lab="copy"]', gesture: 'thumbs', mood: 'happy', sync: { mode: 'compare' } }
    ]
  },
  toolkit: {
    section: 'skills',
    steps: [
      { text: 'This is Hemanth\u2019s technical toolkit as a 3D universe. Each cluster is a category, and links connect technologies that work together.', target: '[data-gaze="toolkit-canvas"]', gesture: 'present', mood: 'happy' },
      { text: 'Programming languages: C, C++ and Python.', target: '[data-gaze="toolkit-canvas"]', gesture: 'point', mood: 'curious', sync: { category: 'Programming Languages' } },
      { text: 'Core computer science: data structures and algorithms, plus SQL.', target: '[data-gaze="toolkit-canvas"]', gesture: 'point', mood: 'curious', sync: { category: 'Core Computer Science' } },
      { text: 'Web development: HTML, CSS, JavaScript and React. They built FluxReviews, CraveKart and this portfolio.', target: '[data-gaze="toolkit-canvas"]', gesture: 'point', mood: 'happy', sync: { category: 'Web Development' } },
      { text: 'AI and machine learning: Pandas, NumPy, Matplotlib, Scikit-learn, CNN, LSTM, Isolation Forest and OpenCV.', target: '[data-gaze="toolkit-canvas"]', gesture: 'present', mood: 'thinking', sync: { category: 'AI & Machine Learning' } },
      { text: 'Databases and backend: MongoDB, Firebase, Firestore, MySQL and REST APIs.', target: '[data-gaze="toolkit-canvas"]', gesture: 'point', mood: 'curious', sync: { category: 'Databases & Backend' } },
      { text: 'Tools: Git, GitHub, Bash, VS Code, NetBeans and Jupyter Notebook.', target: '[data-gaze="toolkit-canvas"]', gesture: 'point', mood: 'friendly', sync: { category: 'Tools & Development Environment' } },
      { text: 'And AI-assisted development: prompt engineering, structured prompts, context engineering and AI-assisted debugging.', target: '[data-gaze="toolkit-canvas"]', gesture: 'present', mood: 'happy', sync: { category: 'AI & Prompt Engineering' } },
      { text: 'Hover any node to see how it was used, or click it for details.', target: '[data-gaze="toolkit-list"]', gesture: 'thumbs', mood: 'happy' }
    ]
  }
}
