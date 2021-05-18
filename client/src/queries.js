const {gql} = require('@apollo/client');

const GET_RANDOM_QUESTIONS = gql`
  query GetRandomQuestions($nTopics: Int!, $nQuestions: Int!) {
    randomQuestions(nTopics: $nTopics, nQuestions: $nQuestions) {
      topic
      questions {
        q
        a
      }
    }
  }
`;

const GET_QUESTIONS = gql`
  query ($page: Int) {
    getQuestions(page: $page) {
      _id
      t
      q
      a
    }
  }
`;
/*
const GET_QUESTIONS_BY_TOPIC = gql`
  query ($page: Int!) {
    getQuestionsByTopic(page: $page) {
      t
      q
      a
    }
  }
`;
*/
const ADD_QUESTION = gql`
  mutation addNewQuestion ($topic: String!, $question: String!, $answers: [String]!) {
    addQuestion(topic: $topic, question: $question, answers: $answers) {
      _id
      t
      q
      a
    }  
  }
`;

const DELETE_QUESTION = gql`
  mutation removeQuestion ($_id: String!) {
    deleteQuestion(_id: $_id) {
      _id
      t
      q
      a
    }
  }
`

module.exports = {
  GET_RANDOM_QUESTIONS,
  GET_QUESTIONS,
  //GET_QUESTIONS_BY_TOPIC,
  ADD_QUESTION,
  DELETE_QUESTION
};