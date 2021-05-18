
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from './firebase/Auth';
import './App.css';
import firebase from 'firebase';



import { AppBar, Toolbar } from '@material-ui/core';

const Navigation = () => {
	const { currentUser } = useContext(AuthContext);
	//console.log(currentUser);
	//console.log(firebase.auth().currentUser);
	return (
		<div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
	);
};

const NavigationAuth = () => {
	/*
	console.log(firebase.auth().currentUser);
	const userID = firebase.auth().currentUser.uid;
*/
  let isloading = false; 
  let data = true;
	if (isloading) {
		return <div>Loading</div>;
	} else if (data === undefined) {
		return <div>Loading</div>;
	} else {
		return (
			<div>
				<nav className="navigation">
					
					<AppBar
						position="relative"
					
					>
                        	<Toolbar style={{ color: 'black' }}>
						
							<div class="nav">
							
								<NavLink
									exact
									to="/"
									activeClassName="active"
								>
							Home   

								</NavLink>
                                </div>
                            <div class="nav">
								<NavLink
									exact
									to="/admin"
									activeClassName="active"
								>
							Question-Answers Repo   

								</NavLink>
                                </div>
                            <div class="nav">
							<NavLink
								exact
								to="/play"
								activeClassName="active"
							>
								Play    
							</NavLink>
						</div>
						
							
                        </Toolbar>
					</AppBar>
				</nav>
				
			</div>
		);
	}
};

const NavigationNonAuth = () => {
	return (
		<div>
			<nav className="navigation">
				
				<AppBar position="relative" style={{ background: '#2E3B55', paddingLeft:"200px" }}>
					<Toolbar style={{ color: 'black' }}>
						<div class="nav">
							<NavLink
								exact
								to="/play"
								activeClassName="active"
								id="landing"
							>
							          Ready To Play        
							</NavLink>
						</div>

						<div class="nav">
							<NavLink
								exact
								to="/signin"
								activeClassName="active"
                id="portal"
							>
								Our Question and Answer Portal   
							</NavLink>
						</div>
                      
					</Toolbar>
				</AppBar>
			</nav>
		</div>
	);
};

export default Navigation;