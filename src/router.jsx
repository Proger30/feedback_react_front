import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from './views/Login';
import Signup from "./views/Signup";
import Users from "./views/Users";
import Feedback from "./views/Feedback";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import UserForm from "./views/UserForm";
import FeedbackForm from "./views/FeedbackForm";
import TableLayout from "./components/TableLayout";


const router = createBrowserRouter([
	{
		path: '/',
		element: <DefaultLayout />,
		children: [
			{
				path: '/',
				element: <Navigate to="/table/feedbacks" />
			},
			{
				path: '/feedbacks/new',
				element: <FeedbackForm key="feedbackCreate" create={true}/>
			},
			{
				path: '/feedbacks/answer/:id',
				element: <FeedbackForm key="feedbackAnswer" answer={true}/>
			},
			{
				path: '/table',
				element: <TableLayout />,
				children: [
					{
						path: 'users',
						element: <Users />
					},
					{
						path: 'feedbacks',
						element: <Feedback />
					}
				]
			},
			{
				path: '/users/new',
				element: <UserForm key="userCreate" create={true}/>
			},
			{
				path: '/users/:id',
				element: <UserForm key="userUpdate" update={true}/>
			},
			
		]
	},
	{
		path: '/',
		element: <GuestLayout />,
		children: [
			{
				path: '/login',
				element: <Login />
			},
			{
				path: '/signup',
				element: <Signup />
			},
		]
	},
	{
		path: '*',
		element: <NotFound />
	},
])

export default router;