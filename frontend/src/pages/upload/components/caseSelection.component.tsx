import { Container, Card, Button } from "react-bootstrap";
import { CaseSelectionProps } from "../interfaces/caseSelectionProps.interface";

export const CaseSelection: React.FC<CaseSelectionProps> = ({ setCaseType, setCaseSelected }) => {
  return (
    <Container>
      <Card.Title>Is this a new or existing case?</Card.Title>
      <Card.Text>
        <Button
          className="m-2 sidekick-primary-btn"
          onClick={() => {
            setCaseType("new");
            setCaseSelected(true);
          }}
        >
          New
        </Button>
        <Button
          className="m-2 sidekick-primary-btn"
          onClick={() => {
            setCaseType("existing");
            setCaseSelected(true);
          }}
        >
          Existing
        </Button>
      </Card.Text>
    </Container>
  );
};
