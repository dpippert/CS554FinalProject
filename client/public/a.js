const {ApolloClient, HttpLink, InMemoryCache} = require('@apollo/client');

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
          uri: 'http://localhost:4000'
        })
});

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

async function go() {
  const qs = await client_.query({query: GET_RANDOM_QUESTIONS,
                                  variables: {nTopics: 5,
                                              nQuestions: 5},
                                  fetchPolicy: "no-cache"});
}

go().then();
