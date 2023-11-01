import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import Spinner from '../components/Spinner';

function UserForm({create, update}) {
	const {id} = useParams();
	const [errors, setErrors] = useState(null);

	const {loading, setLoading, setNotification} = useStateContext();

	const navigate = useNavigate();

	const [user, setUser] = useState({
		id: null,
		name: '',
		email: '',
		role: 'ROLE_CLIENT',
		password: '',
		password_confirmation: '',
	});

	useEffect(() => {
		if (id) {
			setLoading(true);
			axiosClient.get(`/users/${id}`)
			.then(({data}) => {
				setUser(data)
				setLoading(false);
			})
			.catch((e) => {
				console.log(e)
				setLoading(false);
			});
		}
	}, []);

	const onSubmit = (e) => {
		e.preventDefault();

		if (create) {
			setLoading(true);
			axiosClient.post(`/users`, user)
				.then(() => {
					setNotification('User successfully created!');
					navigate('/table/users')
				})
				.catch(err => {
					console.log(err.response)
					if (err.response && err.response.status === 422) {
						setErrors(err.response.data.errors);
						setLoading(false);}
				});
		}

		if (update) {
			setLoading(true);
			axiosClient.put(`/users/${user.id}`, user)
				.then(() => {
					setNotification('User successfully updated!');
					navigate('/table/users')
				})
				.catch(err => {
					console.log(err.response)
					if (err.response && err.response.status === 422) {
						setErrors(err.response.data.errors);
						setLoading(false);
					}
				});
		} 
	};

	// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('useForm rendered');
	});
  return (
	<>
		{update ? <h1>Update User: {user.name}</h1> : <h1>New User</h1>}

		<div className="card animated fadeInDown">
			{loading ? (
				<Spinner />
			): 
			<form onSubmit={onSubmit}>
				{
					errors && <div className='alert'>
						{Object.keys(errors).map(key => {
							return <p key={key}>{errors[key][0]}</p>
						})}
					</div>
				}
				<input onChange={e => setUser({...user, email: e.target.value})} value={user.email} name='email' type='email' placeholder='Email Address' autoFocus />
				<input onChange={e => setUser({...user, name: e.target.value})} value={user.name} name='name' type='text' placeholder='Full Name' />
				<select onChange={e => setUser({...user, role: e.target.value})} value={user.role} name='role'>
					<option value="ROLE_CLIENT">Client</option>
					<option value="ROLE_MANAGER">Manager</option>
				</select>
				<input onChange={e => setUser({...user, password: e.target.value})} value={user.password} name='password' type='password' placeholder='Password' />
				<input onChange={e => setUser({...user, password_confirmation: e.target.value})} value={user.password_confirmation} name='password_confirmation' type='password' placeholder='Confirm Password' />
				<button className='btn btn-block'>Save</button>
			</form>
			}
		</div>
	</>
  )
}

export default UserForm;