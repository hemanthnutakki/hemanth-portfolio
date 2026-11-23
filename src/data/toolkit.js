// Colors per category (same order as `skills` in profile.js), explanations per technology and related-technology links.
// Every "use" line restates something from Hemanth's projects or skills. No proficiency scores.
export const CAT_COLORS = ['#3b82f6', '#8b5cf6', '#22d3ee', '#60a5fa', '#a78bfa', '#34d3ee', '#818cf8']

const EWS = 'Early Warning System for Network Congestion'
const GEST = 'Volume Control Using Hand Gestures'
const POTATO = 'Potato Leaf Disease Detection'
const AIUSE = 'AI-assisted development across FluxReviews, CraveKart and this portfolio.'

export const techInfo = {
  C: { use: 'One of my core programming languages.' },
  'C++': { use: 'One of my core programming languages.' },
  Python: { use: 'Used for machine learning, data preprocessing, computer vision, and backend-related development.', projects: [POTATO, GEST] },
  'Data Structures and Algorithms': { use: 'My problem-solving foundation: 150+ coding problems solved across LeetCode and HackerRank.' },
  SQL: { use: 'Core database querying skill, alongside my MySQL certification on Oracle Cloud.' },
  HTML: { use: 'Used to build FluxReviews and this portfolio.', projects: ['FluxReviews'] },
  CSS: { use: 'Used to build responsive interfaces in FluxReviews and this portfolio.', projects: ['FluxReviews'] },
  JavaScript: { use: 'Used to build FluxReviews and this portfolio.', projects: ['FluxReviews'] },
  React: { use: 'Used to build CraveKart and this portfolio.', projects: ['CraveKart'] },
  Pandas: { use: 'Part of my data science toolkit for data preprocessing and analysis.' },
  NumPy: { use: 'Part of my data science toolkit for numerical computing.' },
  Matplotlib: { use: 'Part of my data science toolkit for data visualization.' },
  'Scikit-learn': { use: 'Used in the Incedo network congestion detection pipeline with Isolation Forest.', projects: [EWS] },
  CNN: { use: 'Used to classify potato leaf diseases such as Early Blight and Late Blight.', projects: [POTATO] },
  LSTM: { use: 'Used for time-series forecasting to predict potential telecom network congestion.', projects: [EWS] },
  'Isolation Forest': { use: 'Used with rule-based logic to detect abnormal network behaviour and classify cells as Red, Amber or Green.', projects: [EWS] },
  OpenCV: { use: 'Used in the hand gesture-based volume control project.', projects: [GEST] },
  MongoDB: { use: 'A database technology in my skill set.' },
  Firebase: { use: 'Used in FluxReviews and CraveKart for backend data management and application functionality.', projects: ['FluxReviews', 'CraveKart'] },
  Firestore: { use: 'Part of the CraveKart stack for application data.', projects: ['CraveKart'] },
  MySQL: { use: 'Relational database skills, backed by my Oracle Cloud MySQL certification.' },
  'REST APIs': { use: 'Designed and exposed the Detection and Prediction APIs during my Incedo internship.', projects: [EWS] },
  Git: { use: 'Version control for my projects.', projects: ['FluxReviews'] },
  GitHub: { use: 'Hosting and deployment workflows; FluxReviews is deployed through GitHub and Netlify.', projects: ['FluxReviews'] },
  Bash: { use: 'Part of my everyday development environment.' },
  'VS Code': { use: 'Part of my everyday development environment.' },
  NetBeans: { use: 'Part of my development environment.' },
  'Jupyter Notebook': { use: 'Part of my data science development environment.' },
  'Prompt Engineering': { use: 'Writing clear, structured instructions so AI tools give accurate and useful output.' },
  'AI-Assisted Software Development': { use: AIUSE, projects: ['FluxReviews', 'CraveKart'] },
  'Structured Prompt Design': { use: 'Giving prompts a role, context, task, constraints and output format. See the prompt laboratory.' },
  'Context Engineering': { use: 'Supplying the right background so AI assistance stays relevant to the task.' },
  'AI-Assisted Debugging': { use: 'Using AI coding assistants to find and fix issues during iterative development.' },
  'AI-Powered Prototyping': { use: 'Turning ideas into working prototypes quickly with AI assistance.' },
  'LLM-Based Development Workflows': { use: 'Planning, building and refining software through iterative work with AI coding assistants.' },
  'AI-Assisted Code Optimization': { use: 'Refining and improving code through AI-assisted iteration.' }
}

export const EDGES = [
  ['Python', 'Pandas'], ['Python', 'NumPy'], ['Python', 'Matplotlib'], ['Python', 'Scikit-learn'], ['Python', 'OpenCV'], ['Python', 'CNN'],
  ['Scikit-learn', 'Isolation Forest'], ['Isolation Forest', 'LSTM'], ['LSTM', 'REST APIs'], ['Isolation Forest', 'REST APIs'], ['Jupyter Notebook', 'Pandas'],
  ['HTML', 'CSS'], ['CSS', 'JavaScript'], ['JavaScript', 'React'], ['React', 'Firebase'], ['JavaScript', 'Firebase'], ['Firebase', 'Firestore'],
  ['SQL', 'MySQL'], ['Git', 'GitHub'],
  ['Prompt Engineering', 'Structured Prompt Design'], ['Prompt Engineering', 'Context Engineering'], ['Prompt Engineering', 'AI-Assisted Software Development'],
  ['LLM-Based Development Workflows', 'Prompt Engineering'], ['AI-Assisted Software Development', 'AI-Assisted Debugging'],
  ['AI-Assisted Software Development', 'AI-Powered Prototyping'], ['AI-Assisted Software Development', 'AI-Assisted Code Optimization']
]
