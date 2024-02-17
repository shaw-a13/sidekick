import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav } from "react-bootstrap";
import { useAuth0 } from '@auth0/auth0-react';

let pages = [
  {name: 'Home', href: '/', authenticationRequired: false},
  {name: 'Dashboard', href: '/dashboard', authenticationRequired: true},
  {name: 'Profile', href: '/profile', authenticationRequired: true},
]

const Navagation = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
        {isAuthenticated ? (
          pages
            .map(page => (
              <Nav.Link>{page.name}</Nav.Link>
          ))
        ) : (
          pages
            .filter((page) => page.authenticationRequired === false)
            .map(page => (
              <Nav.Link>{page.name}</Nav.Link>
          ))
        )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
};

export default Navagation;