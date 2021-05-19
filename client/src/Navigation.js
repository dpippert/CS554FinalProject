import React, { useContext, useLocation } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from './firebase/Auth';
import './App.css';
import firebase from 'firebase';

function Navigation() {
    //const { pathname } = useLocation();
    const { currentUser } = useContext(AuthContext);

    return (
        <nav className="navigation">
            <ul>
                <li>
                    <NavLink exact to='/' activeClassName='active'>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to='/admin' activeClassName='active'>
                        {currentUser ? "Your Questions" : "Sign In"}
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to='/play' activeClassName='active'>
                        Play
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation;