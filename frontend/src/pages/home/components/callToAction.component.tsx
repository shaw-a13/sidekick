import { Row, Col, Button } from "react-bootstrap";
import { CallToActionProps } from "../interfaces/callToActionProps.interface";

export const CallToAction: React.FC<CallToActionProps> = ({ loginWithRedirect }) => (
  <Row className="mt-5 mb-5" data-testid="callToActionSection">
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
