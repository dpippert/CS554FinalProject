const { ApolloServer, gql } = require('apollo-server');
const { UniqueDirectiveNamesRule } = require('graphql');
//const { UniqueDirectiveNamesRule } = require('graphql');
const {appConfig, db} = require('./config');
const uuid = require('uuid');

const typeDefs = gql`
    type Query {
        randomQuestions(nTopics: Int!, nQuestions: Int!): [QuestionGroup]
        getQuestions(page: Int): [Question]
        getQuestionsByTopic(topic: String!): [Question]
    }

    type QuestionGroup {
        topic: String
        questions: [Question]
    }

    type Question {
        _id: String
        t: String
        q: String
        a: [String]
    }

    type Mutation {
        addQuestion(topic: String!, question: String!, answers: [String]!): Question
    }
`;

// mongo structure the same, just set restraints when grabbing data (unique q's per topic)

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
                const newQuestion = {
                    _id: uuid.v4(),
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
        }
    }
}

const server = new ApolloServer ({typeDefs, resolvers});
server.listen().then (({url}) => {
    console.log(`Server running on ${url}`);
});