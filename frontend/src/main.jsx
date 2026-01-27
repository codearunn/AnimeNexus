import {BrowserRouter} from "react-router-dom";
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
          toastOptions={{
        style: {
          background: "#111",
          color: "#fff",
        },
        success: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fff",
          },
        },
      }}
      position="top-center" />
    </AuthProvider>
  </BrowserRouter>,
)
