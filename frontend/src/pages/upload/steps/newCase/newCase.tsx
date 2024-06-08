import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { CaseService } from "../../../../services/case.service";
import ClientInfoStep from "../clientInfoStep";
import DocumentUploadStep from "../documentUploadStep";
import CaseInfoStep from "./caseInfoStep";
import { useAuth0 } from "@auth0/auth0-react";
import { Client } from "../../../../interfaces/client/client.interface";
import { ClientService } from "../../../../services/client.service";
import { Case } from "../../../../interfaces/case/case.interface";
import { StepButton } from "./components/stepButton.component";

// Initial state for a client form
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

// Initial state for a case form
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

const NewCase = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState("");

  const [step, setStep] = useState(0);
  const setStepCallback = useCallback((step: number) => setStep(step), []);

  const [clientInfo, setClientInfo] = useState(initialClientFormState);
  const [caseInfo, setCaseInfo] = useState(initialCaseFormState);
  const [uploadFile, setUploadFile] = useState(null);
  const steps = useMemo(
    () => [
      {
        stepName: "clientInfo",
        component: <ClientInfoStep stepSetter={setStepCallback} clientInfo={clientInfo} clientInfoSetter={setClientInfo} />,
      },
      {
        stepName: "caseInfo",
        component: (
          <CaseInfoStep stepSetter={setStepCallback} clientId={clientInfo.SK} clientName={`${clientInfo.firstName} ${clientInfo.lastName}`} caseInfo={caseInfo} caseInfoSetter={setCaseInfo} />
        ),
      },
      {
        stepName: "documentUpload",
        component: <DocumentUploadStep clientInfo={clientInfo} caseInfo={caseInfo} uploadFile={uploadFile} accessToken={accessToken} uploadFileSetter={setUploadFile} newCase={true} />,
      },
    ],
    [clientInfo, caseInfo, uploadFile, accessToken]
  );

  useEffect(() => {
    getAccessTokenSilently().then((token: string) => {
      setAccessToken(token!);
    });
  }, [getAccessTokenSilently]);

  return (
    <div>
      <Card.Header>
        {steps.map((_, index) => (
          <StepButton key={index} onClick={() => setStepCallback(index)} stepNo={index} />
        ))}
      </Card.Header>
      <Card.Body className="text-center">{steps[step].component}</Card.Body>
    </div>
  );
};

export default NewCase;
