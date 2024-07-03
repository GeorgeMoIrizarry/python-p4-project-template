import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";

function SignUp() {
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
    
        fetch(`/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            navigate('/login')
        })
    }
  
    return (
        <div className="signUpBg">
          <div className="loginContainer">
            <div className="formContainer">
              <form onSubmit={handleSubmit}>
                <h1>   S  i  g  n  U p</h1>
                <label className="label">Enter Username:</label>
                <input type="text" className="formInput" value={username}  onChange={(e) => setUsername(e.target.value)} required></input>
                <div className="underline"></div>
                <label className="label">Enter Email:</label>
                <input type="text" className="formInput" value={email}  onChange={(e) => setEmail(e.target.value)} required></input>
                <div className="underline"></div>
                <label className="label">Enter Password:</label>
                <input type="password" className="formInput" value={password}  onChange={(e) => setPassword(e.target.value)} required></input>
                <div className="underline"></div>
                <input className="loginButton" type="submit" value="Sign Up" ></input>
              </form>
              {/* <button onClick={handleLogout}>Log out</button> */}
              <nav id="sidebar">
                <h2>Have An Account? <NavLink to="/login" className="logLink">Log In Now!</NavLink>!</h2>
              </nav>
            </div>
          </div>
        </div>
    )
}

export default SignUp