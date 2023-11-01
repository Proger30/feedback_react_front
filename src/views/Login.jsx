import {useRef, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import Spinner from '../components/Spinner';

function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();

	const [errors, setErrors] = useState(null);

	const {setUser, setToken, setIsManager, loading, setLoading} = useStateContext();

	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		const payload = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};
		axiosClient.post('/login', payload)
			.then(({data}) => {
				setUser(data.user);
				setToken(data.token);
				setIsManager(data.user.role === 'ROLE_MANAGER');
				setLoading(false);
			})
			.catch(err => {
				if (err.response && err.response.status === 422) {
					setErrors(err.response.data.errors ? err.response.data.errors : {email: [err.response.data.message]});
				}
				setLoading(false);
			});
	}
	useEffect(() => {
		setLoading(false);
	}, [])
	// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('Login rendered');
	});
  return (
	<div className='login-signup-form animated fadeInDown'>
		<div className="form">
			<form onSubmit={onSubmit}>
				<h1 className='title'>Login into your account</h1>
				{
					errors && <div className='alert'>
						{Object.keys(errors).map(key => {
							return <p key={key}>{errors[key][0]}</p>
						})}
					</div>
				}
				<input ref={emailRef} type='email' placeholder='Email' autoFocus />
				<input ref={passwordRef} type='password' placeholder='Password' />
				{loading ? <Spinner /> : <button className='btn btn-block'>Login</button>}
				<p className='message'>
					Not Registered? <Link to="/signup">Create an account</Link>
				</p>
			</form>
		</div>
	</div>
  )
}

export default Login