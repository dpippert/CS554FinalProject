import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
import Play from './Play';
import Admin from './Admin';
import Container from 'react-bootstrap/Container';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import ChangePassword from './ChangePassword';
import {AuthProvider} from './firebase/Auth'
import PrivateRoute from './PrivateRoute'
import Navigation from './Navigation';
//import AddQuestion from './AddQuestion';

// ----------------------------------------------------------------------------
// ApolloClient needs to be able to find its ApolloServer to talk to. The
// ApolloServer is assumed below to be running on the same machine as where
// this browser app was *loaded* from, which may not be localhost. For example
// if this App was started by going to your browser and typing (eg)
// http://10.0.0.85:3000, then this ApolloClient init code expects that its
// ApolloServer it needs to talk to, is running on 10.0.0.85:4000.
// Uses window.location to find out these required coordinates.
// ----------------------------------------------------------------------------

let serverUrl = window.location.protocol + "//" +
                  window.location.hostname + ":" + "4000";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
          uri: serverUrl
        })
});

function App() {
  return (
    <ApolloProvider client={client}> 
     <AuthProvider>
        <Router>
        <div>
          <header className="App-header"> </header>
            <Navigation/>
          <Container fluid>
          <Route exact path="/" component={Home}/>
            <Route exact path="/play" render={() => { return <Play client={client}/>}}/>
            <PrivateRoute exact path="/admin" component={Admin}/>
            <Route exact path="/signin" component={SignIn}/>
            <Route exact path="/signup" component={SignUp}/>
            <Route exact path="/changepassword" component={ChangePassword}/>
            {/* <Route exact path="/forgortpassword" component={ForgotPassword}/> */}
          </Container>
        </div>
      </Router>
      </AuthProvider>
    </ApolloProvider> 
  );
}

export default App;
