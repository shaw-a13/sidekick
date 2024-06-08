import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { UserCheck } from "./components/userCheck.component";

const Upload = () => {
  const [caseType, setCaseType] = useState("");

  const isExisting = caseType === "existing";

  return (
    <Container>
      <Row md={2} style={{ paddingTop: "8rem" }} className="justify-content-md-center">
        <UserCheck setCaseType={setCaseType} isExisting={isExisting} />
      </Row>
    </Container>
  );
};

export default Upload;
