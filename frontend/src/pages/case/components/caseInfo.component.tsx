import { Card, Button } from "react-bootstrap";
import { CaseEditForm } from "./caseEditForm.component";
import { CaseInfoProps } from "../interfaces/caseInfoProps.interface";

export const CaseInfo: React.FC<CaseInfoProps> = ({ caseInfo, user, setEditCaseDetails, editCaseDetails, caseService, accessToken, id, caseEditInfo, handleCaseEditChange }) => (
  <Card>
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
          <Card.Subtitle className="mb-2 text-muted">Status: {caseInfo!.status}</Card.Subtitle>
          <hr />
          <Card.Subtitle className="mb-2 text-muted">Assignee: {caseInfo!.assignee}</Card.Subtitle>
          <hr />
          <Card.Subtitle className="mb-2 text-muted">Client ID: {caseInfo!.clientId}</Card.Subtitle>
        </div>
      )}
      {editCaseDetails && (
        <div>
          <CaseEditForm caseInfo={caseInfo!} caseService={caseService} accessToken={accessToken} id={id!} caseEditInfo={caseEditInfo!} changeHandler={handleCaseEditChange} />
        </div>
      )}
    </Card.Body>
  </Card>
);
