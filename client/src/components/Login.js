import React, {useState} from "react";
import {NavLink, useNavigate} from 'react-router-dom'

function Login() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const userInfo = {
        username : username,
        email : email,
        password : password
    }
    function handleSubmit(e){
        e.preventDefault()
    
        fetch(`/login`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(userInfo)
      })
      .then((resp) => {
          if (!resp.ok) {
              throw new Error("Unauthorized");
          }
          return resp.json();
      })
      .then((data) => {
          console.log(data);
          navigate('/');
      })
      .catch((error) => {
          console.error(error);
          alert("Profile Does Not Exist, Enter Correct Credentials Or Sign Up")
      });
        
    }



    // function handleLogout(){
    //     fetch(`/logout`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({}) 
    //       })
    //       .then(response => {
    //         if (response.ok) {
    //           console.log('Logout successful');
    //         } else {
    //           console.error('Logout failed:', response.status);
    //         }
    //       })
    //       .catch(error => {
    //         console.error('Error during logout request:', error);
    //       });
    // }
    return (
        <div className="loginBg">
          <div className="loginContainer">
            <div className="formContainer">
              <form onSubmit={handleSubmit}>
                <h1>   L  o  g  i  n</h1>
                <label className="label">Enter Username:</label>
                <input type="text" className="formInput" value={username}  onChange={(e) => setUsername(e.target.value)} required></input>
                <div className="underline"></div>
                <label className="label">Enter Email:</label>
                <input type="text" className="formInput" value={email}  onChange={(e) => setEmail(e.target.value)} required></input>
                <div className="underline"></div>
                <label className="label">Enter Password:</label>
                <input type="password" className="formInput" value={password}  onChange={(e) => setPassword(e.target.value)} required></input>
                <div className="underline"></div>
                <input className="loginButton" type="submit" value="Login" ></input>
              </form>
              {/* <button onClick={handleLogout}>Log out</button> */}
              <nav id="sidebar">
                <h2>Not Registered? <NavLink to="/sign-up" className="logLink">Sign Up Now!</NavLink></h2>
              </nav>
            </div>
          </div>
        </div>
    )
}

export default Login