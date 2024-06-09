import { Card, Button, Badge } from "react-bootstrap";
import { CaseEditForm } from "./caseEditForm.component";
import { CaseInfoProps } from "../interfaces/caseInfoProps.interface";
import { CaseEditProps } from "../../../interfaces/case/caseEditProps.interface";
import { CaseService } from "../../../services/case.service";
import { CaseStatus, CaseStatusStyles } from "../../../enums/caseStatus";

const assignCase = async (edit_obj: CaseEditProps, caseService: CaseService, token: string, id: string) => {
  await caseService.editCase(token, edit_obj, id!).then(() => window.location.reload());
};

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
                onClick={() => {
                  assignCase({ assignee: user.name, status: CaseStatus.ACTIVE }, caseService, accessToken, id!);
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
          <CaseEditForm caseInfo={caseInfo!} caseService={caseService} accessToken={accessToken} id={id!} caseEditInfo={caseEditInfo!} changeHandler={handleCaseEditChange} />
        </div>
      )}
    </Card.Body>
  </Card>
);
