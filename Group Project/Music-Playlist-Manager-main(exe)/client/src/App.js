
import './App.css';
import HomePageComponent from "./Pages/HomePage"
import EditDeleteForm from './Components/EditDeleteForm';
import SongDetails from './Pages/SongDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  

  return (
    <div className="App">
      <Router>
     <Routes>
      <Route path="/" element={<HomePageComponent/>}></Route>
       <Route path="/songs/:id" element={<SongDetails />} />
        <Route path="/edit/:id" element={<EditDeleteForm />} />
     </Routes>
     </Router>
    </div>
  );
}
export default App;
