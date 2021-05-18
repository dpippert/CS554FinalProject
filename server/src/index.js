const { ApolloServer, gql, ApolloError, UserInputError } = require('apollo-server');
const { UniqueDirectiveNamesRule } = require('graphql');
//const { UniqueDirectiveNamesRule } = require('graphql');
const {appConfig, db} = require('./config');
const uuid = require('uuid');

const w = console.warn;

const typeDefs = gql`
    type Query {
        randomQuestions(nTopics: Int!, nQuestions: Int!): [QuestionGroup]
        getQuestions(page: Int): [Question]
        getQuestionsByTopic(topic: String!): [Question]
    }

    type Question {
        _id: String
        uid: String
        t: String
        q: String
        a: [String]
    }

    type QuestionGroup {
        topic: String
        questions: [Question]
    }

  
    type Mutation {
        addQuestion(uid: String, topic: String!, question: String!, answers: [String]!): Question
        deleteQuestion(_id: String!): Question
    }
`;

function randBetween(lo, hi) {
  const x = (Math.random() * 1000).toFixed(0);
  return x % (hi - lo) + lo;
}

const resolvers = {
    Query: {
        getQuestions: async (_, args) => {
            try {
                // get all questions in order of being added to db
                // may need pagination
                let page = 1;
                if (args.page) page = args.page;
                const questionCollection = await db.questions();
                return await questionCollection.find({}).skip((page-1)*20).limit(20).toArray();
            } catch (e) {
                console.log(e);
            }
        },

        getQuestionsByTopic: async (_, args) => {
            try {
                // get all the questions with the same topic
                // maybe use a dropdown on the frontend or a search for topic
                // may need pagination
                console.log(args.topic);
            } catch (e) {
                console.log(e);
            }
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
            let questionGroup = questionGroups[doc.t];
            if (!questionGroup)
              questionGroup = [];
            questionGroup.push({question: doc.q,
                                q: doc.q,
                                answers: doc.answers,
                                a: doc.a});
            questionGroups[doc.t] = questionGroup;
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
            throw new ApolloError('Unable to assemble qualifing questions');
          let finalGroups = {};
          qualifyingGroups.forEach(g => {
            finalGroups[g] = questionGroups[g];
          });
          return Object.entries(finalGroups).map(x => {
            return {t: x[0], topic: x[0], questions: x[1], q: x[1]}
          });
        }
    },

    QuestionGroup: {
    },

    Question: {
    },

    Mutation: {
        addQuestion: async (_, args) => {
            try {
                // add question to mongo collection
                // maybe use uuid to generate an id
                // structure would be:
                // {
                //    id: String,
                //    topic: String,
                //    question: String,
                //    answers: [ String ]
                // }
                const questionCollection = await db.questions();
                let uid = 'no-uid';
                if (args.uid) {
                    uid = args.uid;
                }
                const newQuestion = {
                    _id: uuid.v4(),
                    uid: uid,
                    t: args.topic,
                    q: args.question,
                    a: args.answers
                }
                const added = await questionCollection.insertOne(newQuestion);
                if (added.insertedCount === 0) throw 'Question not added to database';
                return newQuestion;
            } catch(e){
                console.log(e);
            }
        },
        deleteQuestion: async (_, args) => {
            try {
                const questionCollection = await db.questions();
                const question = await questionCollection.findOne({ _id: args._id });
                if (!question) throw 'Question does not exist';
                const deletionInfo = await questionCollection.removeOne({ _id: args._id });
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete question with id of ${id}`;
                }
                return question;
            } catch (e) {
                console.log(e);
            }
        }
    }
}

const server = new ApolloServer ({typeDefs, resolvers});
server.listen().then (({url}) => {
    console.log(`Server running on ${url}`);
});