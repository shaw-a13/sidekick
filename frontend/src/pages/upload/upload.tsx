import { useState } from "react";
import { Button, Card, Container, Row } from "react-bootstrap";
import NewCase from "./steps/new-case";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExistingCase from "./steps/existing-case";

const Upload = () => {
  const [caseSelected, setCaseSelected] = useState(false);
  const [caseType, setCaseType] = useState("");

  const isExisting = caseType === "existing";

  return (
    <Container>
      <Row
        md={2}
        style={{ paddingTop: "8rem" }}
        className="justify-content-md-center"
      >
        <Card>
          <Card.Body className="text-center">
            {!caseSelected && (
              <Container>
                <Card.Title>Is this a new or existing case?</Card.Title>
                <Card.Text>
                  <Button
                    className="m-2"
                    onClick={() => {
                      setCaseType("new");
                      setCaseSelected(true);
                    }}
                  >
                    New
                  </Button>
                  <Button
                    className="m-2"
                    onClick={() => {
                      setCaseType("existing");
                      setCaseSelected(true);
                    }}
                  >
                    Existing
                  </Button>
                </Card.Text>
              </Container>
            )}
          </Card.Body>
          {!isExisting && caseSelected && <NewCase />}
          {isExisting && caseSelected && <ExistingCase />}
        </Card>
      </Row>
    </Container>
  );
};

export default Upload;
