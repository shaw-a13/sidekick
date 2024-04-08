import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import './App.css';
import Navagation from "./pages/navagation";
import Dashboard from "./pages/dashboard";
import Case from "./pages/case";


function App() {
  return (
        <BrowserRouter>
          <Navagation />
          <Routes>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="case/:id" element={<Case />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App;
