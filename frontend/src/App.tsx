import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login";
import "./App.css";
import "./pages/styles/common.css"
import Navagation from "./pages/navagation";
import Dashboard from "./pages/dashboard";
import Case from "./pages/case";
import Upload from "./pages/upload/upload";
import Profile from "./pages/profile";

function App() {
  return (
    <BrowserRouter>
      <Navagation />
      <Routes>
        <Route index element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="case/:id" element={<Case />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
