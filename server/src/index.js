const { ApolloServer, gql, ApolloError, UserInputError } = require('apollo-server');
const {appConfig, db} = require('./config');

const typeDefs = gql`
  type Question {
    t: String!
    q: String!
    a: [String]!
  }

  type Query {
    getQuestion(topic: String) : Question
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
