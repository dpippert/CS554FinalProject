const {gql} = require('@apollo/client');

const GET_RANDOM_QUESTIONS = gql`
  query GetRandomQuestions($nTopics: Int!, $nQuestions: Int!) {
    randomQuestions(nTopics: $nTopics, nQuestions: $nQuestions) {
      topic
      questions {
        question
        answers
      }
    }
  }
`;

module.exports = {
  GET_RANDOM_QUESTIONS
};

