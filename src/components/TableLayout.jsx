import {useState, useEffect} from 'react'
import axiosClient from '../axios-client';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import PaginationBtns from '../components/PaginationBtns';
import Spinner from './Spinner';

function TableLayout() {
	
	const location = useLocation().pathname.replace('/table/', '');
	const [isDataFeedback, setIsDataFeedback] = useState(location === 'feedbacks');

	const {isManager, isCanCreateFeedback, loading, setLoading, setNotification} = useStateContext ();
	
	const [pages, setPages] = useState(null);
	const [data, setData] = useState([]);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('all');

	const onSearch = (e) => {
		setSearch(e.target.value);
	}

	const onDelete = (feedback) => {
		if (!window.confirm("Are you sure you want to delete this feedback?")) return
		setLoading(true)
		axiosClient.delete(`${location}/${feedback.id}`)
			.then(() => {
				setNotification(`${isDataFeedback ? 'Feedback' : 'User'} was successfully deleted!`);
				getData(location, false);
			});
	}

	const getData = (link=location, isResetTableData=true, isPageLink=false) => {
		isResetTableData && setData([]);
		let URL = `${link}${isPageLink ? '&' : '?'}filter=${filter}`;
		URL = search === "" ? URL : `${URL}&search=${search}`;
		axiosClient.get(URL)
		.then(({data}) => {
			setPages(data.meta);
			setData(data.data);
			setLoading(false);
		})
		.catch((err)=>{
			console.log(err)
			setLoading(false)
		});
	};

	useEffect(() => {
		setLoading(true);
		getData();
		setIsDataFeedback(location === 'feedbacks');
		// eslint-disable-next-line
	}, [location, search, filter]);

	// test render
	// eslint-disable-next-line 
	useEffect(() => {
		console.log('TableLayout rendered');
	});
  return (
	<div className='width-100'>
		<div className='list-wrapper mb'>
			<h1 className='table-title'>{location}</h1>
			{
				loading || isManager ? null : (
					isDataFeedback && 
					isCanCreateFeedback) ?
					<Link className='btn-add' to="/feedbacks/new">Add New</Link> :
					<p>You created feedback last 24 hour</p>
				}
			{!loading && !isDataFeedback && isManager && <Link className='btn-add' to="/users/new">Add New</Link>}
			
		</div>
		<input type="text" onChange={onSearch} value={search} placeholder='Search here' />
		<select name="filter" id="filter" defaultValue={filter} onChange={(e) => setFilter(e.target.value)}>
			<option value="all">All</option>
			{isDataFeedback ?
			<>
				<option value="answered">Answered feedbacks</option>
				<option value="notAnswered">Not answered feedbacks</option>
			</> :
			<>
				<option value="ROLE_MANAGER">Only managers</option>
				<option value="ROLE_CLIENT">Only clients</option>
			</>
			}
		</select>
		{loading && <Spinner />}
		<Outlet context={{data, onDelete}}/>
		<div className="page-btns-wrapper">
			{pages && <PaginationBtns pages={pages} getLinks={getData}/>}
		</div>
	</div>
  )
}

export default TableLayout;