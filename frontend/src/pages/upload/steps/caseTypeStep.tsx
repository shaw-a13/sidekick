import { Button, Card, Container } from "react-bootstrap";
import { CaseTypeStepProps } from "../interfaces/caseTypeStepProps.interface";

const CaseTypeStep = ({ caseSetter, stepSetter }: CaseTypeStepProps) => {
  const onButtonClick = (caseType: string, stepNumber: number = 0) => {
    document.getElementById("step1")!.style.pointerEvents = "auto";
    caseSetter(caseType);
    if (stepNumber) {
      stepSetter(stepNumber);
    }
  };

  return (
    <Container>
      <Card.Title>Is this a new or existing case?</Card.Title>
      <Card.Text>
        <Button className="m-2 sidekick-primary-btn" onClick={() => onButtonClick("new", 1)}>
          New
        </Button>
        <Button className="m-2 sidekick-primary-btn" onClick={() => onButtonClick("existing")}>
          Existing
        </Button>
      </Card.Text>
    </Container>
  );
};

export default CaseTypeStep;
