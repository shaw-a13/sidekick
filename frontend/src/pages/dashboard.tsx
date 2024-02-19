import React, { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";
import { CaseService } from '../services/case-service'

const Dashboard = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getAccessToken = async () => {
      const domain = "dev-loovxx4fwuzohi8k.us.auth0.com"
  
      try {
        // const accessToken = await getAccessTokenWithPopup({
        //   authorizationParams: {
        //     audience: `https://sidekick-api.com`,
        //     scope: "read:current_user",
        //   },
        // });
        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: `https://sidekick-api.com`,
              scope: "read:current_user",
            },
          });
        console.log(accessToken)
        return accessToken
      } catch (e: any) {
        console.log(e.message);
      }
    };

    const caseService = new CaseService()
    let accessToken
  
    getAccessToken().then( res => {
      accessToken = res
      if (accessToken){
        caseService.getAllCases(accessToken)
      }
    })

  }, [getAccessTokenSilently, user?.sub]);

  return (
    <Container>
      <h1>Dashboard</h1>
    </Container>
  );
  
};

export default withAuthenticationRequired(Dashboard);