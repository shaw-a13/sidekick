import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { CaseService, CaseRecord } from "../../services/case-service";
import CaseTypeStep from "./steps/caseTypeStep";
import ClientInfoStep from "./steps/clientInfoStep";
import DocumentUploadStep from "./steps/documentUploadStep";
import CaseInfoStep from "./steps/caseInfoStep";
import { useAuth0 } from "@auth0/auth0-react";
import { Client } from "./interfaces/client";
import { ClientService } from "../../services/client-service";

const Upload = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const clientService = new ClientService();

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
  
  const addCase = (clientInfo: Client, caseInfo: any) => {
    getAccessToken().then(async (res) => {
      const accessToken = res;
      if (accessToken) {
        try {
          await clientService.addClient(accessToken, clientInfo).then((res) => {
            if (res) {
              console.log(res)
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
  
  }

  const [step, setStep] = useState(0);
  const [caseType, setCaseType] = useState("");
  console.log(caseType);
  const initialClientFormState = {
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

  const initialCaseFormState = {
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
        />
      ),
    },
  ];
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
