import React from 'react';
import './App.css';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
import Play from './Play';
import Admin from './Admin';
import Container from 'react-bootstrap/Container';
import Test2 from './Test2';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className="App-header">
            <div className="topictempest"></div>
            <nav>
              <NavLink className="navlink" to="/play">
                Ready to Play! 
              </NavLink>
              <NavLink className="navlink" to="/admin">
                Our Question and Answer Database 
              </NavLink>
            </nav>
          </header>
          <Container fluid>
            <Route exact path="/test2" component={Test2}/>
            <Route exact path="/play" component={Play}/>
            <Route exact path="/admin" component={Admin}/>
            <Route exact path="/signin" component={SignIn}/>
            <Route exact path="/signup" component={SignUp}/>
            <Route exact path="/changepassword" component={ChangePassword}/>
            <Route exact path="/forgortpassword" component={ForgotPassword}/>
          </Container>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
