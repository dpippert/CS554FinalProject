// ----------------------------------------------------------------------------
// WARNING: Do not run this if you want to preserve entries in the questions
// collection, as this seeding starts by DELETING the questions collection! 
// ----------------------------------------------------------------------------

db.questions.drop()

// ----------------------------------------------------------------------------
// A topic/question pair must be unique.
// ----------------------------------------------------------------------------

db.questions.createIndex({t: 1, q: 1}, {unique: true});

// ----------------------------------------------------------------------------
// This needs to get populated with lots of unique topics and questions..
// ----------------------------------------------------------------------------

db.questions.insertMany(
  [
    {"t": "HTML",
     "q": "Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"t": "HTML",
     "q": "Title goes inside this required element.",
     "a": ["title", "<title>"]},

    {"t": "HTML",
     "q": "Is the highest heading tag",
     "a": ["h1", "<h1>","1"]},

    {"t": "HTML",
     "q": "HTML stands for?",
     "a": ["Hyper text markup language"]},

    {"t": "HTML",
     "q": "The tag that contains all the tags",
     "a": ["html", "<html>"]},

    {"t": "HTML",
     "q": "Latest version of HTML",
     "a": ["5", "html5","five"]},

    {"t": "CSS",
     "q": " A selector always starts with this character.",
     "a": [".", "period"]},

    {"t": "CSS",
     "q": "what does CSS stand for",
     "a": ["Cascading style sheets", "Cascading stylesheets"]},

    {"t": "CSS",
     "q": "Where in an HTML document is the correct place to refer to an external style sheet?",
     "a": [".", "period"]},

    {"t": "CSS",
     "q": "Which HTML tag is used to define an internal style sheet?",
     "a": ["<Head>", "head"]},

    {"t": "CSS",
     "q": "Which HTML attribute is used to define inline styles?",
     "a": ["style"]},

    {"t": "CSS",
     "q": "Which property is used to change the background color?",
     "a": ["background-color"]},

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

    {"t": "React",
     "q": "Creator of this framework, last name",
     "a": ["Walke"]},

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

    {"t": "SASS",
     "q": " The standard and original file extension for SASS files is this.",
     "a": ["scss"]},

    {"t": "SASS",
     "q": "A group of CSS declarations that can be reused in SASS is called",
     "a": ["mixin","mixins"]},

    {"t": "SASS",
     "q": "SASS stands for",
     "a": ["Syntactically awesome Stylesheets","Syntactically awesome Style sheets"]},

    {"t": "SASS",
     "q": "Is SASS fully CSS3 compatile?",
     "a": ["true","yes"]},

    {"t": "SASS",
     "q": "What is more powerful  SASS or CSS",
     "a": ["sass"]},

    {"t": "SASS",
     "q": "Document type of SASS is?",
     "a": ["structured"]},

    {"topic": "Redis",
     "question": "Sorted set commands begin with this letter",
     "answers": ["z"]},

    {"topic": "Redis",
     "question": "Redis stands for?",
     "answers": [" REmote DIctionary Server"]},

    {"topic": "Redis",
     "question": "The command used to run the Redis Client",
     "answers": ["redis-cli"]},

    {"topic": "Redis",
     "question": "Redis is written in-",
     "answers": ["ANSI C"]},

    {"topic": "Redis",
     "question": "Redis typically holds the whole dataset in",
     "answers": ["memory"]},

    {"t": "Redis",
     "q": "What kind of replication does Redis support?",
     "a": ["master","master-replica"]},

     {"t": "JavaScript",
     "q": "A sequence of text known as a-",
     "a": ["String"]},

    {"t": "JavaScript",
     "q": "Everything in JavaScript that can be stored in a variable known as?",
     "a": ["object"]},

    {"t": "JavaScript",
     "q": "How many major syntactic categories are there in the JavaScript?",
     "a": ["2"]},

    {"t": "JavaScript",
     "q": "Which is the most common host environment for JavaScript?",
     "a": ["Web Browser"]},

    {"t": "JavaScript",
     "q": "What is common in both Javascript and Java?",
     "a": ["Syntax"]},

    {"t": "JavaScript",
     "q": "What element is used in JavaScript to store multiple values in a single variable?",
     "a": ["Array", "Arrays"]},

  ]);
