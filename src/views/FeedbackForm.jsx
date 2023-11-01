import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import Spinner from '../components/Spinner';

function FeedbackForm({answer, create}) {
	const {user, isManager, isCanCreateFeedback, toggleCanCreateFeedback, loading, setLoading, setNotification} = useStateContext();
	
	const navigate = useNavigate();
	((create && isManager) || (create && !isCanCreateFeedback)) && navigate('/');

	const {id} = useParams();

	const [errors, setErrors] = useState(null);
	const [isSubmited, toggleIsSubmited] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [feedback, setFeedback] = useState({
		id: null,
		subject: '',
		category: 'Quality of service',
		messages: [],
		isAnswered: false,
		file: selectedFile
	});

	useEffect(() => {
		if (answer) {
			setLoading(true)
			axiosClient.get(`/feedbacks/${id}`)
			.then(({data}) => {
				data.messages = JSON.parse(data.messages);
				console.log(data.messages);
				setFeedback(data)
				setLoading(false);

			})
			.catch((e) => {
				console.log(e)
				setLoading(false);
			});
		}
	}, []);

	useEffect(() => {
		if (!isSubmited) return;
		
		if (create) {
			setLoading(true);
			axiosClient.post(`/feedbacks`, onFileUpdload())
			.then(() => {
				setNotification('Feedback was successfully created!');
				toggleCanCreateFeedback(false);
				navigate('/')
			})
			.catch(err => {
				setFeedback({...feedback, messages: []});
				if (err.response && err.response.status === 422) { 
					setErrors(err.response.data.errors);
					setLoading(false);
					toggleIsSubmited(false);
				}
			});
		}

		if (answer) {
			setLoading(true);
			axiosClient.put(`/feedbacks/${feedback.id}`, {...feedback, messages: JSON.stringify(feedback.messages)})
			.then(() => {
				setNotification('Your message has been successfully delivered!');
				navigate('/table/feedbacks')
			})
			.catch(err => {
				if (err.response && err.response.status === 422) {
					setErrors(err.response.data.errors);
					setLoading(false);
					toggleIsSubmited(false);
				}
			});
				return
		}
	}, [isSubmited]);
	
	const onSubmit = (e) => {
		e.preventDefault();
		if (feedbackMessage === '') {
			setErrors({messages: ["The messages field is required."]});
			return 
		}
		const tempMessages = JSON.parse((JSON.stringify(feedback.messages)));
		tempMessages.push({sender: isManager ? `${user.name}#manager` : user.name, message: feedbackMessage})
		setFeedback({...feedback, isAnswered: isManager, messages: tempMessages})
		toggleIsSubmited(true);
	};

	const onFileChange = e => {
		e.target.files[0] && setSelectedFile(e.target.files[0]);
    };

	const onFileUpdload = () => {
		const formData = new FormData();
		formData.append('subject', feedback.subject);
		formData.append('category', feedback.category);
		formData.append('messages', JSON.stringify(feedback.messages));
		formData.append('isAnswered', 'off');
		if (selectedFile) {
			formData.append(
				"file",
				selectedFile
			);
		}
		return formData;
	};
		// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('FeedbackForm rendered');
	});

	const FeedbackInfo = !loading && <>
			<TitleView answer={answer} feedback={feedback} isManager={isManager} />
			{answer && <FeedbackInfoView feedback={feedback} loading={loading} isSubmited={isSubmited} />}</>

  return (
	<>
		{FeedbackInfo}

		<div className="card animated fadeInDown">
			{loading ? (
				<Spinner />
			) : 
			<form onSubmit={onSubmit} encType="multipart/form-data">
				{errors && <div className='alert'>{Object.keys(errors).map(key => <p key={key}>{errors[key][0]}</p>)}</div>}
				{!id && <>
					<input onChange={e => setFeedback({...feedback, subject: e.target.value})} value={feedback.subject} name='subject' type='text' placeholder='Subject' autoFocus />
					<select onChange={e => setFeedback({...feedback, category: e.target.value})} value={user.category} name='category'>
						<option value="Quality of service">Quality of service</option>
						<option value="Customer satisfaction">Customer satisfaction</option>
						<option value="Problems and complaints">Problems and complaints</option>
						<option value="Suggestions and recommendations">Suggestions and recommendations</option>
						<option value="Infrastructure and technology">Infrastructure and technology</option>
						<option value="Communication and information">Communication and information</option>
					</select>
					<input name='file' onChange={onFileChange} type='file' placeholder='File' />
				</>}
				<textarea onChange={e => setFeedbackMessage(e.target.value)} value={feedbackMessage} name='messages' placeholder={ feedback.id && isManager ? 'Message' : 'Answer message'} rows="5"></textarea>
				<button className='btn btn-block'>Save</button>
			</form>
			}
		</div>
	</>
  )
}

const TitleView = ({answer, feedback, isManager}) => {
	let content;
	(answer) ? 
	content = (isManager) ? 
			`Answer to feedback: ${feedback.subject}` :
			`Feedback chat: ${feedback.subject}`
	: content='New feedback';

	return <h1 className='mb'>{content}</h1>
}

const FeedbackInfoView = ({feedback, loading, isSubmited }) => {
	const messages = !loading && !isSubmited && (
		feedback.messages.map((message, i) => (
			<div key={i} className={`mb-5 message ${message.sender.includes('#manager') ? 'manager' : 'client'}`}><span>{message.sender}:</span> {message.message}</div>
		))
	)
	return (
		<>
			<h4 className='mb'>Client email: {feedback.user_email}</h4>
			<h4 className='mb'>Category: {feedback.category}</h4>
			<p className='mb'>{feedback.created_at}</p>
			{feedback.file && feedback.file !== "" && 
				<a className='btn btn-add attachedFile' href={import.meta.env.VITE_BASE_URL + feedback.file.replace("public/", "storage/")} target='_blank' rel="noreferrer">Attached image</a>
			}
			<ul className='messages'>
				{messages}
			</ul>
		</>
	)
}

export default FeedbackForm;