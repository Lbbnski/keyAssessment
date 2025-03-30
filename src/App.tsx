import Login from './pages/login.tsx';
import NodeList from './pages/nodeList.tsx';
import {Route, Routes} from 'react-router-dom';
import Header from './components/layout/header.tsx';

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<NodeList/>}/>
      </Routes>
    </>
  );
}

export default App;
