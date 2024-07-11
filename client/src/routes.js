import SignUp from './components/Signup'
import Login from './components/Login'
import AuctionForm from './components/AuctionForm'
import AuctionCard from './components/AuctionCard'
import UserCard from './components/UserCard'
import HomePage from './components/HomePage'
const routes = [
    {
        path : "/",
        element : <HomePage />
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
        path : "/usercard",
        element : <UserCard />
    },
    {
        path : "/auction-form",
        element : <AuctionForm />
    },
    {
        path : "/auction-card/:id",
        element : <AuctionCard />
    }
    
]

export default routes