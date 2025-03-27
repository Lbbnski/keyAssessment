import {useState} from 'react';
import {isLoggedIn} from './api/user.ts';
import Login from './pages/login.tsx';
import NodeList from './pages/nodeList.tsx';

function App() {

  const [loggedIn] = useState<boolean>(isLoggedIn)

  return (
    <>
      {loggedIn ? (<NodeList/>) : (<Login/>)}
    </>
  )
}

export default App
