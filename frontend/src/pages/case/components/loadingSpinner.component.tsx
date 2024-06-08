import { Col, Container, Row, Spinner } from "react-bootstrap";

export const LoadingSpinner: React.FC = () => (
  <div>
    <Container className="mt-5">
      <Row>
        <Col className="text-center">
          <Spinner animation="border" />
        </Col>
      </Row>
    </Container>
  </div>
);
