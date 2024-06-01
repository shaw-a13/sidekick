import { useEffect, useState } from "react";
import { Button, Card, Form, Row } from "react-bootstrap";
import DocumentUploadStep from "./documentUploadStep";
import { useAuth0 } from "@auth0/auth0-react";

const ExistingCase = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState("");
  const [caseId, setCaseId] = useState("");

  const [validated, setValidated] = useState(false);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    console.log(value);
    if (value === "") {
        setValidated(false)

    } else {
        setCaseId(value);
        setValidated(true)
    }
  };

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

  const [uploadFile, setUploadFile] = useState(null);
  const steps = [
    {
      stepName: "documentUpload",
      component: (
        <DocumentUploadStep
          uploadFile={uploadFile}
          accessToken={accessToken}
          uploadFileSetter={setUploadFile}
          caseId={caseId}
          newCase={false}
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
          id="step1"
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
        <Form noValidate validated={validated}>
          <Row className="mb-1">
            <Form.Group controlId="validationCustom05" className="text-center">
              <Form.Label>Case ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a case ID"
                required
                name="caseId"
                defaultValue={caseId}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid postcode.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      {validated && (
        <Card.Body className="text-center">{steps[step].component}</Card.Body>
      )}
    </div>
  );
};

export default ExistingCase;
