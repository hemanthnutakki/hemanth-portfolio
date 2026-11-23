// Single source of truth. Only facts supplied by N. Hemanth. Leave a value null until it is verified.
export const profile = {
  name: 'N. Hemanth',
  email: 'hemanthnutakki555@gmail.com',
  phone: '+91 9704624878',
  github: 'https://github.com/hemanthnutakki',      // TODO: add URL
  linkedin: 'https://www.linkedin.com/in/hemanth-nutakki',    // TODO: add URL
  resume: null,      // TODO: put resume.pdf in /public and set '/resume.pdf'
  titles: ['Software Developer', 'AI/ML Engineer', 'Backend Developer', 'Data Science Enthusiast', 'Founder & Researcher'],
  heroSub: 'Building Intelligent Systems. Engineering Digital Experiences. Exploring What\u2019s Next.',
  about: [
    'I\u2019m N. Hemanth, a Computer Science and Engineering graduate specializing in Data Science from SRM Institute of Science and Technology, with a CGPA of 9.39/10.',
    'I enjoy building intelligent systems, developing scalable backend solutions, exploring machine learning, and creating meaningful digital products.',
    'From developing AI-powered solutions and conducting research to founding an entertainment platform, I enjoy transforming ideas into practical technology.'
  ],
  stats: [
    { value: 9.39, decimals: 2, label: 'CGPA' },
    { value: 150, suffix: '+', label: 'Coding problems solved' },
    { value: 4, suffix: 'th', label: 'Rank \u2013 Hack Fusion 2024' },
    { value: 1, label: 'IEEE research publication' },
    { value: 1, label: 'Startup founded' }
  ]
}

export const experience = {
  company: 'Incedo Inc.', role: 'Backend Engineer Intern', period: 'January 2026 \u2013 July 2026', location: 'Hyderabad, India',
  project: 'Early Warning System for Network Congestion',
  summary: 'Developed an intelligent network congestion detection and prediction system for telecom infrastructure.',
  points: [
    'Developed a network congestion detection system using Isolation Forest and rule-based logic.',
    'Classified telecom towers/cells into Red, Amber, and Green categories based on operational and performance metrics.',
    'Built an LSTM-based time-series forecasting model to predict potential congestion in Amber cells.',
    'Performed data preprocessing, feature engineering, model training, and evaluation.',
    'Designed and exposed REST APIs for detection and prediction modules.',
    'Integrated the Detection API with the Frontend team and the Prediction API with the AI Agent team.'
  ],
  flow: [
    { lane: 'Detection', title: 'Input data', text: 'Operational and performance metrics from telecom towers and cells are collected as the input for monitoring.' },
    { lane: 'Detection', title: 'Data preprocessing', text: 'Data is cleaned and preprocessed, and features are engineered, before the detection and prediction models are applied.' },
    { lane: 'Detection', title: 'Congestion detection', text: 'Isolation Forest and rule-based logic work together to identify abnormal network behaviour.' },
    { lane: 'Detection', title: 'Traffic status', text: 'Each cell is classified as Red, Amber or Green based on its operational and performance metrics.' },
    { lane: 'Prediction & integration', title: 'LSTM forecasting', text: 'Amber cells go through an LSTM-based time-series forecasting pipeline to predict when congestion may occur.' },
    { lane: 'Prediction & integration', title: 'REST APIs', text: 'Separate REST APIs expose the Detection and Prediction modules.' },
    { lane: 'Prediction & integration', title: 'System integration', text: 'The Detection API is integrated with the Frontend team and the Prediction API with the AI Agent team.' },
    { lane: 'Prediction & integration', title: 'Early warning', text: 'Combining detection and forecasting supports proactive network monitoring and early intervention.' }
  ],
  states: [
    ['red', 'Red', 'Congestion or a critical condition.'],
    ['amber', 'Amber', 'Warning condition that needs closer monitoring. These cells go on to LSTM forecasting.'],
    ['green', 'Green', 'Normal operating condition.']
  ]
}

