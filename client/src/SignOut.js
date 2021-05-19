import React, { useState } from 'react';
import { doSignOut } from './firebase/FirebaseFunctions';

const SignOutButton = () => {
  const [redirect, setRedirect] = useState(false);
  
  const handleClick = () => {
    setRedirect(true);
    doSignOut();
  }
  
  if (redirect) {
    window.location.href='/admin';
  }

  return (
    <button type="button" onClick={handleClick}>
      Sign Out
    </button>
  );
};

export default SignOutButton;