import React from "react";
import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button style={{backgroundColor: '#e0fbfc', color: 'black'}} onClick={() => loginWithRedirect()}>Log In</Button>;
};

export default LoginButton;