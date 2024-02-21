import React, { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";
import { CaseService, CaseRecord } from "../services/case-service";
import { AxiosResponse } from "axios";

const Dashboard = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://sidekick-api.com`,
            scope: "read:current_user",
          },
        });
        console.log(accessToken);
        return accessToken;
      } catch (e: any) {
        console.log(e.message);
      }
    };

    const caseService = new CaseService();
    let accessToken;

    getAccessToken().then(async (res) => {
      accessToken = res;
      if (accessToken) {
        setLoading(true);
        try {
          await caseService.getAllCases(accessToken).then((res) => {
            if (res) {
              console.log(res)
              setCases(res.data)
            }
          });
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      }
    });
  }, [getAccessTokenSilently, user?.sub]);

  return (
    <Container>
      <div>
        {loading && <div>Loading</div>}
        {!loading && (
          <div>
            <h2>Doing stuff with data</h2>
            {cases.map((caseRecord) => (
              <h1>{caseRecord.customerName}</h1>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default withAuthenticationRequired(Dashboard);
