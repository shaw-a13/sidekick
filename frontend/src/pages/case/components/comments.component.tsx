import React, { useState } from "react";
import { CommentsProps } from "../interfaces/commentsProps.interface";
import { Card, Col, Row, Button, Form, useAccordionButton } from "react-bootstrap";
import { Comment } from "../../../interfaces/comment/comment.interface";
import { CommentService } from "../../../services/comment.service";
import { CommentEditProps } from "../../../interfaces/comment/commentEditProps.interface";
import { HistoryService } from "../../../services/history.service";
import { CaseHistory } from "../../../enums/caseHistory";

const submitComment = async (commentService: CommentService, historyService: HistoryService, token: string, commentInfo: Comment, caseId: string, userId: string) => {
  const date = new Date().toISOString();
  await commentService
    .addComment(token, commentInfo, caseId)
    .then(
      async () => await historyService.addHistory(token, caseId, { SK: `${caseId}#${date}`, action: CaseHistory.COMMENT_ADDED, name: userId, timestamp: date }).then(() => window.location.reload())
    );
};

const submitCommentEdit = async (commentService: CommentService, historyService: HistoryService, token: string, commentEdits: CommentEditProps, caseId: string, timestamp: string, userId: string) => {
  const date = new Date().toISOString();
  await commentService
    .editComment(token, commentEdits, caseId, timestamp)
    .then(
      async () => await historyService.addHistory(token, caseId, { SK: `${caseId}#${date}`, action: CaseHistory.COMMENT_EDITED, name: userId, timestamp: date }).then(() => window.location.reload())
    );
};

const submitCommentDelete = async (commentService: CommentService, historyService: HistoryService, token: string, caseId: string, timestamp: string, userId: string) => {
  const date = new Date().toISOString();

  await commentService
    .deleteComment(token, caseId, timestamp)
    .then(
      async () => await historyService.addHistory(token, caseId, { SK: `${caseId}#${date}`, action: CaseHistory.COMMENT_DELETED, name: userId, timestamp: date }).then(() => window.location.reload())
    );
};

export const Comments: React.FC<CommentsProps> = ({ comments, caseId, user, commentService, historyService, accessToken }) => {
  const [addComment, setAddComment] = useState(false);
  const [newComment, setNewComment] = useState<Comment>({} as Comment);

  const [editComment, setEditComment] = useState(false);
  const [editedCommentTimestamp, setEditedCommentTimestamp] = useState("");
  const [commentEdits, setCommentEdits] = useState<CommentEditProps>({} as CommentEditProps);

  return (
    <Card data-testid="commentsSection">
      <Card.Body>
        <Card.Title>
          Comments{" "}
          <Button
            className="sidekick-primary-btn m-2"
            data-testid="addCommentButton"
            onClick={() => {
              setAddComment(!addComment);
            }}
          >
            Add
          </Button>
        </Card.Title>
        <div>
          {addComment && (
            <Form data-testid="commentForm">
              <Form.Group controlId="comment">
                <Form.Control
                  as="textarea"
                  required
                  type="text"
                  placeholder="Add new comment"
                  name="text"
                  onChange={(event) => {
                    const { name, value } = event.target;
                    const date = new Date().toISOString();
                    setNewComment({ SK: `${caseId}#${date}`, name: user.name, text: value, timestamp: date });
                  }}
                />
              </Form.Group>
              <div className="text-center">
                <Button
                  className="sidekick-primary-btn m-2"
                  onClick={() => {
                    submitComment(commentService, historyService, accessToken, newComment, caseId, user.name);
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </div>
        {editComment && (
          <Form data-testid="commentEditForm">
            <Form.Group controlId="comment">
              <Form.Control
                as="textarea"
                required
                type="text"
                placeholder="Edit comment"
                name="text"
                onChange={(event) => {
                  const { name, value } = event.target;
                  setCommentEdits({ ...commentEdits, text: value });
                }}
              />
            </Form.Group>
            <div className="text-center">
              <Button
                className="sidekick-primary-btn m-2"
                onClick={() => {
                  submitCommentEdit(commentService, historyService, accessToken, commentEdits, caseId, editedCommentTimestamp, user.name);
                }}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
        {comments
          .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
          .map((comment) => {
            console.log(Date.parse(comment.timestamp));
            const date = new Date(Date.parse(comment.timestamp));
            return (
              <div data-testid="comment">
                <hr />

                <Row>
                  <Col>
                    <Card.Subtitle className="mb-2">{comment.name}</Card.Subtitle>
                  </Col>
                  <Col>
                    <Card.Subtitle className="mb-2">
                      {date.toDateString()} | {date.toLocaleTimeString()}
                    </Card.Subtitle>
                  </Col>
                  <Col sm={2}>
                    <Card.Subtitle className="mb-2">
                      <Button
                        className="sidekick-primary-btn"
                        data-testid="editCommentButton"
                        disabled={comment.name !== user.name && !user["authGroups"].includes("Admin")}
                        onClick={() => {
                          setEditComment(!editComment);
                          setEditedCommentTimestamp(comment.timestamp);
                        }}
                      >
                        Edit
                      </Button>
                    </Card.Subtitle>
                  </Col>
                  <Col sm={2}>
                    <Card.Subtitle className="mb-2">
                      <Button
                        className="btn-danger"
                        data-testid="deleteCommentButton"
                        disabled={comment.name !== user.name && !user["authGroups"].includes("Admin")}
                        onClick={() => {
                          submitCommentDelete(commentService, historyService, accessToken, caseId, comment.timestamp, user.name);
                        }}
                      >
                        Delete
                      </Button>
                    </Card.Subtitle>
                  </Col>
                </Row>
                <Row>
                  <Card.Subtitle className="mb-2 text-muted">{comment.text}</Card.Subtitle>
                </Row>
              </div>
            );
          })}
      </Card.Body>
    </Card>
  );
};
