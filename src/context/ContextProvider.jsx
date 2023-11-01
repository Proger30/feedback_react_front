import { createContext, useContext, useState } from "react";

const StateContext = createContext({
	user: null,
	token: null,
	isManager: false,
	isCanCreateFeedback: true,
	loading: true,
	notification: null,
	setUser: () => {},
	setToken: () => {},
	setIsManager: () => {},
	setLoading: () => {},
	toggleCanCreateFeedback: () => {},
	setNotification: () => {},
});

 
export const ContextProvider = ({children}) => {
	const [user, setUser] = useState({});
	const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
	const [isManager, setIsManager] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isCanCreateFeedback, toggleCanCreateFeedback] = useState(true);
	const [notification, _setNotification] = useState('');

	const setNotification = (message) => {
		_setNotification(message);
		setTimeout(() => {
			_setNotification('');
		}, 5000);
	};

	const setToken = (token) => {
		_setToken(token);

		token ? localStorage.setItem('ACCESS_TOKEN', token) : localStorage.removeItem('ACCESS_TOKEN');
	}

	return (
		<StateContext.Provider value={{user, token, isManager, loading, isCanCreateFeedback, setUser, setToken, setIsManager, setLoading, toggleCanCreateFeedback, notification, setNotification}}>
			{children}
		</StateContext.Provider>
	)
};

export const useStateContext = () => useContext(StateContext);