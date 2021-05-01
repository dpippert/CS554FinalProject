// ----------------------------------------------------------------------------
// WARNING: Do not run this if you want to preserve entries in the questions
// collection, as this seeding starts by DELETING the questions collection! 
// ----------------------------------------------------------------------------

db.questions.drop()

// ----------------------------------------------------------------------------
// A topic/question pair must be unique.
// ----------------------------------------------------------------------------

db.questions.createIndex{t: 1, q: 1}, {unique: true});

// ----------------------------------------------------------------------------
// This needs to get populated with lots of unique topics and questions..
// ----------------------------------------------------------------------------

db.questions.insertMany(
  [
    {"t": "HTML",
     "q": "1 Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"t": "HTML",
     "q": "2 Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"t": "HTML",
     "q": "3 Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"t": "HTML",
     "q": "4 Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"t": "HTML",
     "q": "5 Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"t": "HTML",
     "q": "6 Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"t": "CSS",
     "q": "1 A selector always starts with this character.",
     "a": [".", "period"]},

    {"t": "CSS",
     "q": "2 A selector always starts with this character.",
     "a": [".", "period"]},

    {"t": "CSS",
     "q": "3 A selector always starts with this character.",
     "a": [".", "period"]},

    {"t": "CSS",
     "q": "4 A selector always starts with this character.",
     "a": [".", "period"]},

    {"t": "CSS",
     "q": "5 A selector always starts with this character.",
     "a": [".", "period"]},

    {"t": "CSS",
     "q": "6 A selector always starts with this character.",
     "a": [".", "period"]},

    {"t": "Node.js",
     "q": "1 The original package manager is acronymed as this.",
     "a": ["npm"]},

    {"t": "Node.js",
     "q": "2 The original package manager is acronymed as this.",
     "a": ["npm"]},

    {"t": "Node.js",
     "q": "3 The original package manager is acronymed as this.",
     "a": ["npm"]},

    {"t": "Node.js",
     "q": "4 The original package manager is acronymed as this.",
     "a": ["npm"]},

    {"t": "Node.js",
     "q": "5 The original package manager is acronymed as this.",
     "a": ["npm"]},

    {"t": "Node.js",
     "q": "6 The original package manager is acronymed as this.",
     "a": ["npm"]},

    {"t": "React",
     "q": "1 React was invented at this company.",
     "a": ["facebook"]},

    {"t": "React",
     "q": "2 React was invented at this company.",
     "a": ["facebook"]},

    {"t": "React",
     "q": "3 React was invented at this company.",
     "a": ["facebook"]},

    {"t": "React",
     "q": "4 React was invented at this company.",
     "a": ["facebook"]},

    {"t": "React",
     "q": "5 React was invented at this company.",
     "a": ["facebook"]},

    {"t": "React",
     "q": "6 React was invented at this company.",
     "a": ["facebook"]},

    {"t": "SASS",
     "q": "1 The standard and original file extension for SASS files is this.",
     "a": ["scss"]},

    {"t": "SASS",
     "q": "2 The standard and original file extension for SASS files is this.",
     "a": ["scss"]},

    {"t": "SASS",
     "q": "3 The standard and original file extension for SASS files is this.",
     "a": ["scss"]},

    {"t": "SASS",
     "q": "4 The standard and original file extension for SASS files is this.",
     "a": ["scss"]},

    {"t": "SASS",
     "q": "5 The standard and original file extension for SASS files is this.",
     "a": ["scss"]},

    {"t": "SASS",
     "q": "6 The standard and original file extension for SASS files is this.",
     "a": ["scss"]},

    {"t": "Redis",
     "q": "1 Sorted set commands begin with this letter",
     "a": ["z"]},

    {"t": "Redis",
     "q": "2 Sorted set commands begin with this letter",
     "a": ["z"]},

    {"t": "Redis",
     "q": "3 Sorted set commands begin with this letter",
     "a": ["z"]},

    {"t": "Redis",
     "q": "4 Sorted set commands begin with this letter",
     "a": ["z"]},

    {"t": "Redis",
     "q": "5 Sorted set commands begin with this letter",
     "a": ["z"]},

    {"t": "Redis",
     "q": "6 Sorted set commands begin with this letter",
     "a": ["z"]},
  ]);
