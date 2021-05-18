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
//
// u: UserID that entered the question or null for system entered
// t: topic
// q: question
// a: array of answers
// ----------------------------------------------------------------------------

db.questions.insertMany(
  [
    {"t": "HTML",
     "u": null,
     "q": "Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"t": "HTML",
     "u": null,
     "q": "Title goes inside this required element.",
     "a": ["title", "<title>"]},

    {"t": "HTML",
     "u": null,
     "q": "Is the highest heading tag",
     "a": ["h1", "<h1>","1"]},

    {"t": "HTML",
     "u": null,
     "q": "HTML stands for?",
     "a": ["Hyper text markup language"]},

    {"t": "HTML",
     "u": null,
     "q": "The tag that contains all the tags",
     "a": ["html", "<html>"]},

    {"t": "HTML",
     "u": null,
     "q": "Latest version of HTML",
     "a": ["5", "html5","five"]},

    {"t": "CSS",
     "u": null,
     "q": " A selector always starts with this character.",
     "a": [".", "period"]},

    {"t": "CSS",
     "u": null,
     "q": "what does CSS stand for",
     "a": ["Cascading style sheets", "Cascading stylesheets"]},

    {"t": "CSS",
     "u": null,
     "q": "Where in an HTML document is the correct place to refer to an external style sheet?",
     "a": [".", "period"]},

    {"t": "CSS",
     "u": null,
     "q": "Which HTML tag is used to define an internal style sheet?",
     "a": ["<Head>", "head"]},

    {"t": "CSS",
     "u": null,
     "q": "Which HTML attribute is used to define inline styles?",
     "a": ["style"]},

    {"t": "CSS",
     "u": null,
     "q": "Which property is used to change the background color?",
     "a": ["background-color"]},

    {"t": "New Jersey",
     "u": null,
     "q": "Current governor of New Jersey last name is",
     "a": ["Murphy"]},

    {"t": "New Jersey",
     "u": null,
     "q": "Capital city is",
     "a": ["Trenton"]},

    {"t": "New Jersey",
     "u": null,
     "q": "Major toll highway name is",
     "a": ["New Jersey Turnpike"]},

    {"t": "New Jersey",
     "u": null,
     "q": "State nickname is",
     "a": ["Garden State", "The Garden State"]},

    {"t": "New Jersey",
     "u": null,
     "q": "Casino and resort city is this",
     "a": ["Atlantic City"]},

    {"t": "New Jersey",
     "u": null,
     "q": "First word of major technology university is this",
     "a": ["Stevens"]},

    {"t": "New Jersey",
     "u": null,
     "q": "Stevens Institute of Technology is located in this city",
     "a": ["Hoboken"]},

    {"t": "New Jersey",
     "u": null,
     "q": "Stevens Institute mascot is this winged animal",
     "a": ["Duck"]},

    {"t": "Node.js",
     "u": null,
     "q": "The most popular HTTP library is called this",
     "a": ["axios"]},

    {"t": "Node.js",
     "u": null,
     "q": "Standard in, Standard out, and Standard error live in this module.",
     "a": ["process"]},

    {"t": "Node.js",
     "u": null,
     "q": "Build a web app using this common server-side package",
     "a": ["Express"]},

    {"t": "Node.js",
     "u": null,
     "q": "Use this file to list your application package dependencies",
     "a": ["package.json"]},

    {"t": "Node.js",
     "u": null,
     "q": "Use this function to import a package into your app",
     "a": ["require"]},

    {"t": "Node.js",
     "u": null,
     "q": "To create an empty project from scratch, you can use this npm command",
     "a": ["init", "npm init"]},

    {"t": "Node.js",
     "u": null,
     "q": "This special character finds use when specifying your package version dependencies",
     "a": ["^", "caret"]},

    {"t": "React",
     "u": null,
     "q": "Creator of this framework, last name",
     "a": ["Walke"]},

    {"t": "React",
     "u": null,
     "q": "The hook used for managing function component state",
     "a": ["useState"]},

    {"t": "React",
     "u": null,
     "q": "The hook used for running side effects after a render",
     "a": ["useEffect"]},

    {"t": "React",
     "u": null,
     "q": "Bootstrapified react components can be had from this library",
     "a": ["react-bootstrap", "react bootstrap", "reactbootstrap"]},

    {"t": "React",
     "u": null,
     "q": "Installing a component into the current render tree is called this",
     "a": ["mount", "mounting"]},

    {"t": "React",
     "u": null,
     "q": "Removing a component from the current render tree is called this",
     "a": ["unmount", "unmounting"]},

    {"t": "SASS",
     "u": null,
     "q": " The standard and original file extension for SASS files is this.",
     "a": ["scss"]},

    {"t": "SASS",
     "u": null,
     "q": "A group of CSS declarations that can be reused in SASS is called",
     "a": ["mixin","mixins"]},

    {"t": "SASS",
     "u": null,
     "q": "SASS first word of acronymn stands for",
     "a": ["Syntactically"]},

    {"t": "SASS",
     "u": null,
     "q": "Is SASS fully CSS3 compatile?",
     "a": ["true","yes"]},

    {"t": "SASS",
     "u": null,
     "q": "What is more powerful  SASS or CSS",
     "a": ["sass"]},

    {"t": "SASS",
     "u": null,
     "q": "Document type of SASS is?",
     "a": ["structured"]},

    {"t": "Redis",
     "u": null,
     "q": "Sorted set commands begin with this letter",
     "a": ["z"]},

    {"t": "Redis",
     "u": null,
     "q": "Redis stands for?",
     "a": [" REmote DIctionary Server"]},

    {"t": "Redis",
     "u": null,
     "q": "The command used to run the Redis Client",
     "a": ["redis-cli"]},

    {"t": "Redis",
     "u": null,
     "q": "Redis is written in this language",
     "a": ["ANSI C", "C"]},

    {"t": "Redis",
     "u": null,
     "q": "Redis typically holds the whole dataset in",
     "a": ["memory"]},

    {"t": "Redis",
     "u": null,
     "q": "What kind of replication does Redis support?",
     "a": ["master","master-replica"]},

     {"t": "JavaScript",
     "u": null,
     "q": "A sequence of characters is called",
     "a": ["String"]},

    {"t": "JavaScript",
     "u": null,
     "q": "Everything in JavaScript that can be stored in a variable known as?",
     "a": ["object"]},

    {"t": "JavaScript",
     "u": null,
     "q": "How many major syntactic categories are there in the JavaScript?",
     "a": ["2"]},

    {"t": "JavaScript",
     "u": null,
     "q": "Which is the most common host environment for JavaScript?",
     "a": ["Web Browser"]},

    {"t": "JavaScript",
     "u": null,
     "q": "What is common in both Javascript and Java?",
     "a": ["Syntax", "java", "name"]},

    {"t": "JavaScript",
     "u": null,
     "q": "What element is used in JavaScript to store multiple values in a single variable?",
     "a": ["Array", "Arrays"]},
  ]);
