import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import "./App.css";
import "./pages/styles/common.css";
import Dashboard from "./pages/dashboard/dashboard";
import Case from "./pages/case/case";
import Upload from "./pages/upload/upload";
import Profile from "./pages/profile";
import Navigation from "./pages/navigation";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route index element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="case/:id" element={<Case />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
