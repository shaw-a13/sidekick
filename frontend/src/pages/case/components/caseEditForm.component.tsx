import React, { useState } from "react";
import { Form, Button, Badge } from "react-bootstrap";
import { CaseEditFormProps } from "../interfaces/caseEditFormProps.interface";
import { CaseEditProps } from "../../../interfaces/case/caseEditProps.interface";
import { CaseService } from "../../../services/case.service";
import { CaseStatus, CaseStatusStyles } from "../../../enums/caseStatus";
import { ClientService } from "../../../services/client.service";

const submitCaseEdit = async (edit_obj: CaseEditProps, caseService: CaseService, clientService: ClientService, token: string, clientId: string, caseId: string) => {
  await caseService.editCase(token, edit_obj, caseId).then(async () => {
    if (edit_obj.clientName) {
      const name = edit_obj.clientName.split(" ");
      await clientService.editClient(token, { firstName: name[0], lastName: name[1] }, clientId).then(() => window.location.reload());
    }
  });
};

export const CaseDescEditForm: React.FC<CaseEditFormProps> = ({ caseInfo, caseService, clientService, accessToken, id, caseEditInfo, changeHandler }) => {
  return (
    <Form>
      <Form.Group controlId="formClientName">
        <Form.Control as="textarea" required type="text" placeholder="" name="description" defaultValue={caseInfo!.description} onChange={changeHandler} />
      </Form.Group>
      <div className="text-center">
        <Button
          className="sidekick-primary-btn m-2"
          onClick={() => {
            submitCaseEdit(caseEditInfo, caseService, clientService, accessToken, caseInfo.clientId, id);
          }}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export const CaseEditForm: React.FC<CaseEditFormProps> = ({ caseInfo, caseService, clientService, accessToken, id, caseEditInfo, changeHandler }) => {
  return (
    <Form>
      <Form.Group controlId="formClientName">
        <Form.Label>Client Name</Form.Label>
        <Form.Control type="text" name="clientName" placeholder="Enter client name" defaultValue={caseInfo.clientName} onChange={changeHandler} />
      </Form.Group>
      <Form.Group controlId="formNature">
        <Form.Label>Nature</Form.Label>
        <Form.Control type="text" name="nature" placeholder="Enter nature" defaultValue={caseInfo.nature} onChange={changeHandler} />
      </Form.Group>
      <Form.Group controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" name="date" defaultValue={caseInfo.date} onChange={changeHandler} />
      </Form.Group>
      <Form.Group controlId="formStatus">
        <Form.Label>Status</Form.Label>
        <Form.Select name="status" defaultValue={caseInfo.status} onChange={changeHandler}>
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
        <Form.Control type="text" name="assignee" placeholder="Enter assignee" defaultValue={caseInfo.assignee} onChange={changeHandler} />
      </Form.Group>
      <Form.Group controlId="formClientId">
        <Form.Label>Client ID</Form.Label>
        <Form.Control type="text" name="clientId" placeholder="Enter client ID" defaultValue={caseInfo.clientId} onChange={changeHandler} />
      </Form.Group>
      <div className="text-center">
        <Button
          className="sidekick-primary-btn m-2"
          onClick={() => {
            submitCaseEdit(caseEditInfo, caseService, clientService, accessToken, caseInfo.clientId, id);
          }}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};
