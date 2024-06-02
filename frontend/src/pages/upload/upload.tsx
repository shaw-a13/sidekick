import { useState } from "react";
import { Button, Card, Container, Row } from "react-bootstrap";
import NewCase from "./steps/new-case";
import {
  faTriangleExclamation,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExistingCase from "./steps/existing-case";
import { useAuth0 } from "@auth0/auth0-react";

const Upload = () => {
  const [caseSelected, setCaseSelected] = useState(false);
  const [caseType, setCaseType] = useState("");
  const { user } = useAuth0();

  const isExisting = caseType === "existing";

  return (
    <Container>
      <Row
        md={2}
        style={{ paddingTop: "8rem" }}
        className="justify-content-md-center"
      >
        {user && user["authGroups"].includes("Worker") ? (
          <Card>
            <Card.Body className="text-center">
              {!caseSelected && (
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
              )}
            </Card.Body>
            {!isExisting && caseSelected && <NewCase />}
            {isExisting && caseSelected && <ExistingCase />}
            {caseSelected && (
              <div className="text-center">
                <Button
                  className="m-2 sidekick-primary-btn"
                  id="reset"
                  onClick={() => setCaseSelected(false)}
                >
                  Reset
                  <FontAwesomeIcon className="ms-2" icon={faUndo} />
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <div className="text-center">
              <FontAwesomeIcon
                className="m-3"
                icon={faTriangleExclamation}
                color="red"
                size="3x"
              />
              <h4>
                You must be a worker to upload to the Sidekick application
              </h4>
            </div>
          </Card>
        )}
      </Row>
    </Container>
  );
};

export default Upload;
