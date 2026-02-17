import { Routes, Route } from "react-router-dom";


import Header from "./components/Header"
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyLibrary from "./pages/MyLibrary";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import Loading from "./components/Loading";
import AnimeCard from "./components/AnimeCard";
import AnimeDetail from "./pages/AnimeDetail";
import ErrorBoundary from "./components/ErrorBoundary";
import AIchat from './components/AI/AIchat'


function App() {
  const {loading } = useAuth();
  if(loading){
    return <Loading/>
  }
  return (
    <ErrorBoundary>
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
            <Route path="/card" element={<AnimeCard/>}/>
            <Route path="/anime/:id" element={<AnimeDetail/>}/>
          </Routes>
          <AIchat/>
        </main>
        <Footer/>
      </div>
    </ErrorBoundary>
  )
}

export default App;