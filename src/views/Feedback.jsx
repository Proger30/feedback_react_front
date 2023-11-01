import { useEffect } from 'react';

import { Link, useOutletContext } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';

function Feedback() {
	const {data, onDelete} = useOutletContext();
	const {isManager} = useStateContext ();
		// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('Feedback rendered');
	});
  return (
	<div className="card  animated fadeInDown">
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Subject</th>
					<th>Category</th>
					{isManager && <>
						<th>Client name</th>
						<th>Client email</th>
					</>}
					<th>Created Date</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
			{data.map(feedback => (
					<tr key={feedback.id} className={(feedback.isAnswered && !isManager || !feedback.isAnswered && isManager) ? 'answered' : ''}>
						<th>{feedback.id}</th>
						<th>{feedback.subject}</th>
						<th>{feedback.category}</th>
						{isManager && <>
							<th>{feedback.user_name}</th>
							<th>{feedback.user_email}</th>
						</>
						}
						<th>{feedback.created_at}</th>
						<th>
							<Link to={`/feedbacks/answer/${feedback.id}`} className={isManager ? 'btn-add' : 'btn-edit'}>{isManager ? 'Answer' : 'Chat'}</Link>
							&nbsp;
							<button onClick={() => onDelete(feedback)} className='btn-delete'>Delete</button>
						</th>
					</tr>
				))}
			</tbody>
		</table>
	</div>
  )
}

export default Feedback;