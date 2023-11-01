import { Link, Navigate, Outlet } from 'react-router-dom'

import {useStateContext} from '../context/ContextProvider.jsx';
import { useEffect } from 'react';
import axiosClient from '../axios-client.js';

function DefaultLayout() {

	const {user, token, isManager, setUser, setToken, setIsManager, toggleCanCreateFeedback, setLoading, notification} = useStateContext ();

	if (!token) {
		return <Navigate to="/login" />
	}

	const onLogout = (e) => {
		e.preventDefault();
		setLoading(true);
		axiosClient.post('/logout')
		.then(() => {
			setUser({});
			setToken(null);
			setLoading(false);
		});
	}
	// eslint-disable-next-line
	useEffect(() => {
		setLoading(true);
		axiosClient.get('/user')
		.then(({data}) => {
			setUser(data);
			setIsManager(data.role === 'ROLE_MANAGER');
			setLoading(false);
		});
		// eslint-disable-next-line
	}, []);

	// eslint-disable-next-line
	useEffect(() => {
		// user.id && toggleCanCreateFeedback(new Date(user.last_feedback_created).getTime() + 0 <= new Date().getTime());
		toggleCanCreateFeedback(true);
		// eslint-disable-next-line
	}, [user]);

	// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('DefaultLayout rendered');
	});

	return (
		<div id='defaultLayout'>
			<aside>
				<Link to="/table/feedbacks">Feedback</Link>
				{isManager && <Link to="/table/users">Users</Link>}
				
			</aside>
			<div className='content'>
				<header>
					<div>Header</div>
					<div className='header-items'>
						{isManager && <p className='admin-mode'>Manager mode</p>}
						<p>{user.name}</p>
						<a className='btn-logout' href="#" onClick={onLogout}>Logout</a>
					</div>
				</header>
				<main>
					<Outlet />
				</main>
			</div>
			<div className={`notification ${notification ? 'fadeInDown' : 'dn'}`}>
				{notification}
			</div>
		</div>
	)
}

export default DefaultLayout