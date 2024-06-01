import {
  Button,
  Card,
  Container,
} from "react-bootstrap";

const CaseTypeStep = (props: {
  caseSetter: React.Dispatch<React.SetStateAction<string>>;
  stepSetter: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <Container>
      <Card.Title>Is this a new or existing case?</Card.Title>
      <Card.Text>
        <Button
          className="m-2 sidekick-primary-btn"
          onClick={() => {
            document.getElementById('step1')!.style.pointerEvents = "auto"
            props.caseSetter("new");
            props.stepSetter(1);
          }}
        >
          New
        </Button>
        <Button
          className="m-2 sidekick-primary-btn"
          onClick={() => {
            document.getElementById('step1')!.style.pointerEvents = "auto"
            props.caseSetter("existing");
            // props.stepSetter(1);
          }}
        >
          Existing
        </Button>
      </Card.Text>
    </Container>
  );
};

export default CaseTypeStep

