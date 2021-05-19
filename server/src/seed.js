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
    {"_id": new ObjectId().str,
     "t": "HTML",
     "u": null,
     "q": "Main content goes inside this required element.",
     "a": ["body", "<body>"]},

    {"_id": new ObjectId().str,
     "t": "HTML",
     "u": null,
     "q": "Title goes inside this required element.",
     "a": ["title", "<title>"]},

    {"_id": new ObjectId().str,
     "t": "HTML",
     "u": null,
     "q": "This is the largest font heading tag by default",
     "a": ["h1", "<h1>","1"]},

    {"_id": new ObjectId().str,
     "t": "HTML",
     "u": null,
     "q": "HTML stands for?",
     "a": ["Hyper Text Markup Language"]},

    {"_id": new ObjectId().str,
     "t": "HTML",
     "u": null,
     "q": "The tag that contains all other tags as children",
     "a": ["html", "<html>"]},

    {"_id": new ObjectId().str,
     "t": "HTML",
     "u": null,
     "q": "Latest version of HTML",
     "a": ["5", "html5", "five"]},

    {"_id": new ObjectId().str,
     "t": "CSS",
     "u": null,
     "q": " A selector always starts with this character.",
     "a": [".", "period"]},

    {"_id": new ObjectId().str,
     "t": "CSS",
     "u": null,
     "q": "what does CSS stand for",
     "a": ["Cascading style sheets", "Cascading stylesheets"]},

    {"_id": new ObjectId().str,
     "t": "CSS",
     "u": null,
     "q": "What element in an HTML document calls in an external style sheet?",
     "a": ["link"]},

    {"_id": new ObjectId().str,
     "t": "CSS",
     "u": null,
     "q": "Which HTML tag is used to define an internal style sheet?",
     "a": ["<style>", "style"]},

    {"_id": new ObjectId().str,
     "t": "CSS",
     "u": null,
     "q": "Which HTML attribute is used to define inline styles?",
     "a": ["style"]},

    {"_id": new ObjectId().str,
     "t": "CSS",
     "u": null,
     "q": "Which property is used to change the background color?",
     "a": ["background-color"]},

    {"_id": new ObjectId().str,
     "t": "GraphQL",
     "u": null,
     "q": "Which property is used to change the background color?",
     "a": ["background-color"]},

    {"_id": new ObjectId().str,
     "t": "New Jersey",
     "u": null,
     "q": "Current governor of New Jersey last name is",
     "a": ["Murphy"]},

    {"_id": new ObjectId().str,
     "t": "New Jersey",
     "u": null,
     "q": "Capital city is",
     "a": ["Trenton"]},

    {"_id": new ObjectId().str,
     "t": "New Jersey",
     "u": null,
     "q": "Major toll highway name is",
     "a": ["New Jersey Turnpike", "NJ Turnpike"]},

    {"_id": new ObjectId().str,
     "t": "New Jersey",
     "u": null,
     "q": "State nickname is",
     "a": ["Garden State", "The Garden State"]},

    {"_id": new ObjectId().str,
     "t": "New Jersey",
     "u": null,
     "q": "Casino and resort city is this",
     "a": ["Atlantic City"]},

    {"_id": new ObjectId().str,
     "t": "New Jersey",
     "u": null,
     "q": "First word of major technology university is this",
     "a": ["Stevens"]},

    {"_id": new ObjectId().str,
     "t": "New Jersey",
     "u": null,
     "q": "Stevens Institute of Technology is located in this city",
     "a": ["Hoboken"]},

    {"_id": new ObjectId().str,
     "t": "New Jersey",
     "u": null,
     "q": "Stevens Institute mascot is this winged animal",
     "a": ["Duck"]},

    {"_id": new ObjectId().str,
     "t": "Node.js",
     "u": null,
     "q": "The most popular HTTP library is called this",
     "a": ["axios"]},

    {"_id": new ObjectId().str,
     "t": "Node.js",
     "u": null,
     "q": "Standard in, Standard out, and Standard error live in this module.",
     "a": ["process"]},

    {"_id": new ObjectId().str,
     "t": "Node.js",
     "u": null,
     "q": "Build a web app using this common server-side package",
     "a": ["Express"]},

    {"_id": new ObjectId().str,
     "t": "Node.js",
     "u": null,
     "q": "Use this file to list your application package dependencies",
     "a": ["package.json"]},

    {"_id": new ObjectId().str,
     "t": "Node.js",
     "u": null,
     "q": "Use this function to import a package into your app",
     "a": ["require"]},

    {"_id": new ObjectId().str,
     "t": "Node.js",
     "u": null,
     "q": "To create an empty project from scratch, you can use this npm command",
     "a": ["init", "npm init"]},

    {"_id": new ObjectId().str,
     "t": "Node.js",
     "u": null,
     "q": "This special character finds use when specifying your package version dependencies",
     "a": ["^", "caret"]},

    {"_id": new ObjectId().str,
     "t": "React",
     "u": null,
     "q": "Creator of this framework, last name",
     "a": ["Walke"]},

    {"_id": new ObjectId().str,
     "t": "React",
     "u": null,
     "q": "The hook used for managing function component state",
     "a": ["useState"]},

    {"_id": new ObjectId().str,
     "t": "React",
     "u": null,
     "q": "The hook used for running side effects after a render",
     "a": ["useEffect"]},

    {"_id": new ObjectId().str,
     "t": "React",
     "u": null,
     "q": "Bootstrapified react components can be had from this library",
     "a": ["react-bootstrap", "react bootstrap", "reactbootstrap"]},

    {"_id": new ObjectId().str,
     "t": "React",
     "u": null,
     "q": "Installing a component into the current render tree is called this",
     "a": ["mount", "mounting"]},

 
    {"_id": new ObjectId().str,
     "t": "React",
     "u": null,
     "q": "Removing a component from the current render tree is called this",
     "a": ["unmount", "unmounting"]},

    {"_id": new ObjectId().str,
     "t": "SASS",
     "u": null,
     "q": " The standard and original file extension for SASS files is this.",
     "a": ["scss", ".scss"]},

    {"_id": new ObjectId().str,
     "t": "SASS",
     "u": null,
     "q": "A group of CSS declarations that can be reused in SASS is called",
     "a": ["mixin","mixins"]},

    {"_id": new ObjectId().str,
     "t": "SASS",
     "u": null,
     "q": "SASS first word of acronymn stands for",
     "a": ["Syntactically"]},

    {"_id": new ObjectId().str,
     "t": "SASS",
     "u": null,
     "q": "Is SASS fully CSS3 compatible?",
     "a": ["true","yes"]},

    {"_id": new ObjectId().str,
     "t": "SASS",
     "u": null,
     "q": "What is more powerful SASS or CSS",
     "a": ["sass"]},

    {"_id": new ObjectId().str,
     "t": "SASS",
     "u": null,
     "q": "Document type of SASS is?",
     "a": ["structured"]},

    {"_id": new ObjectId().str,
     "t": "Redis",
     "u": null,
     "q": "Sorted set commands begin with this letter",
     "a": ["z"]},

    {"_id": new ObjectId().str,
     "t": "Redis",
     "u": null,
     "q": "Redis stands for?",
     "a": [" REmote DIctionary Server"]},

    {"_id": new ObjectId().str,
     "t": "Redis",
     "u": null,
     "q": "The command used to run the Redis Client",
     "a": ["redis-cli"]},

    {"_id": new ObjectId().str,
     "t": "Redis",
     "u": null,
     "q": "Redis is written in this language",
     "a": ["ANSI C", "C"]},

    {"_id": new ObjectId().str,
     "t": "Redis",
     "u": null,
     "q": "Redis typically holds the whole dataset in",
     "a": ["memory", "RAM"]},

    {"_id": new ObjectId().str,
     "t": "Redis",
     "u": null,
     "q": "What kind of replication does Redis support?",
     "a": ["master","master-replica"]},

     {"_id": new ObjectId().str,
      "t": "JavaScript",
     "u": null,
     "q": "A sequence of characters is called",
     "a": ["String"]},

    {"_id": new ObjectId().str,
     "t": "JavaScript",
     "u": null,
     "q": "Everything in JavaScript that can be stored in a variable known as?",
     "a": ["object"]},

    {"_id": new ObjectId().str,
     "t": "JavaScript",
     "u": null,
     "q": "How many major syntactic categories are there in JavaScript?",
     "a": ["2"]},

    {"_id": new ObjectId().str,
     "t": "JavaScript",
     "u": null,
     "q": "Which is the most common host environment for JavaScript?",
     "a": ["Web Browser", "browser"]},

    {"_id": new ObjectId().str,
     "t": "JavaScript",
     "u": null,
     "q": "What is common in both Javascript and Java?",
     "a": ["Syntax", "java", "name"]},

    {"_id": new ObjectId().str,
     "t": "JavaScript",
     "u": null,
     "q": "What element is used in JavaScript to store multiple values in a single variable?",
     "a": ["Array", "Arrays"]},
  ]);
