import App from './components/App'
import SignUp from './components/Signup'
import Login from './components/Login'
import AuctionForm from './components/AuctionForm'
const routes = [
    {
        path : "/",
        element : <App />
    }, 
    {
        path : "/sign-up",
        element : <SignUp />
    },
    {
        path : "/login",
        element : <Login />
    },
    {
        path : "/auction-form",
        element : <AuctionForm />
    }
    
]

export default routes