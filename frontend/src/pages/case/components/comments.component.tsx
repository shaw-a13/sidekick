import React from "react";
import { CommentsProps } from "../interfaces/commentsProps.interface";
import { Card, Col, Row, Button } from "react-bootstrap";

export const Comments: React.FC<CommentsProps> = ({ comments }) => (
  <Card>
    <Card.Body>
      <Card.Title>
        Comments <Button className="sidekick-primary-btn m-2">Add</Button>
      </Card.Title>
      {comments.map((comment) => {
        return (
          <div>
            <hr />
            <Row>
              <Col>
                <Card.Subtitle className="mb-2">{comment.name}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{comment.text}</Card.Subtitle>
              </Col>
              <Col>
                <Card.Subtitle className="mb-2">{comment.timestamp}</Card.Subtitle>
              </Col>
              <Col sm={2}>
                <Card.Subtitle className="mb-2">
                  <Button className="sidekick-primary-btn">Edit</Button>
                </Card.Subtitle>
              </Col>
            </Row>
          </div>
        );
      })}
    </Card.Body>
  </Card>
);
