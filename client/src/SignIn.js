import React, { useContext } from 'react';
import SocialSignIn from './SocialSignIn';
import SignUp from "./SignUp"
import { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { AuthContext } from './firebase/Auth';
import {
	doSignInWithEmailAndPassword,
	doPasswordReset
} from './firebase/FirebaseFunctions';
import { Button, Box, TextField } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const defaultProps = {
	bgcolor: 'background.paper',
	m: 1,
	border: 1.5,
	style: { width: '20rem', height: '30rem', padding: '50px' }
};
const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
			width: '25ch'
		}
	}
}));
function SignIn() {
	const classes = useStyles();
	const { currentUser } = useContext(AuthContext);
	const handleLogin = async (event) => {
		event.preventDefault();
		let { email, password } = event.target.elements;

		try {
			await doSignInWithEmailAndPassword(email.value, password.value);
		} catch (error) {
			alert(error);
		}
	};

	const passwordReset = (event) => {
		event.preventDefault();
		let email = document.getElementById('email').value;
		if (email) {
			doPasswordReset(email);
			alert('Password reset email was sent');
		} else {
			alert(
				'Please enter an email address below before you click the forgot password link'
			);
		}
	};
	const newUser = (event) => {
		event.preventDefault();

	return (
			<Redirect
				to={{
					pathname: '/signup',
				}}
			/>
	);
	};
	if (currentUser) {
		console.log(currentUser.uid);
		return (
			<Redirect
				to={{
					pathname: '/admin',
					state: { user_id: currentUser.uid }
				}}
			/>
		);
	}

	
	return (
		<Box display="flex" justifyContent="center" width="5000">
			<Box borderColor="primary.main" {...defaultProps}>
				<div>
					<h1>Login</h1>
					<form
						onSubmit={handleLogin}
						className={classes.root}
						noValidate
						autoComplete="off"
					>
						<TextField
							required
							id="email"
							name="email"
							label="Email"
							variant="outlined"
							type="email"
						/>

						<TextField
							required
							id="password"
							name="password"
							label="Password"
							variant="outlined"
							type="password"
						/>

						<Button
							variant="contained"
							color="primary"
							type="submit"
						>
							Log in
						</Button>

						<button
							className="forgotPassword"
							onClick={passwordReset}
						>
							Forgot Password
						</button>
						{/* <button
						type="submit"
							className="signup"
							onClick={newUser}
						>
						New Admin? Sign up here
						</button> */}
						<NavLink
								exact
								to="/signup"
								activeClassName="active"
							>
									New Admin? Sign up here
							</NavLink>
							<SocialSignIn />
					</form>

					<br />
				
				</div>
			</Box>
		</Box>
	);
}

export default SignIn;