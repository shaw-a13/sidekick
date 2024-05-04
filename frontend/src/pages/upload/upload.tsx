import { useEffect, useState } from "react";
import { Button, Card, Container, Row } from "react-bootstrap";
import { CaseService } from "../../services/case.service";
import CaseTypeStep from "./steps/caseTypeStep";
import ClientInfoStep from "./steps/clientInfoStep";
import DocumentUploadStep from "./steps/documentUploadStep";
import CaseInfoStep from "./steps/caseInfoStep";
import { useAuth0 } from "@auth0/auth0-react";
import { Client } from "../../interfaces/client/client.interface";
import { ClientService } from "../../services/client.service";
import { Case } from "../../interfaces/case/case.interface";

const Upload = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState('');
  const caseService = new CaseService();
  const clientService = new ClientService();

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

  const addCase = async (clientInfo: Client, caseInfo: any) => {
        try {
          await clientService.addClient(accessToken, clientInfo).then((res) => {
            if (res) {
              console.log(res)            }
          });
          await caseService.addCase(accessToken, caseInfo)
        } catch (e) {
          console.log(e);
        }
  }

  const [step, setStep] = useState(0);
  const [caseType, setCaseType] = useState("");
  const initialClientFormState: Client = {
    SK: '',
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    county: "",
    city: "",
    phoneNumber: "",
    email: "",
  };

  const initialCaseFormState: Case = {
    SK: '',
    clientId: "",
    clientName: "",
    status: "",
    description: "",
    nature: "Property",
    date: "",
  };

  const [clientInfo, setClientInfo] = useState(initialClientFormState);
  const [caseInfo, setCaseInfo] = useState(initialCaseFormState);
  const [uploadFile, setUploadFile] = useState(null);
  const steps = [
    {
      stepName: "caseType",
      component: <CaseTypeStep caseSetter={setCaseType} stepSetter={setStep} />,
    },
    {
      stepName: "clientInfo",
      component: (
        <ClientInfoStep
          stepSetter={setStep}
          clientInfo={clientInfo}
          clientInfoSetter={setClientInfo}
        />
      ),
    },
    {
      stepName: "caseInfo",
      component: (
        <CaseInfoStep
          stepSetter={setStep}
          clientId={clientInfo.SK}
          clientName={`${clientInfo.firstName} ${clientInfo.lastName}`}
          caseInfo={caseInfo}
          caseInfoSetter={setCaseInfo}
        />
      ),
    },
    {
      stepName: "documentUpload",
      component: (
        <DocumentUploadStep
          uploadFile={uploadFile}
          uploadFileSetter={setUploadFile}
          token={accessToken}
        />
      ),
    },
  ];
  useEffect(() => {
    getAccessToken().then(token => setAccessToken(token!))
  });

  return (
    <Container>
      <Row md={2} className="justify-content-md-center pt-5">
        <Card>
          <Card.Header>
            <Button className="rounded-circle m-2" onClick={() => setStep(0)}>
              1
            </Button>
            <Button className="rounded-circle m-2" onClick={() => setStep(1)}>
              2
            </Button>
            <Button className="rounded-circle m-2" onClick={() => setStep(2)}>
              3
            </Button>
            <Button className="rounded-circle m-2" onClick={() => setStep(3)}>
              4
            </Button>
          </Card.Header>
          <Card.Body className="text-center">{steps[step].component}</Card.Body>
          <Button
            className="m-2"
            onClick={() => {
              addCase(clientInfo, caseInfo);
            }}
          >
            Upload
          </Button>
        </Card>
      </Row>
    </Container>
  );
};

export default Upload;