export const projects = [
  { id: 'fluxreviews', title: 'FluxReviews', pointsTitle: 'What I did', role: 'Founder & Lead Developer', type: 'Full-Stack Web Development', live: 'https://fluxreviews.netlify.app/', github: null,
    tech: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'TMDB API', 'GitHub', 'Netlify'],
    description: 'Founded and led the development of FluxReviews, an entertainment-focused platform for movie reviews, ratings, upcoming theatrical releases, and OTT updates.',
    points: ['Founded and initiated the project.', 'Led design and technical development.', 'Built responsive and interactive interfaces.', 'Integrated Firebase for backend data management.', 'Integrated TMDB API for movie information and data autofill.', 'Created individual SEO-friendly movie review pages.', 'Implemented movie search and genre filtering.', 'Developed an admin dashboard for content management.', 'Configured GitHub and Netlify deployment workflows.', 'Worked on SEO optimization and Google Search Console integration.', 'Collaborated with four co-founders.'] },
  { id: 'cravekart', title: 'CraveKart', role: 'Full-Stack Developer', type: 'Advanced Food Delivery Platform', status: 'Ongoing', accent: 'orange', live: null, github: null,
    tech: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Firestore', 'Firebase Authentication', 'Cloud Functions', 'OpenWeatherMap API'],
    description: 'Developing a full-stack food delivery platform with intelligent food discovery and personalized ordering experiences.',
    features: [
      ['CraveWeather', 'Weather-based food recommendations using real-time weather data through the OpenWeatherMap API.'],
      ['CraveTogether', 'Collaborative group ordering that lets multiple users select dishes and combine them into one order using real-time synchronization.'],
      ['Smart Budget Meals', 'Budget-based meal recommendations that suggest food combinations within users\u2019 spending limits.'],
      ['Food Discovery', 'Restaurant search, cuisine filters, restaurant details, and categorized menus.'],
      ['Order Management', 'Cart, checkout, order placement, and order tracking.']
    ],
    pointsTitle: 'Technical focus',
    points: ['Full-stack development', 'Real-time data synchronization', 'Intelligent recommendation systems', 'API integration', 'Authentication', 'Responsive UI/UX'] },
  { id: 'ews', title: 'Early Warning System for Network Congestion', role: 'Backend Engineer Intern', type: 'Incedo Internship Project', live: null, github: null,
    tech: ['Isolation Forest', 'LSTM', 'REST API'],
    description: 'An intelligent telecom network monitoring system combining Isolation Forest, rule-based detection, and LSTM forecasting.',
    points: ['Anomaly detection', 'Traffic classification', 'Time-series forecasting', 'REST API development', 'Predictive monitoring'] },
  { id: 'potato', title: 'Potato Leaf Disease Detection', role: null, type: 'January 2025 \u2013 May 2025', live: null, github: null,
    tech: ['Python', 'CNN', 'Deep Learning', 'Flutter'],
    description: 'Developed a CNN-based deep learning solution to identify potato leaf diseases, including Early Blight and Late Blight.',
    points: ['Image preprocessing', 'Data augmentation', 'CNN-based classification', 'Disease identification', 'Agricultural application', 'Flutter-based application interface'] },
  { id: 'gesture', title: 'Volume Control Using Hand Gestures', role: null, type: 'December 2023 \u2013 January 2024', live: null, github: null,
    tech: ['Python', 'OpenCV'],
    description: 'Developed a computer vision application that controls system volume using hand gestures.',
    points: ['Real-time hand gesture recognition', 'Volume increase and decrease', 'Mute and unmute commands', 'Contactless interaction'] }
]

export const research = {
  interests: ['Probabilistic approaches to uncertainty quantification in deep models.', 'Algebraic feature representations for structured data.', 'Benchmarks and tooling for reproducible data-science experiments.'],
  publication: {
    title: 'Machine Learning Approaches for Loan Default Prediction: A Comparative Analysis of Random Forest and KNN Algorithms.',
    authors: ['K. Balaji Bhuvan', 'N. Hemanth', 'V. Niketh'],
    conference: '2025 World Skills Conference on Universal Data Analytics and Sciences (WorldSUAS)',
    publisher: 'IEEE', date: 'August 22, 2025', pages: '1\u20136', url: 'https://ieeexplore.ieee.org/abstract/document/11199197',
    abstract: 'Compared Random Forest and K-Nearest Neighbors algorithms for loan default prediction using an anonymized loan dataset. Evaluated model performance after preprocessing and feature selection, finding Random Forest more accurate and reliable for credit-risk prediction.'
  },
  reviewer: ['CCIC 2026', 'ICGSECT']
}

export const achievements = [
  'Secured 4th Rank in HACK FUSION 2024, conducted by NIT Jamshedpur.',
  'Solved 150+ coding problems across LeetCode and HackerRank.',
  'Qualified Regional Mathematical Olympiad (RMO) Stage 2.',
  'Presented research at IEEE World Skills Conference 2025.',
  'Published IEEE research paper.'
]

