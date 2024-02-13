import { Container } from "react-bootstrap";
import LoginButton from "../components/loginButton";
import LogoutButton from "../components/logoutButton";
import Profile from "../components/profile";

const Home = () => {
    return <Container> 
      <LoginButton />
      <LogoutButton />
      <Profile />
    </Container>;
  };
  
  export default Home;