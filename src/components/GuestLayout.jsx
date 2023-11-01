import { Navigate, Outlet } from 'react-router-dom'
import {useStateContext} from '../context/ContextProvider';
import { useEffect } from 'react';

function GuestLayout() {
	const {token} = useStateContext ();

	if (token) {
		return <Navigate to="/" />
	}
	// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('GuestLayout rendered');
	});
	return (
		<Outlet />
  )
}

export default GuestLayout