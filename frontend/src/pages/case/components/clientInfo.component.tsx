import React, { useState } from "react";
import { ClientInfoProps } from "../interfaces/clientInfoProps.interface";
import { ClientEditForm } from "./clientEditForm.component";
import { Card, Button, Row, Col } from "react-bootstrap";

export const ClientInfo: React.FC<ClientInfoProps> = ({ clientInfo, caseService, clientService, historyService, accessToken, caseId, assignee, user }) => {
  const [editClientInfo, setEditClientInfo] = useState(false);
  return (
    <Card data-testid="clientInfoSection">
      <Card.Body>
        <Card.Title>
          Client Information{" "}
          <Button
            className="sidekick-primary-btn"
            disabled={assignee !== user.name && !user["authGroups"].includes("Admin")}
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
          <ClientEditForm clientInfo={clientInfo} caseService={caseService} clientService={clientService} historyService={historyService} accessToken={accessToken} user={user} caseId={caseId} />
        )}
      </Card.Body>
    </Card>
  );
};
