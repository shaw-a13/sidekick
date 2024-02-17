import { Container } from "react-bootstrap";
import LoginButton from "../components/loginButton";
import LogoutButton from "../components/logoutButton";
import Profile from "../components/profile";

const Home = () => {
    return <Container className="m-5"> 
      <Profile />
    </Container>;
  };
  
  export default Home;