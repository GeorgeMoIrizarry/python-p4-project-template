import React, {useState, useEffect} from "react";
import { NavLink, useNavigate } from "react-router-dom";

function UserCard() {
  const [currentUser, setUser] = useState("")
  const [spotlightImg, setImg] = useState("")
  const [bio, setBio] = useState("")
  const [profImg, setProfImg] = useState("")
  const [profStatus, setProfStatus] = useState(false)
  const [bioStatus, setBioStatus] = useState(false)
  const [spotStatus, setSpotStatus] = useState(false)
  const [bioInputStation, setBioStation] = useState(false)
  const [spotlightInputStation, setSpotStation] = useState(false)
  const [bioBtn, setBioBtn] = useState(false)
  
  const navigate = useNavigate()
  function handleNav(){
    navigate('/')
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
  useEffect(() => {  
    fetch("/usercard")
    .then((resp) => resp.json())
    .then((data) => setUser(data))
  }, [])
  function handleProf() {
    setProfStatus(!profStatus)
  }
  function handleBioSpot(clickedBtn) {
    if (clickedBtn == "bio"){
      setBioStatus(!bioStatus)
      setBioStation(!bioInputStation)  
    } else if (clickedBtn == "spotlight") {
      setSpotStatus(!spotStatus)
      setSpotStation(!spotlightInputStation)
    }
  }
  function handleProfSubmitPatch(e) {
    e.preventDefault()
    const newProfileImage = {
      profile_image : profImg,
    }
    fetch(`/usercard/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProfileImage),
    })
    .then((resp) => resp.json())
    .then((data) => setUser(data))
    }

    function handleSpotSubmitPatch(e) {
      e.preventDefault()
      const newSpotImage = {
        feature_image : spotlightImg,
      }
      fetch(`/usercard/${currentUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSpotImage),
      })
      .then((resp) => resp.json())
      .then((data) => setUser(data))
      }
  function handleBioPatch(e) {
    e.preventDefault()
    const newBio = {bio : bio}
    fetch(`/usercard/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBio),
    })
    .then((resp) => resp.json())
    .then((data) => {
      setUser(data)
      setBioStatus(!bioStatus)
      setBioStation(!bioInputStation) 
      if (bioBtn == false) {
        setBioBtn(!bioBtn)
      }
    })
    }

  let flag = 1
  function handleDelete() {
    if (flag == 1){
      alert('You Cannot Recover This Account! If You Want To Still Continue, Click Delete Once More!')
      flag++
    } else {
      fetch("/usercard", {
        method : "DELETE",
      })
      .then((resp) => {
        if (resp.ok){
          console.log("Successful")
          navigate('/sign-up')
        } else {
          alert(`Failed, Consult Admin `)
        }
      })
      
    }
  }
  return (
    <div>
      <div className="userSect">
        {/* Profile Area */}
        <img id="profileImg" src={currentUser.profile_image ? currentUser.profile_image : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"}></img>

        
        <button onClick={handleProf} className={profStatus ? "noneDisplay" : "profile" }>Change Profile Image...</button>
        <button id='discardProf' onClick={handleProf} className={profStatus ? "profileImg" : "noneDisplay"}>Discard Change...</button>
        <form onSubmit={handleProfSubmitPatch}>
          <input id="newProfImgSubmit" className={profStatus ? "profileImg" : "noneDisplay"}  value="Change Profile Image..." type="submit"></input>
          <input id="profImg" className={profStatus ? "userInput" : "noneDisplay"} required placeholder="Enter Profile Image URL..." type="text"  value={profImg}  onChange={(e) => setProfImg(e.target.value)}></input> 
          {/* add profImg to user table, make null in the beginning, null equals false, use place holder img */}
        </form>
        <h1>Welcome {currentUser.username}</h1>
        {/* Profile Area */}
        {/* if null, change h3 content */}
        {/* id={bioSpotStatus ? "noneDisplay" : "bioBtn"} */}
        {/* Bio And Spotlight Buttons */}
        <button onClick={() => handleBioSpot("bio")} id={bioInputStation ? "hideBtn" : "falseId"} style={{display : currentUser.bio ? "none" : "initial"}}className={bioStatus ? "noneDisplay" : "bioAndSpotlight"}>Add Bio...</button>
        <button  onClick={() => handleBioSpot("spotlight")} id="spotlightBtn" className={spotStatus ? "noneDisplay" : "bioAndSpotlight"}>Add Vehicle Image...</button>
        {/* Bio And Spotlight Buttons */}


        {/* Bio Area */}
        <form onSubmit={handleBioPatch}>
          <textarea id="imageOne" rows='5' cols='50' maxLength='400' required className={bioInputStation ? "bioTextArea" : "noneDisplay"} placeholder="Enter Bio..." type="text"  value={bio}  onChange={(e) => setBio(e.target.value)}></textarea>
          <input id="newBioSubmit"className={bioInputStation ? "profileImg" : "noneDisplay"} type="submit" value="Change Bio..."></input>
        </form>
        <button id="discardBio" onClick={() => handleBioSpot("bio")} className={bioInputStation ? "profileImg" : "noneDisplay"}>Discard Changes...</button>
        <div className={currentUser.bio ? "bioContainer" : "noneDisplay"} style={{display : bioInputStation ? "none" : "initial"}}>
          <p className={currentUser.bio ? "bioPara" : "noneDisplay"} >{currentUser.bio}</p>
        </div>
        <button id="editBio" onClick={() => handleBioSpot("bio")} className={bioInputStation ? "noneDisplay" : "profileImg"}>Edit Bio...</button>
        {/* className="bioContainer" */}
        {/* Bio Area */}


        {/*Image Area */}
        <form onSubmit={handleSpotSubmitPatch}>
          <input className={spotlightInputStation ? "userInput" : "noneDisplay"} placeholder="Enter Spotlight Image URL..." type="text"  value={spotlightImg}  onChange={(e) => setImg(e.target.value)}></input>
          <input id="newSpotlightSubmit"className={spotlightInputStation ? "profileImg" : "noneDisplay"} type="submit" value="Change Image..."></input>
          <button id="discardSpotlight" onClick={() => handleBioSpot("spotlight")} className={spotlightInputStation ? "profileImg" : "noneDisplay"}>Discard Changes...</button>
        </form>
        {/*Image Area */}

        
        <button className="noneDisplay" >Edit Spotlight Image</button>
        
        
        <button className="noneDisplay" >Edit Bio</button>
      </div>
      <div className="imageSect">
        <img id="userImg" src={currentUser.feature_image ? currentUser.feature_image : "https://orangemotormall.com/wp-content/themes/motors-child/assets/images/automanager_placeholders/plchldr798automanager.png"}></img>
        <input type='button' id="logOutBtn" className="loginButton" value='Log Out'onClick={handleLogout}></input>
        <input type='button' id="homeButton" className="loginButton" value='Home'onClick={handleNav}></input>
        
      </div>
      <input type='button' id="deleteButton"  value='Delete Account'onClick={handleDelete}></input>
    </div>
  )
}
export default UserCard;
// https://orangemotormall.com/wp-content/themes/motors-child/assets/images/automanager_placeholders/plchldr798automanager.png