export const leadership = [
  {
    id: 'milan', backdrop: 'MILAN',
    org: 'Directorate of Student Affairs, SRM IST', role: 'Convenor \u2013 Operations & Resource Management',
    description: 'Actively contribute to organizing major university events and festivals, including MILAN, one of SRM University\u2019s largest cultural festivals.',
    listTitle: 'Run of show',
    points: ['Coordinate event operations and resource management.', 'Plan and arrange logistical requirements.', 'Coordinate with different teams and stakeholders.', 'Manage operational requirements during events.', 'Contribute to the successful execution of major university festivals.']
  },
  {
    id: 'ipl', backdrop: 'IPL',
    org: 'Incedo Inc.', role: 'Volunteer \u2013 Incedo Premier League (IPL) Cricket Tournament',
    description: 'Volunteered in organizing and coordinating the Incedo Premier League cricket tournament, contributing to event management and ensuring smooth tournament execution.',
    listTitle: 'Responsibilities & contributions',
    points: [
      'Coordinated tournament activities and supported overall event organization.',
      'Participated in meetings with HR representatives and senior management to discuss tournament rules, regulations, and organizational requirements.',
      'Collaborated with team captains to communicate tournament guidelines and establish the code of conduct.',
      'Helped coordinate communication between management, captains, and participants.',
      'Balanced volunteering responsibilities alongside internship project deliverables and regular project work.',
      'Contributed to maintaining smooth coordination throughout the tournament.'
    ],
    achievement: 'Part of the winning team at the Incedo Premier League cricket tournament.',
    skills: ['Leadership', 'Event Coordination', 'Stakeholder Communication', 'Teamwork', 'Time Management', 'Conflict Resolution', 'Organizational Skills']
  }
]

export const skills = {
  'Programming Languages': ['C', 'C++', 'Python'],
  'Core Computer Science': ['Data Structures and Algorithms', 'SQL'],
  'Web Development': ['HTML', 'CSS', 'JavaScript', 'React'],
  'AI & Machine Learning': ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'CNN', 'LSTM', 'Isolation Forest', 'OpenCV'],
  'Databases & Backend': ['MongoDB', 'Firebase', 'Firestore', 'MySQL', 'REST APIs'],
  'Tools & Development Environment': ['Git', 'GitHub', 'Bash', 'VS Code', 'NetBeans', 'Jupyter Notebook'],
  'AI & Prompt Engineering': ['Prompt Engineering', 'AI-Assisted Software Development', 'Structured Prompt Design', 'Context Engineering', 'AI-Assisted Debugging', 'AI-Powered Prototyping', 'LLM-Based Development Workflows', 'AI-Assisted Code Optimization']
}

export const certifications = [
  { title: 'Salesforce AI Associate', url: null },
  { title: 'Build MySQL Database for Applications on Oracle Cloud \u2013 Certified Professional', url: null },
  { title: 'AWS Certified AI Practitioner', url: null }
]

export const sections = [
  ['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'], ['research', 'Research'],
  ['achievements', 'Achievements'], ['leadership', 'Leadership'], ['skills', 'Skills'], ['ai-prompting', 'AI Prompting'], ['contact', 'Contact']
]

export const education = {
  degree: 'B.Tech \u2013 Computer Science and Engineering (Data Science)',
  school: 'SRM Institute of Science and Technology, Kattankulathur',
  detail: 'Graduating 2026 \u00B7 CGPA 9.39/10',
  history: [
    { title: 'B.Tech \u2013 Computer Science and Engineering (Data Science)', school: 'SRM Institute of Science and Technology, Kattankulathur', year: '2026', score: 'CGPA 9.39/10' },
    { title: 'Class XII \u2013 MPC', school: 'Sri Bhavishya Junior College, Vijayawada', year: '2022', score: 'Percentage: 95.3%' },
    { title: 'Class X', school: 'Slate The School, Poranki', year: '2020', score: 'Percentage: 92.6%' }
  ]
}

export const aiPrompt = {
  description: [
    'I leverage AI-assisted development and structured prompt engineering to transform ideas into functional applications, accelerate development workflows, explore innovative solutions, and improve user experiences.',
    'I use AI coding assistants to plan application architecture, develop frontend interfaces, implement features, debug issues, and refine code through iterative development.'
  ],
  applications: [
    ['FluxReviews', 'AI-assisted development, interface refinement, and feature implementation.'],
    ['CraveKart', 'AI-assisted feature development, application workflows, and responsive interfaces.'],
    ['Personal Portfolio', 'AI-assisted 3D development and interactive UI experimentation.']
  ],
  steps: ['Idea', 'Structured prompt', 'AI-assisted build', 'Debug & refine', 'Working product'],
  code: ['// prompt \u2192 product', 'context: "food delivery app, React + Firebase"', 'task:    "group ordering with live sync"', 'review:  "test, debug, refine"', 'ship:    "responsive, working feature"']
}
