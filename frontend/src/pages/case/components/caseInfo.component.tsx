import { Card, Button, Badge } from "react-bootstrap";
import { CaseEditForm } from "./caseEditForm.component";
import { CaseInfoProps } from "../interfaces/caseInfoProps.interface";
import { CaseEditProps } from "../../../interfaces/case/caseEditProps.interface";
import { CaseService } from "../../../services/case.service";
import { CaseStatus, CaseStatusStyles } from "../../../enums/caseStatus";
import { useState } from "react";
import { HistoryService } from "../../../services/history.service";
import { CaseHistory } from "../../../enums/caseHistory";

const assignCase = async (edit_obj: CaseEditProps, caseService: CaseService, historyService: HistoryService, token: string, id: string, userName: string) => {
  let date = new Date().toISOString();
  await caseService
    .editCase(token, edit_obj, id!)
    .then(async () => await historyService.addHistory(token, id, { SK: `${id}#${date}`, action: CaseHistory.DETAILS_EDITED, name: userName, timestamp: date }))
    .then(async () => {
      date = new Date().toISOString();
      await historyService.addHistory(token, id, { SK: `${id}#${date}`, action: CaseHistory.ASSIGNED, name: userName, timestamp: date });
    })
    .then(() => window.location.reload());
};

export const CaseInfo: React.FC<CaseInfoProps> = ({ caseInfo, user, caseService, clientService, historyService, accessToken, id }) => {
  const [editCaseDetails, setEditCaseDetails] = useState(false);

  return (
    <Card data-testid="caseInfoSection">
      <Card.Body>
        <Card.Title>
          Case Information{" "}
          <Button
            className="sidekick-primary-btn"
            disabled={caseInfo?.assignee !== user.name && !user["authGroups"].includes("Admin")}
            onClick={() => {
              setEditCaseDetails(!editCaseDetails);
            }}
          >
            Edit
          </Button>
        </Card.Title>
        <hr />
        {!editCaseDetails && (
          <div>
            <Card.Subtitle className="mb-2 text-muted">Client Name: {caseInfo!.clientName}</Card.Subtitle>
            <hr />
            <Card.Subtitle className="mb-2 text-muted">Nature: {caseInfo!.nature}</Card.Subtitle>
            <hr />
            <Card.Subtitle className="mb-2 text-muted">Date: {caseInfo!.date}</Card.Subtitle>
            <hr />
            <Card.Subtitle className="mb-2 text-muted">
              Status:{" "}
              <Badge bg={CaseStatusStyles[caseInfo!.status as CaseStatus].style} text="light">
                {caseInfo!.status}
              </Badge>
            </Card.Subtitle>
            <hr />
            <Card.Subtitle className="mb-2 text-muted">Assignee: {caseInfo!.assignee}</Card.Subtitle>
            <hr />
            <Card.Subtitle className="mb-2 text-muted">Client ID: {caseInfo!.clientId}</Card.Subtitle>
            {caseInfo.assignee === "" && (
              <div className="text-center">
                <Button
                  className="sidekick-primary-btn m-2"
                  data-testid="assignToMeBtn"
                  onClick={() => {
                    assignCase({ assignee: user.name, status: CaseStatus.ACTIVE }, caseService, historyService, accessToken, id!, user.name);
                  }}
                >
                  Assign to me
                </Button>
              </div>
            )}
          </div>
        )}
        {editCaseDetails && (
          <div>
            <CaseEditForm caseInfo={caseInfo!} caseService={caseService} clientService={clientService} historyService={historyService} accessToken={accessToken} id={id!} user={user} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
