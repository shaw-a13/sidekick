import { useParams } from "react-router-dom";
import { CaseService } from "../services/case.service";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Case as CaseInfo } from "../interfaces/case/case.interface";


const Case = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [caseInfo, setCaseInfo] = useState<CaseInfo>()
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);

  const caseService = new CaseService()
  const { id } = useParams();

  const getCase = async () => {
    const res = await caseService.getSingleCase(accessToken, id!)
    if (res) {
      setCaseInfo(res.data)
    }
  }

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://sidekick-api.com`,
            scope: "read:current_user",
          },
        });
        return accessToken;
      } catch (e: any) {
        console.log(e.message);
      }
    };
    getAccessToken().then(token => {setAccessToken(token!); console.log(accessToken)})
  }, [accessToken, getAccessTokenSilently]);

  return (
  <div>
    <h1>Case ID: {id}</h1>
    <div>
        {!loading && (
          <div>
            <h2>{caseInfo!.SK}</h2>
          </div>
        )}
      </div>
  </div>
);
  };
  
  export default Case;