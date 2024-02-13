import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";

const Dashboard = () => {

  return (
    <Container>
      <h1>Dashboard</h1>
    </Container>
  );
  
};

export default withAuthenticationRequired(Dashboard);