import React, { useState } from "react";
import { Form, Button, Badge } from "react-bootstrap";
import { CaseEditFormProps } from "../interfaces/caseEditFormProps.interface";
import { CaseEditProps } from "../../../interfaces/case/caseEditProps.interface";
import { CaseService } from "../../../services/case.service";
import { CaseStatus, CaseStatusStyles } from "../../../enums/caseStatus";
import { ClientService } from "../../../services/client.service";
import { HistoryService } from "../../../services/history.service";
import { CaseHistory } from "../../../enums/caseHistory";

const submitCaseEdit = async (
  action: CaseHistory,
  edit_obj: CaseEditProps,
  caseService: CaseService,
  clientService: ClientService,
  historyService: HistoryService,
  token: string,
  clientId: string,
  caseId: string,
  userId: string
) => {
  const date = new Date().toISOString();
  console.log(action);

  await caseService
    .editCase(token, edit_obj, caseId)
    .then(async () => {
      if (edit_obj.clientName) {
        const name = edit_obj.clientName.split(" ");
        await clientService.editClient(token, { firstName: name[0], lastName: name[1] }, clientId);
      }
    })
    .then(async () => await historyService.addHistory(token, caseId, { SK: `${caseId}#${date}`, action: action, name: userId, timestamp: date }).then(() => window.location.reload()));
};
const handleCaseEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setCaseEditInfo: any, caseEditInfo: any) => {
  console.log(event.target);
  const { name, value } = event.target;

  setCaseEditInfo({ ...caseEditInfo!, [name]: value });
};

export const CaseDescEditForm: React.FC<CaseEditFormProps> = ({ caseInfo, caseService, clientService, historyService, accessToken, id, user }) => {
  const [caseEditInfo, setCaseEditInfo] = useState<CaseEditProps>();

  return (
    <Form>
      <Form.Group controlId="formClientName">
        <Form.Control
          as="textarea"
          required
          type="text"
          placeholder=""
          name="description"
          defaultValue={caseInfo!.description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleCaseEditChange(event, setCaseEditInfo, caseEditInfo);
          }}
        />
      </Form.Group>
      <div className="text-center">
        <Button
          className="sidekick-primary-btn m-2"
          onClick={() => {
            submitCaseEdit(CaseHistory.DESCRIPTION_EDITED, caseEditInfo!, caseService, clientService, historyService, accessToken, caseInfo.clientId, id, user.name);
          }}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export const CaseEditForm: React.FC<CaseEditFormProps> = ({ caseInfo, caseService, clientService, historyService, accessToken, id, user }) => {
  const [caseEditInfo, setCaseEditInfo] = useState<CaseEditProps>();

  return (
    <Form data-testid="caseEditForm">
      <Form.Group controlId="formClientName">
        <Form.Label>Client Name</Form.Label>
        <Form.Control
          type="text"
          name="clientName"
          placeholder="Enter client name"
          defaultValue={caseInfo.clientName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleCaseEditChange(event, setCaseEditInfo, caseEditInfo);
          }}
        />
      </Form.Group>
      <Form.Group controlId="formNature">
        <Form.Label>Nature</Form.Label>
        <Form.Control
          type="text"
          name="nature"
          placeholder="Enter nature"
          defaultValue={caseInfo.nature}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleCaseEditChange(event, setCaseEditInfo, caseEditInfo);
          }}
        />
      </Form.Group>
      <Form.Group controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          defaultValue={caseInfo.date}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleCaseEditChange(event, setCaseEditInfo, caseEditInfo);
          }}
        />
      </Form.Group>
      <Form.Group controlId="formStatus">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          defaultValue={caseInfo.status}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            handleCaseEditChange(event, setCaseEditInfo, caseEditInfo);
          }}
        >
          {Object.keys(CaseStatus).map((statusItem) => (
            <option>
              <Badge bg={CaseStatusStyles[statusItem as CaseStatus].style} text="light">
                {statusItem}
              </Badge>
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="formAssignee">
        <Form.Label>Assignee</Form.Label>
        <Form.Control
          type="text"
          name="assignee"
          placeholder="Enter assignee"
          defaultValue={caseInfo.assignee}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleCaseEditChange(event, setCaseEditInfo, caseEditInfo);
          }}
        />
      </Form.Group>
      <Form.Group controlId="formClientId">
        <Form.Label>Client ID</Form.Label>
        <Form.Control
          type="text"
          name="clientId"
          placeholder="Enter client ID"
          defaultValue={caseInfo.clientId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleCaseEditChange(event, setCaseEditInfo, caseEditInfo);
          }}
        />
      </Form.Group>
      <div className="text-center">
        <Button
          
          className="sidekick-primary-btn m-2"
          onClick={() => {
            submitCaseEdit(CaseHistory.DETAILS_EDITED, caseEditInfo!, caseService, clientService, historyService, accessToken, caseInfo.clientId, id, user.name);
          }}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};
