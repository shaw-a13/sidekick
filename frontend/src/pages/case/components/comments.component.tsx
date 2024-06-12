import React, { useState } from "react";
import { CommentsProps } from "../interfaces/commentsProps.interface";
import { Card, Col, Row, Button, Form, useAccordionButton } from "react-bootstrap";
import { Comment } from "../../../interfaces/comment/comment.interface";
import { CommentService } from "../../../services/comment.service";

const submitComment = async (commentService: CommentService, token: string, commentInfo: Comment, caseId: string) => {
  await commentService.addComment(token, commentInfo, caseId).then(() => window.location.reload());
};

export const Comments: React.FC<CommentsProps> = ({ comments, caseId, userId, commentService, accessToken }) => {
  const [addComment, setAddComment] = useState(false);
  const [newComment, setNewComment] = useState<Comment>({} as Comment);
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Comments{" "}
          <Button
            className="sidekick-primary-btn m-2"
            onClick={() => {
              setAddComment(!addComment);
            }}
          >
            Add
          </Button>
        </Card.Title>
        <div>
          {addComment && (
            <Form>
              <Form.Group controlId="comment">
                <Form.Control
                  as="textarea"
                  required
                  type="text"
                  placeholder=""
                  name="text"
                  onChange={(event) => {
                    const { name, value } = event.target;
                    const date = new Date().toISOString();
                    setNewComment({ SK: `${caseId}#${date}`, name: userId, text: value, timestamp: date });
                  }}
                />
              </Form.Group>
              <div className="text-center">
                <Button
                  className="sidekick-primary-btn m-2"
                  onClick={() => {
                    submitComment(commentService, accessToken, newComment, caseId);
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </div>
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
};
