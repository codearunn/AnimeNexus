import { Routes, Route } from "react-router-dom";

import Header from "./components/Header"
import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-1">
        <Home/>
      </main>
      <Footer/>
    </div>
  )
}

export default App