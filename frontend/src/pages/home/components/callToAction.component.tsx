import { Row, Col, Button } from "react-bootstrap";

export const CallToAction = ({ loginWithRedirect }: { loginWithRedirect: any }) => (
  <Row className="mt-5 mb-5">
    <Col xs={4}>
      <h1>Make the switch today</h1>
    </Col>
    <Col className="mt-2">
      <Button className="sidekick-primary-btn" onClick={() => loginWithRedirect()}>
        Get started
      </Button>
    </Col>
  </Row>
);
