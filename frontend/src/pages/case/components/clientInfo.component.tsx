import React from "react";
import { CommentsProps } from "../interfaces/commentsProps.interface";
import { Card, Col, Row, Button } from "react-bootstrap";
import { ClientInfoProps } from "../interfaces/clientInfoProps.interface";
import { ClientEditForm } from "./clientEditForm.component";

export const ClientInfo: React.FC<ClientInfoProps> = ({ clientInfo, editClientInfo, setEditClientInfo, caseService, clientService, accessToken, caseId, clientEditInfo, changeHandler }) => (
  <Card>
    <Card.Body>
      <Card.Title>
        Client Information{" "}
        <Button
          className="sidekick-primary-btn"
          onClick={() => {
            setEditClientInfo(!editClientInfo);
          }}
        >
          Edit
        </Button>
      </Card.Title>
      <hr />
      {!editClientInfo && (
        <div>
          <Row>
            <Col>
              <Card.Subtitle className="mb-2 text-muted">
                Client Name: {clientInfo.firstName} {clientInfo.lastName}
              </Card.Subtitle>
              <hr />
              <Card.Subtitle className="mb-2 text-muted">Address Line 1: {clientInfo.addressLine1}</Card.Subtitle>
              <hr />
              <Card.Subtitle className="mb-2 text-muted">Address Line 2: {clientInfo.addressLine2}</Card.Subtitle>
              <hr />
              <Card.Subtitle className="mb-2 text-muted">City: {clientInfo.city}</Card.Subtitle>
              <hr />
              <Card.Subtitle className="mb-2 text-muted">County: {clientInfo.county}</Card.Subtitle>
              <hr />
              <Card.Subtitle className="mb-2 text-muted">Postcode: {clientInfo.postcode}</Card.Subtitle>
              <hr />
              <Card.Subtitle className="mb-2 text-muted">Email: {clientInfo.email}</Card.Subtitle>
              <hr />
              <Card.Subtitle className="mb-2 text-muted">Phone Number: {clientInfo.phoneNumber}</Card.Subtitle>
            </Col>
          </Row>
        </div>
      )}
      {editClientInfo && (
        <ClientEditForm
          clientInfo={clientInfo}
          caseService={caseService}
          clientService={clientService}
          accessToken={accessToken}
          clientId={clientInfo.SK}
          caseId={caseId}
          clientEditInfo={clientEditInfo}
          changeHandler={changeHandler}
        />
      )}
    </Card.Body>
  </Card>
);
