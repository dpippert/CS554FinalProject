const { ApolloServer, gql, ApolloError, UserInputError } = require('apollo-server');
const {appConfig, db} = require('./config');

const w = console.warn;

const typeDefs = gql`

  type Question {
    question: String
    answers: [String]
  }

  type QuestionGroup {
    topic: String
    questions: [Question]
  }

  type Query {
    getQuestion(topic: String) : Question
    randomQuestions(nTopics: Int!, nQuestions: Int!) : [QuestionGroup]
  }

  type Mutation {
    addQuestion(t: String!, q: String!, a: [String]!) : Question
  }
`;

function randBetween(lo, hi) {
  const x = (Math.random() * 1000).toFixed(0);
  return x % (hi - lo) + lo;
}

const resolvers = {
  Query: {
    getQuestion: async (_, {t}) => {
      const Q = await db.questions();
      const qs = await Q.find({t}).toArray();
      return qs.length ? qs[randBetween(0, qs.length)] : null;
    },

    randomQuestions: async (_, args) => {
      const Q = await db.questions();
      const qs = await Q.find().toArray();
      let results = {};
      const length = qs.length - 1;
      let usedIds = new Set();

      function alreadyUsed(id) {
        if (!usedIds.has(id)) {
          usedIds.add(id);
          return false;
        }
        return true;
      }
        
      let qualifyingGroups = new Set();
      let questionGroups = {};
      let breaker = 0;
      let done = broke = false;
      while (!broke && !done) {
        if (++breaker > 1000) {
          broke = true;
          break;
        }
        const n = randBetween(0, length);
        let doc = qs[n]; 
        if (alreadyUsed(doc._id))
          continue;
        let questionGroup = questionGroups[doc.topic];
        if (!questionGroup)
          questionGroup = [];
        questionGroup.push({question: doc.question,
                            answers: doc.answers});
        questionGroups[doc.topic] = questionGroup;
        if (breaker < 50)
          continue;
        for (var t in questionGroups) {
          if (questionGroups[t].length >= args.nQuestions) {
            qualifyingGroups.add(t);
            if (qualifyingGroups.size >= args.nTopics) {
              done = true;
              break;
            }
          }
        }
      }
      if (broke)
        throw new ApolloError('Unabled to assemble qualifing questions');
      let finalGroups = {};
      qualifyingGroups.forEach(g => {
        finalGroups[g] = questionGroups[g];
      });
      let y = Object.entries(finalGroups).map(x => {
        return {topic: x[0], questions: x[1]}
      });
      return Object.entries(finalGroups).map(x => {
        return {topic: x[0], questions: x[1]}
      });
    }
  },

  Mutation: {
    addQuestion: async (_, args) => {
      const Q = await db.questions();
      const {insertedCount} = await Q.insertOne(args);
      return {...args};
    }
  }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Tempest server ready at ${url} 🚀`);
});
