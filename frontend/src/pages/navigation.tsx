import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/loginButton";
import LogoutButton from "../components/logoutButton";
import logo from "../img/logos/png/logo-no-background.png";
import { Link } from "react-router-dom";

const pages = [
  {
    id: 1,
    name: "Home",
    href: "/",
    authenticationRequired: false,
    workerRequired: false,
    adminRequired: false,
  },
  {
    id: 2,
    name: "Upload",
    href: "/upload",
    authenticationRequired: true,
    workerRequired: true,
    adminRequired: false,
  },
  {
    id: 3,
    name: "Dashboard",
    href: "/dashboard",
    authenticationRequired: true,
    workerRequired: false,
    adminRequired: false,
  },
  {
    id: 4,
    name: "Profile",
    href: "/profile",
    authenticationRequired: true,
    workerRequired: false,
    adminRequired: false,
  },
];

const linkStyle = {
  color: "#CF7650",
  textDecoration: "none",
  marginTop: 20,
  marginRight: 20,
};

const Navigation = () => {
  const { user, isAuthenticated } = useAuth0();

  const userHasRole = (role: string) => user && user["authGroups"].includes(role);

  const renderLinks = (filterFunc: (page: any) => boolean) => {
    return pages.filter(filterFunc).map(({ name, href }) => (
      <Link data-testid="navlink" key={name} to={href} style={linkStyle}>
        <p>{name}</p>
      </Link>
    ));
  };

  const getLinks = () => {
    if (isAuthenticated) {
      if (userHasRole("Admin")) {
        return renderLinks(() => true);
      } else if (userHasRole("Worker")) {
        return renderLinks((page) => !page.adminRequired);
      } else if (user && user["authGroups"].length === 0) {
        return renderLinks((page) => !page.adminRequired && !page.workerRequired);
      }
    }
    return renderLinks((page) => !page.authenticationRequired);
  };

  return (
    <Navbar data-testid="navbar" variant="dark" expand="lg" fixed="top" className="shadow-lg" style={{ backgroundColor: "#090F15" }}>
      <Container>
        <Navbar.Brand href="/">
          <img data-testid="logo" alt="Sidekick logo" aria-label="Sidekick" width={"150"} src={logo} className="d-inline-block align-top m-2" />{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" color="#CF7650">
          <Nav data-testid="navLinks" className="me-auto">
            {getLinks()}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated && <p style={{ color: "#CF7650", margin: 20 }}>Hello, {user!.name}</p>}
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
