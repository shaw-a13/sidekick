import { useEffect, useMemo, useState } from "react";
import { Button, Card, Form, Row } from "react-bootstrap";
import DocumentUploadStep from "../documentUploadStep";
import { useAuth0 } from "@auth0/auth0-react";
import { StepButton } from "./components/stepButton.component";

const ExistingCase = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState("");
  const [caseId, setCaseId] = useState("");
  const [validated, setValidated] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [step, setStep] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setValidated(false);
    } else {
      setCaseId(value);
      setValidated(true);
    }
  };

  const steps = useMemo(
    () => [
      {
        stepName: "documentUpload",
        component: <DocumentUploadStep uploadFile={uploadFile} accessToken={accessToken} uploadFileSetter={setUploadFile} caseId={caseId} newCase={false} />,
      },
    ],
    [uploadFile, accessToken, caseId]
  );

  useEffect(() => {
    getAccessTokenSilently().then((token: string) => {
      setAccessToken(token!);
    });
  }, [getAccessTokenSilently]);

  return (
    <div>
      <Card.Header>
        <StepButton stepNumber={0} onClick={() => setStep(0)} />
        {steps.slice(1).map((step, index) => (
          <StepButton stepNumber={index + 1} onClick={() => setStep(index + 1)} />
        ))}
      </Card.Header>
      <Form noValidate validated={validated} data-testid="existingCaseForm">
        <Row className="mb-1">
          <Form.Group controlId="validationCustom05" className="text-center">
            <Form.Label>Case ID</Form.Label>
            <Form.Control type="text" placeholder="Enter a case ID" required name="caseId" value={caseId} onChange={handleInputChange} />
            <Form.Control.Feedback type="invalid">Please provide a valid case id</Form.Control.Feedback>
          </Form.Group>
        </Row>
      </Form>
      {validated && <Card.Body className="text-center">{steps[step].component}</Card.Body>}
    </div>
  );
};

export default ExistingCase;
