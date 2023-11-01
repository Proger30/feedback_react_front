import { Link, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import { useStateContext } from '../context/ContextProvider';

function Users() {

	const {data, onDelete} = useOutletContext();
	const {user} = useStateContext();
		// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('users rendered');
	});

	return (
		<div className="card table-wrapper animated fadeInDown">
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Create Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
				{data.map(userData => (
						<tr key={userData.id}>
							<th>{userData.id}</th>
							<th>{userData.name}</th>
							<th>{userData.email}</th>
							<th>{userData.role}</th>
							<th>{userData.created_at}</th>
							<th>
								<Link to={`/users/${userData.id}`} className='btn-edit'>Edit</Link>
								&nbsp;
								{user.id !== userData.id && <button onClick={() => onDelete(userData)} className='btn-delete'>Delete</button>}
							</th>
						</tr>
					))}
				</tbody>
			</table>
		</div>
  )
}

export default Users