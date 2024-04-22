import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import CaseTypeStep from "./steps/caseTypeStep";
import ClientInfoStep from "./steps/clientInfoStep";
import DocumentUploadStep from "./steps/documentUploadStep";
import CaseInfoStep from "./steps/caseInfoStep";

const Upload = () => {
  const [step, setStep] = useState(0);
  const [caseType, setCaseType] = useState("");
  console.log(caseType)
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
        </Card>
      </Row>
    </Container>
  );
};

export default Upload;
