import React from "react";

function App() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const userInfo = {
    username : username,
    email : email,
    password : password
  }
  // function handleSubmit(e){
  //   e.preventDefault()
    
  //   fetch(`http://localhost:8000/creation`, {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(newCharacter)
  //   })
  //   .then((resp) => resp.json())
  //   .then((data) => addNewCharacter(data))
  // }
  // onSubmit={handleSubmit}
  return (
    <div>
      <form >
        <input type="text" value={username}  onChange={(e) => setUsername(e.target.value)}></input>
        <input type="email" value={email}  onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" value={password}  onChange={(e) => setPassword(e.target.value)}></input>
        <input type="submit" value="Submit" ></input>
      </form>
    </div>
  )
}
export default App;
