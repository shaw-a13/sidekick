import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { CaseService } from "../../../services/case.service";
import ClientInfoStep from "./clientInfoStep";
import DocumentUploadStep from "./documentUploadStep";
import CaseInfoStep from "./caseInfoStep";
import { useAuth0 } from "@auth0/auth0-react";
import { Client } from "../../../interfaces/client/client.interface";
import { ClientService } from "../../../services/client.service";
import { Case } from "../../../interfaces/case/case.interface";

const NewCase = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState("");
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

  const [step, setStep] = useState(0);
  const initialClientFormState: Client = {
    SK: "",
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
    SK: "",
    clientId: "",
    clientName: "",
    status: "",
    description: "",
    nature: "Property",
    date: "",
    assignee: "",
  };

  const [clientInfo, setClientInfo] = useState(initialClientFormState);
  const [caseInfo, setCaseInfo] = useState(initialCaseFormState);
  const [uploadFile, setUploadFile] = useState(null);
  const steps = [
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
          clientInfo={clientInfo}
          caseInfo={caseInfo}
          uploadFile={uploadFile}
          accessToken={accessToken}
          uploadFileSetter={setUploadFile}
          newCase={true}
        />
      ),
    },
  ];

  useEffect(() => {
    getAccessToken().then((token) => {
      setAccessToken(token!);
      console.log(accessToken);
    });
  });

  return (
    <div>
      <Card.Header>
        <Button
          className="rounded-circle m-2 sidekick-primary-btn"
          id="step0"
          onClick={() => setStep(0)}
        >
          1
        </Button>
        {steps.slice(1).map((step, no) => (
          <Button
            className="rounded-circle m-2 sidekick-primary-btn"
            style={{ pointerEvents: "none" }}
            id={`step${no + 1}`}
            onClick={() => setStep(no + 1)}
          >
            {no + 2}
          </Button>
        ))}
      </Card.Header>
      <Card.Body className="text-center">{steps[step].component}</Card.Body>
    </div>
  );
};

export default NewCase;
