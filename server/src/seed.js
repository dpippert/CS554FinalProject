// ----------------------------------------------------------------------------
// WARNING: Do not run this if you want to preserve entries in the questions
// collection, as this seeding starts by DELETING the questions collection! 
// ----------------------------------------------------------------------------

db.questions.drop()

// ----------------------------------------------------------------------------
// A topic/question pair must be unique.
// ----------------------------------------------------------------------------

db.questions.createIndex({topic: 1, question: 1}, {unique: true});

// ----------------------------------------------------------------------------
// This needs to get populated with lots of unique topics and questions..
// ----------------------------------------------------------------------------

db.questions.insertMany(
  [
    {"topic": "HTML",
     "question": "1 Main content goes inside this required element.",
     "answers": ["body", "<body>"]},

    {"topic": "HTML",
     "question": "2 Main content goes inside this required element.",
     "answers": ["body", "<body>"]},

    {"topic": "HTML",
     "question": "3 Main content goes inside this required element.",
     "answers": ["body", "<body>"]},

    {"topic": "HTML",
     "question": "4 Main content goes inside this required element.",
     "answers": ["body", "<body>"]},

    {"topic": "HTML",
     "question": "5 Main content goes inside this required element.",
     "answers": ["body", "<body>"]},

    {"topic": "HTML",
     "question": "6 Main content goes inside this required element.",
     "answers": ["body", "<body>"]},

    {"topic": "CSS",
     "question": "1 A selector always starts with this character.",
     "answers": [".", "period"]},

    {"topic": "CSS",
     "question": "2 A selector always starts with this character.",
     "answers": [".", "period"]},

    {"topic": "CSS",
     "question": "3 A selector always starts with this character.",
     "answers": [".", "period"]},

    {"topic": "CSS",
     "question": "4 A selector always starts with this character.",
     "answers": [".", "period"]},

    {"topic": "CSS",
     "question": "5 A selector always starts with this character.",
     "answers": [".", "period"]},

    {"topic": "CSS",
     "question": "6 A selector always starts with this character.",
     "answers": [".", "period"]},

    {"topic": "New Jersey",
     "question": "Current governor of New Jersey last name is",
     "answers": ["Murphy"]},

    {"topic": "New Jersey",
     "question": "Capital city is",
     "answers": ["Trenton"]},

    {"topic": "New Jersey",
     "question": "Major toll highway name is",
     "answers": ["New Jersey Turnpike"]},

    {"topic": "New Jersey",
     "question": "State nickname is",
     "answers": ["Garden State", "The Garden State"]},

    {"topic": "New Jersey",
     "question": "Casino and resort city is this",
     "answers": ["Atlantic City"]},

    {"topic": "New Jersey",
     "question": "First word of major technology university is this",
     "answers": ["Stevens"]},

    {"topic": "New Jersey",
     "question": "Stevens Institute of Technology is located in this city",
     "answers": ["Hoboken"]},

    {"topic": "New Jersey",
     "question": "Stevens Institute mascot is this winged animal",
     "answers": ["Duck"]},

    {"topic": "Node.js",
     "question": "The most popular HTTP library is called this",
     "answers": ["axios"]},

    {"topic": "Node.js",
     "question": "Standard in, Standard out, and Standard error live in this module.",
     "answers": ["process"]},

    {"topic": "Node.js",
     "question": "Build a web app using this common server-side package",
     "answers": ["Express"]},

    {"topic": "Node.js",
     "question": "Use this file to list your application package dependencies",
     "answers": ["package.json"]},

    {"topic": "Node.js",
     "question": "Use this function to import a package into your app",
     "answers": ["require"]},

    {"topic": "Node.js",
     "question": "To create an empty project from scratch, you can use this npm command",
     "answers": ["init"]},

    {"topic": "Node.js",
     "question": "This special character finds use when specifying your package version dependencies",
     "answers": ["^", "caret"]},

    {"topic": "React",
     "question": "Creator of this framework, last name",
     "answers": ["Walke"]},

    {"topic": "React",
     "question": "The hook used for managing function component state",
     "answers": ["useState"]},

    {"topic": "React",
     "question": "The hook used for running side effects after a render",
     "answers": ["useEffect"]},

    {"topic": "React",
     "question": "Bootstrapified react components can be had from this library",
     "answers": ["react-bootstrap", "react bootstrap"]},

    {"topic": "React",
     "question": "Installing a component into the current render tree is called this",
     "answers": ["mount", "mounting"]},

    {"topic": "React",
     "question": "Removing a component from the current render tree is called this",
     "answers": ["unmount", "unmounting"]},

    {"topic": "SASS",
     "question": "1 The standard and original file extension for SASS files is this.",
     "answers": ["scss"]},

    {"topic": "SASS",
     "question": "2 The standard and original file extension for SASS files is this.",
     "answers": ["scss"]},

    {"topic": "SASS",
     "question": "3 The standard and original file extension for SASS files is this.",
     "answers": ["scss"]},

    {"topic": "SASS",
     "question": "4 The standard and original file extension for SASS files is this.",
     "answers": ["scss"]},

    {"topic": "SASS",
     "question": "5 The standard and original file extension for SASS files is this.",
     "answers": ["scss"]},

    {"topic": "SASS",
     "question": "6 The standard and original file extension for SASS files is this.",
     "answers": ["scss"]},

    {"topic": "Redis",
     "question": "1 Sorted set commands begin with this letter",
     "answers": ["z"]},

    {"topic": "Redis",
     "question": "2 Sorted set commands begin with this letter",
     "answers": ["z"]},

    {"topic": "Redis",
     "question": "3 Sorted set commands begin with this letter",
     "answers": ["z"]},

    {"topic": "Redis",
     "question": "4 Sorted set commands begin with this letter",
     "answers": ["z"]},

    {"topic": "Redis",
     "question": "5 Sorted set commands begin with this letter",
     "answers": ["z"]},

    {"topic": "Redis",
     "question": "6 Sorted set commands begin with this letter",
     "answers": ["z"]},
  ]);
