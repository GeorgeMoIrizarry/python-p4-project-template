import React, {useState, useEffect} from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

function AuctionCard() {
    const [img, setImg] = useState(0)
    const [bid, setBidValue] = useState(500)
    const [post, setPost] = useState(false)
    const [auction, setAuction] = useState("")
    const [currentUser, setUser] = useState("")
    const [bids, setBids] = useState([])
    const [comment, setComment] = useState("")
    const [commentHis, setCommentHis] = useState([])
    const [commentRef, setCommentRef] = useState("")
    const navigate = useNavigate()
    const params = useParams()
    const auctionDataid = params.id
    useEffect(() => {  
        fetch("/usercard")
        .then((resp) => resp.json())
        .then((data) => setUser(data))
      }, [auction])
    useEffect(() => { 
        fetch(`/auction-card/${auctionDataid}`)
        .then((resp) => resp.json())
        .then((data) => {
            setAuction(data)
        })
      }, [auctionDataid])
      useEffect(() => { 
        fetch(`/bids/${auctionDataid}`)
        .then((resp) => resp.json())
        .then((data) => {
            setBids(data)

        })
      }, [])
      useEffect(() => { 
        fetch(`/comments/${auctionDataid}`)
        .then((resp) => resp.json())
        .then((data) => {
            setCommentHis(data)

        })
      }, [commentRef])
    
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

    function handleNav(){
        navigate('/')
    }

    function handleDiscard(btn) {
        if (btn == "discard") {
            setPost(!post)
        } else if (btn == "post") {
            const newComment = {
                user_id : currentUser.id,
                auction_id :auction.id,
                body : comment
            }
            fetch(`/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newComment)
            })
            .then((resp) => resp.json())
            .then((data) => setCommentRef(data))
        }
    }
    const bidHistory = bids?.map((bid) => (
        <div>
            <h3 className="pastBids">$ {bid.amount} made by {bid.user.username}</h3>
            <br></br>
        </div>
        
    ))
    const commentHistory = commentHis?.map((comment) => (
        <div class="comment">
            <h3 id="commentName">{comment.user.username}</h3>
            <p className="commentBody">{comment.body}</p>
        </div>
    ))
    const decrementBidValue = () => {
        if (bid > 0) {
          setBidValue(prevBidValue => prevBidValue - 500);
        }
      };
    const submitBid = () => {
        const newReserve = {
            reserve : bid + auction.reserve,
          }
        const oldReserve = {
            user_id : currentUser.id,
            auction_id :auction.id,
            amount : bid
          }
        if (bid == 0) {
            return alert("Bid must be above 0!")
        }
        fetch(`/bids`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(oldReserve)
            })
        fetch(`/auction-card/${auctionDataid}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReserve),
        })
          .then((resp) => resp.json())
          .then((data) => setAuction(data))
        console.log("Bid value submitted:", bid);
    };
    
    const incrementBidValue = () => {
        setBidValue(prevBidValue => prevBidValue + 500);
    };
    const previousImage = () => {
        setImg((prevIndex) => prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1);
      };
    
    const nextImage = () => {
        setImg((prevIndex) => (prevIndex + 1) % imageArray.length);
    };
    const imageArray = [`${auction.image_one}`, `${auction.image_two}`, `${auction.image_three}`, `${auction.image_four}`, `${auction.image_five}`]
    
    return (
        <div className="auctionCard">
            {/* Vehicle info */}
            <div className="vehicleInfoSection">
                <div className="auctionImageContainer">
                    <img className="auctionImage" src={imageArray[img]}></img>
                    <input type='button' id="logOutBtn" className="loginButton" value='Log Out'onClick={handleLogout}></input>
                    <input type='button' id="homeButton" className="loginButton" value='Home'onClick={handleNav}></input>
                </div>
                <p className="imagePara">Image {img + 1}</p>
                <input type='button' id="previousImg" className="imgAucButton" value='<< Previous Image...'onClick={previousImage}></input>
                <input type='button' id="nextImg" className="imgAucButton" value='Next Image... >>'onClick={nextImage}></input>
                <div className="vehicleDetailContainer">
                    <h2 className="vehicleDetails">Brand:</h2>
                    <h3 className="vehicleDetails">{auction.brand}</h3>
                    <h2 className="vehicleDetails">Model</h2>
                    <h3 className="vehicleDetails">{auction.model}</h3>
                    <h2 className="vehicleDetails">Drivetrain</h2>
                    <h3 className="vehicleDetails">{auction.drivetrain}</h3>
                    <h2 className="vehicleDetails">Transmission</h2>
                    <h3 className="vehicleDetails">{auction.transmission}</h3>
                </div>
            </div>
            {/* Vehicle info */}
            {/* Bidding */}
            <div className="userBiddingSection">
                <button id="decrement" className="bidBtn" onClick={decrementBidValue}>-</button>
                <input className="biddingInput" type="number" value={bid} readOnly />
                <button id="increment" className="bidBtn" onClick={incrementBidValue}>+</button>
                <button className="subBidBtn" onClick={submitBid}>Submit</button>
                <h1>Current Bid:</h1>
                <h3 className="currentBid">$ {auction.reserve}</h3>
                <h1>Bidding History:</h1>
                {bidHistory}
                
            </div>
            {/* Bidding */}
            {/* Comment Section */}
            <div className="commentSection">
                <div className="commentSectHeading">
                    <h1 className="commentHeading">Comment Section:</h1>
                    <textarea id="commentTextArea" className={post ? "bioTextArea" : "noneDisplay"} rows='3' cols='20' maxLength='200' required value={comment}  onChange={(e) => setComment(e.target.value)} placeholder="Enter Comment..."></textarea>
                    <button id="discardComment" onClick={() => handleDiscard("discard")} className={post ? "commentBtns" : "noneDisplay"}>Discard...</button>
                    <button id="addComment" onClick={() => handleDiscard("discard")} className={post ? "noneDisplay" : "commentBtns"}>Add Comment...</button>
                    <button id="postComment" onClick={() => handleDiscard("post")} className={post ? "commentBtns" : "noneDisplay"}>Submit...</button>
                </div>
                <div className="commentsContainer">
                    {commentHistory}
                </div>
            </div>
            {/* Comment Section */}
            
        </div>
    )
}

export default AuctionCard