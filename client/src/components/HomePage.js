import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
    const [currentUser, setUser] = useState("")
    const [cards, setCards] = useState([])
    const navigate = useNavigate()
    useEffect(() => {  
        fetch("/usercard")
        .then((resp) => resp.json())
        .then((data) => setUser(data))
      }, [])
    useEffect(() => {  
      fetch("/auctioncards")
      .then((resp) => resp.json())
      .then((data) => {
        setCards(data)
        console.log(cards)})
    }, [])
    
    const auctionCards = cards?.map((card) => (
      <div className="col-md-3">
        <div class="card" style={{"width": "18rem"}}>
        <img src={card.image_one} class="card-img-top" alt="..."></img>
          <div class="card-body">
            <h5 class="card-title">{card.model}</h5>
            <p class="card-text">Current Bid : <span style={{ fontWeight: 'bold', color: 'green' }}>{card.reserve} </span></p>
            <a href={`/auction-card/${card.id}`} class="btn btn-primary" style={{ backgroundColor: 'black' }}>Go To Auction!</a>
          </div>
        </div>
      </div>
  ))
    function handleNav() {
      navigate('/auction-form')
    }
    function handleLogout(){
        fetch(`/logout`, {
    
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}) 
          })
          .then(response => {
            if (response.ok) {
              console.log('Logout successful');
              navigate('/login')
            } else {
              console.error('Logout failed:', response.status);
            }
          })
          .catch(error => {
            console.error('Error during logout request:', error);
          });
    }
    
    return (
        <div>
            {/* Nav bar */}
            <div className="homepageNavBar">
                <nav className="navBar">
                    <Link className="userLink" to="/usercard">
                    🏁 Welcome {currentUser.username} 🏁
                        {/* {currentUser.username} */}
                    </Link>
                    <input type='button' id="logOutBtn" className="loginButton" value='Log Out'onClick={handleLogout}></input>
                    <input type='button' id="auctionNavBtn" className="loginButton" value='Submit A Vehicle'onClick={handleNav}></input>
                </nav>
                
                <div className="homeImage"></div>
                <h1 className="auctionHeading">Auctions</h1>

            </div>
            {/* Nav Bar */}
            <div className="auctionCardSection">
              {auctionCards}
            </div>
        </div>
    )
}

export default HomePage

{/* <div className="col-md-3">
                <div class="card" style={{"width": "18rem"}}>
                  <img src="https://www.supercars.net/blog/wp-content/uploads/2021/06/pictures_chevrolet_camaro_1985_6-e1625093435397.jpg" class="card-img-top" alt="..."></img>
                  <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Current Bid : <span style={{ fontWeight: 'bold', color: 'green' }}>10000</span></p>
                    <a href="#" class="btn btn-primary" style={{ backgroundColor: 'black' }}>Go somewhere</a>
                  </div>
                </div>
              </div> */}