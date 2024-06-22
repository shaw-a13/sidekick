import { faArrowRight, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Case } from "../../../../interfaces/case/case.interface";
import { v4 as uuid } from "uuid";
import { CaseStatus } from "../../../../enums/caseStatus";
import { CaseFormFields } from "./components/caseFormFields.component";
import { CaseInfoStepProps } from "./interfaces/caseInfoStepProps.interface";

const CaseInfoStep: React.FC<CaseInfoStepProps> = (props) => {
  const [validated, setValidated] = useState(false);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    props.caseInfoSetter((prevCaseInfo) => ({ ...prevCaseInfo, [name]: value }));
  };

  const validateForm = (form: any) => {
    setValidated(true);
    return form.checkValidity() === true;
  };

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (validateForm(form)) {
      console.log("valid");
      props.caseInfoSetter((prevCaseInfo) => ({
        ...prevCaseInfo,
        clientName: props.clientName,
        clientId: props.clientId,
        status: CaseStatus.OPEN,
        SK: uuid(),
      }));
      props.stepSetter(2);
    }
    console.log("Values are", props.caseInfo);
  };

  return (
    <Container data-testid="caseInformationForm">
      <Card.Title>Case Information</Card.Title>
      <Card.Text>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <CaseFormFields caseInfo={props.caseInfo} handleInputChange={handleInputChange} />
          <Button data-testid="nextButton" type="submit" className="sidekick-primary-btn">
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form>
      </Card.Text>
    </Container>
  );
};

export default CaseInfoStep;
