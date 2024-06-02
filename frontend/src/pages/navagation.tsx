import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/loginButton";
import LogoutButton from "../components/logoutButton";
import logo from "../img/logos/png/logo-no-background.png";
import { Link } from "react-router-dom";

let pages = [
  {
    name: "Home",
    href: "/",
    authenticationRequired: false,
    workerRequired: false,
    adminRequired: false,
  },
  {
    name: "Upload",
    href: "/upload",
    authenticationRequired: true,
    workerRequired: true,
    adminRequired: false,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    authenticationRequired: true,
    workerRequired: false,
    adminRequired: false,
  },
  {
    name: "Profile",
    href: "/profile",
    authenticationRequired: true,
    workerRequired: true,
    adminRequired: true,
  },
];

const Navagation = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    <Navbar
      variant="dark"
      expand="lg"
      fixed="top"
      className="shadow-lg"
      style={{ backgroundColor: "#162836" }}
    >
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            width={"150"}
            src={logo}
            className="d-inline-block align-top m-2"
          />{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" color="#CF7650">
          <Nav className="me-auto">
            {isAuthenticated &&
            user &&
            user["authGroups"].includes("Admin", "Worker")
              ? pages.map((page) => (
                  <Link
                    to={page.href}
                    style={{
                      color: "#CF7650",
                      textDecoration: "none",
                      margin: 20,
                    }}
                  >
                    {page.name}
                  </Link>
                ))
              : isAuthenticated && user && user["authGroups"].includes("Worker")
                ? pages
                    .filter((page) => page.adminRequired === false)
                    .map((page) => (
                      <Link
                        to={page.href}
                        style={{
                          color: "#CF7650",
                          textDecoration: "none",
                          marginTop: 20,
                          marginRight: 20,
                        }}
                      >
                        <p>{page.name}</p>
                      </Link>
                    ))
                : isAuthenticated && user && user["authGroups"].length === 0
                  ? pages
                      .filter((page) => page.adminRequired === false)
                      .filter((page) => page.workerRequired === false)
                      .map((page) => (
                        <Link
                          to={page.href}
                          style={{
                            color: "#CF7650",
                            textDecoration: "none",
                            marginTop: 20,
                            marginRight: 20,
                          }}
                        >
                          <p>{page.name}</p>
                        </Link>
                      ))
                  : pages
                      .filter((page) => page.authenticationRequired === false)
                      .map((page) => (
                        <Link
                          to={page.href}
                          style={{
                            color: "#CF7650",
                            textDecoration: "none",
                            marginTop: 15,
                          }}
                        >
                          <p>{page.name}</p>
                        </Link>
                      ))}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navagation;
