import React, {} from 'react';
import SignOutButton from "./SignOut"
import './App.css';
import ChangePassword from "./ChangePassword"
import {} from '@apollo/client';

function Admin(props) {
  return <div>CRUD against Mongo, this is Mahima's stuff
   
   
    <ChangePassword/>

  <SignOutButton/>
  </div>;
}

export default Admin;
