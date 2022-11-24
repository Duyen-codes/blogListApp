import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/loginReducer";
import {
	setNotification,
	clearNotification,
} from "../reducers/notificationReducer";
import loginService from "../services/login";
import blogService from "../services/blogs";

// Material UI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Copyright(props) {
	return (
		<Typography
			variant='body2'
			color='text.secondary'
			align='center'
			{...props}
		>
			{"Copyright © "}
			<Link color='inherit' href='https://mui.com/'>
				Your Website
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const theme = createTheme();

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// handle login
	const handleSubmit = async (event) => {
		event.preventDefault();
		loginService
			.login({
				username,
				password,
			})
			.then((user) => {
				blogService.setToken(user.token);
				dispatch(setUser(user));
				window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
				dispatch(setNotification("info", "Login success"));
				navigate("/");
				setTimeout(() => {
					dispatch(clearNotification());
				}, 3000);
			})
			.catch(() => {
				dispatch(setNotification("error", "Wrong username or password"));
				setTimeout(() => {
					dispatch(clearNotification());
				}, 3000);
			});
	};
	// return (
	// 	<div>
	// 		<h2>Log in</h2>
	// 		<form onSubmit={handleSubmit}>
	// 			<div>
	// 				<TextField
	// 					label='username'
	// 					id='username'
	// 					type='text'
	// 					value={username}
	// 					name='username'
	// 					onChange={({ target }) => setUsername(target.value)}
	// 				/>
	// 			</div>
	// 			<div>
	// 				<TextField
	// 					label='password'
	// 					type='password'
	// 					id='password'
	// 					value={password}
	// 					name='password'
	// 					onChange={({ target }) => setPassword(target.value)}
	// 				/>
	// 			</div>
	// 			<div>
	// 				<Button
	// 					type='submit'
	// 					id='login-button'
	// 					variant='contained'
	// 					color='primary'
	// 				>
	// 					login
	// 				</Button>
	// 			</div>
	// 			<p>
	// 				*As a guest, you can login using username: root, password: salainen
	// 			</p>
	// 		</form>
	// 	</div>
	// );
	return (
		<ThemeProvider theme={theme}>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<Box
						component='form'
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin='normal'
							required
							fullWidth
							autoComplete='username'
							autoFocus
							label='Username'
							id='username'
							type='text'
							value={username}
							name='username'
							onChange={({ target }) => setUsername(target.value)}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>

						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href='#' variant='body2'>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href='#' variant='body2'>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<p>
					*As a guest, you can login using username: root, password: salainen
				</p>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
};

export default LoginForm;
