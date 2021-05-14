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
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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
        <Container fluid>
          <Row className="top-row">
            <Col className="top-cols" xs={4}>
              <br/>
              <NavLink className="navlink" to="/admin">Our Question and Answer Repository</NavLink>
            </Col>
            <Col xs={4}>
              <br/>
              <NavLink className="navlink" to="/play">Ready to Play!</NavLink>
            </Col>
            <Col xs={4}>
              <NavLink className="navlink2" to="/test2">
                <img className="logo" src='./topictempest_small.png' alt="Topic Tempest logo"/>
              </NavLink>
            </Col>
          </Row>
            <Route exact path="/test2" component={Test2}/>
            <Route exact path="/play" component={Play}/>
            <Route exact path="/admin" component={Admin}/>
        </Container>
      </Router>
    </ApolloProvider>
  );
}

export default App;
