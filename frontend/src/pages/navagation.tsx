import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav } from "react-bootstrap";
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../components/loginButton';
import LogoutButton from '../components/logoutButton';

let pages = [
  {name: 'Home', href: '/', authenticationRequired: false},
  {name: 'Upload', href: '/upload', authenticationRequired: true},
  {name: 'Dashboard', href: '/dashboard', authenticationRequired: true},
  {name: 'Profile', href: '/profile', authenticationRequired: true},
]

const Navagation = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Navbar expand="lg" style={{backgroundColor: '#3d5a80'}}>
    <Container>
      <Navbar.Brand href="/" style={{color: 'white'}}>Sidekick</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
        {isAuthenticated ? (
          pages
            .map(page => (
              <Nav.Link href={page.href} style={{color: 'white'}}>{page.name}</Nav.Link>
          ))
        ) : (
          pages
            .filter((page) => page.authenticationRequired === false)
            .map(page => (
              <Nav.Link href={page.href} style={{color: 'white'}}>{page.name}</Nav.Link>
          ))
        )}
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        {isAuthenticated ? (
          <LogoutButton/>
        ) : (
          <LoginButton/>
        )}
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
};

export default Navagation;