import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom"
import router from "./router"
import { ContextProvider } from './context/ContextProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
		<ContextProvider>
			<RouterProvider router={router} />
		</ContextProvider>
)
