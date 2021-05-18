import { gql } from '@apollo/client';

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

export default {
  GET_QUESTIONS,
  //GET_QUESTIONS_BY_TOPIC,
  ADD_QUESTION
}

