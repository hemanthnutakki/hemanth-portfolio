export const PARTS = [
  { key: 'role', label: 'Role', color: '#60a5fa', why: 'Tells the AI who to act as, so expertise and tone fit the job.' },
  { key: 'context', label: 'Context', color: '#8b5cf6', why: 'Gives the background it needs: the project, the data or the audience.' },
  { key: 'task', label: 'Task', color: '#22d3ee', why: 'States exactly what should be done.' },
  { key: 'constraints', label: 'Constraints', color: '#818cf8', why: 'Sets the limits and rules: technologies, length, things to avoid.' },
  { key: 'output', label: 'Output format', color: '#38bdf8', why: 'Describes the shape of the answer so results are consistent and easy to use.' }
]

// Two short, illustrative scenarios (outputs show structure, not real model responses, and contain no invented numbers).
export const SCENARIOS = [
  {
    id: 'code', name: 'Coding',
    basic: 'Make a group ordering feature.',
    basicOut: 'Sure! You could let users share a cart. Use a database and update it when people add items. Here is some code to get started...',
    parts: {
      role: 'You are a senior full-stack developer experienced with React and Firebase.',
      context: 'I am building a food delivery app (React, TypeScript, Firestore). Several friends should build one shared order together.',
      task: 'Design real-time group ordering so everyone sees each other\u2019s changes instantly.',
      constraints: 'Use Firestore listeners. Handle two people editing at once. Keep the UI responsive on mobile.',
      output: '1) Short architecture plan 2) Data model 3) Key React component 4) Edge cases to test.'
    },
    structuredOut: '1. Architecture: one shared order document; each member subscribes with onSnapshot.\n2. Data model: orders/{id} plus an items subcollection (userId, dishId, quantity).\n3. Component: GroupOrder listens to items and merges quantities per dish.\n4. Edge cases: same dish added twice, a member leaves, offline edits.'
  },
  {
    id: 'data', name: 'Data analysis',
    basic: 'Analyze my loan data.',
    basicOut: 'I can take a look at the data. Check the columns, clean it up, and train a model to see what works.',
    parts: {
      role: 'You are a data scientist focused on credit-risk modelling.',
      context: 'An anonymized loan dataset with a default label and mixed numeric and categorical features.',
      task: 'Compare Random Forest and KNN for predicting loan default.',
      constraints: 'Handle missing values, apply feature selection, avoid data leakage, use a train/test split.',
      output: 'A comparison table (accuracy, precision, recall) and three conclusions.'
    },
    structuredOut: 'Model | Accuracy | Precision | Recall (filled from your own run)\n1. Which model generalizes better on the test split.\n2. Which features mattered after selection.\n3. Recommended next steps and risks.'
  }
]
