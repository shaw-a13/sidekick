import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import Navagation from "./pages/navagation";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Authenticator } from "@aws-amplify/ui-react";
import Dashboard from "./pages/dashboard";


function App() {
  return (
        <BrowserRouter>
          <Navagation />
          <Routes>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App;
