import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { CaseDescEditForm } from "./caseEditForm.component";
import { CaseDescriptionProps } from "../interfaces/caseDescriptionProps.interface";

export const CaseDescription: React.FC<CaseDescriptionProps> = ({ caseInfo, user, caseService, clientService, historyService, accessToken }) => {
  const [editCaseDescription, setEditCaseDescription] = useState(false);

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Case Description{" "}
          <Button
            className="sidekick-primary-btn"
            disabled={caseInfo?.assignee !== user.name && !user["authGroups"].includes("Admin")}
            onClick={() => {
              setEditCaseDescription(!editCaseDescription);
            }}
          >
            Edit
          </Button>
        </Card.Title>
        <hr />
        {!editCaseDescription && <Card.Subtitle className="mb-2 text-muted">{caseInfo!.description}</Card.Subtitle>}
        {editCaseDescription && (
          <div>
            <CaseDescEditForm caseInfo={caseInfo!} caseService={caseService} clientService={clientService} historyService={historyService} accessToken={accessToken} id={caseInfo.SK} user={user} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
