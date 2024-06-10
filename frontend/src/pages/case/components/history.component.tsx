import React from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import { HistoryProps } from "../interfaces/historyProps.interface";

export const History: React.FC<HistoryProps> = ({ history }) => (
  <Card>
    <Card.Body>
      <Card.Title>History</Card.Title>
      {history.map((history) => {
        return (
          <div>
            <hr />
            <Row>
              <Col>
                <Card.Subtitle className="mb-2 text-muted">{history.action}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{history.name}</Card.Subtitle>
              </Col>
              <Col>
                <Card.Subtitle className="mb-2">{history.timestamp}</Card.Subtitle>
              </Col>
            </Row>
          </div>
        );
      })}
    </Card.Body>
  </Card>
);
