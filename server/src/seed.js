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

    {"t": "New Jersey",
     "q": "Current governor of New Jersey last name is",
     "a": ["Murphy"]},

    {"t": "New Jersey",
     "q": "Capital city is",
     "a": ["Trenton"]},

    {"t": "New Jersey",
     "q": "Major toll highway name is",
     "a": ["New Jersey Turnpike"]},

    {"t": "New Jersey",
     "q": "State nickname is",
     "a": ["Garden State", "The Garden State"]},

    {"t": "New Jersey",
     "q": "Casino and resort city is this",
     "a": ["Atlantic City"]},

    {"t": "New Jersey",
     "q": "First word of major technology university is this",
     "a": ["Stevens"]},

    {"t": "New Jersey",
     "q": "Stevens Institute of Technology is located in this city",
     "a": ["Hoboken"]},

    {"t": "New Jersey",
     "q": "Stevens Institute mascot is this winged animal",
     "a": ["Duck"]},

    {"t": "Node.js",
     "q": "The most popular HTTP library is called this",
     "a": ["axios"]},

    {"t": "Node.js",
     "q": "Standard in, Standard out, and Standard error live in this module.",
     "a": ["process"]},

    {"t": "Node.js",
     "q": "Build a web app using this common server-side package",
     "a": ["Express"]},

    {"t": "Node.js",
     "q": "Use this file to list your application package dependencies",
     "a": ["package.json"]},

    {"t": "Node.js",
     "q": "Use this function to import a package into your app",
     "a": ["require"]},

    {"t": "Node.js",
     "q": "To create an empty project from scratch, you can use this npm command",
     "a": ["init"]},

    {"t": "Node.js",
     "q": "This special character finds use when specifying your package version dependencies",
     "a": ["^", "caret"]},

    {"t": "React",
     "q": "Creator of this framework, last name
     "a": ["Walke"]},

    {"t": "React",
     "q": "The hook used for managing function component state",
     "a": ["useState"]},

    {"t": "React",
     "q": "The hook used for running side effects after a render",
     "a": ["useEffect"]},

    {"t": "React",
     "q": "Bootstrapified react components can be had from this library",
     "a": ["react-bootstrap", "react bootstrap"]},

    {"t": "React",
     "q": "Installing a component into the current render tree is called this",
     "a": ["mount", "mounting"]},

    {"t": "React",
     "q": "Removing a component from the current render tree is called this",
     "a": ["unmount", "unmounting"]},

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
