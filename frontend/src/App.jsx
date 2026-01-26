import { Routes, Route } from "react-router-dom";


import Header from "./components/Header"
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyLibrary from "./pages/MyLibrary";
import Profile from "./pages/Profile"
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Browse" element={<Browse/>}/>
          <Route path="/MyLibrary" element={<MyLibrary/>}/>
          <Route path="/Profile" element={<Profile/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App;