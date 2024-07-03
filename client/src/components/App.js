import React, {useState, useEffect} from "react";


function App() {
  const [userName, setUserName] = useState("Hello")
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
    .then((data) => setUserName(data))
  }, [])
  return (
    <div>
      <h1>{userName.username}</h1>
      <button onClick={handleLogout}>Log out</button>
    </div>
  )
}
export default App;
