import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import Spinner from '../components/Spinner';

function Signup() {

	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmationRef = useRef();

	const [errors, setErrors] = useState(null);

	const {setUser, setToken, setIsManager, loading, setLoading} = useStateContext();

	const onSubmit = (e) => {
		e.preventDefault();
		const payload = {
			name: nameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
			password_confirmation: passwordConfirmationRef.current.value,
		}
		setLoading(true)
		axiosClient.post('/signup', payload)
			.then(({data}) => {
				setUser(data.user);
				setToken(data.token);
				setIsManager(data.user.role === 'ROLE_MANAGER');
				setLoading(false)
			})
			.catch(err => {
				(err.response && err.response.status === 422) && setErrors(err.response.data.errors)
				setLoading(false);
			});
	}
	useEffect(() => {
		setLoading(false);
	}, []);
		// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('Signup rendered');
	});
  return (
	<div className='login-signup-form animated fadeInDown'>
		<div className="form">
			<form onSubmit={onSubmit}>
				<h1 className='title'>Signup</h1>
				{
					errors && <div className='alert'>{Object.keys(errors).map(key => <p key={key}>{errors[key][0]}</p>)}</div>
				}
				<input ref={emailRef} name='email' type='email' placeholder='Email Address' autoFocus />
				<input ref={nameRef} name='name' type='text' placeholder='Full Name' />
				<input ref={passwordRef} name='password' type='password' placeholder='Password' />
				<input ref={passwordConfirmationRef} name='password_confirmation' type='password' placeholder='Confirm Password' />
				{loading ? <Spinner /> : <button className='btn btn-block'>Register</button>}
				<p className='message'>
					Already registered? <Link to="/login">Sign in</Link>
				</p>
			</form>
		</div>
	</div>
  )
}

export default Signup
