import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import './App.css';
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';


function App() {
  return (
    <Authenticator>
      {({signOut, user}) => (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
          <p>Hey {user?.username}</p>
          <button onClick={signOut}>sign out</button>
      </BrowserRouter>
      )}
    </Authenticator>
  );
}

export default App;
