import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";
import { ClientEditFormProps } from "../interfaces/clientEditFormProps.interface";
import { ClientEditProps } from "../../../interfaces/client/clientEditProps.interface";
import { Client } from "../../../interfaces/client/client.interface";
import { HistoryService } from "../../../services/history.service";
import { CaseHistory } from "../../../enums/caseHistory";

const submitClientEdit = async (
  edit_obj: ClientEditProps,
  clientInfo: Client,
  caseService: CaseService,
  clientService: ClientService,
  historyService: HistoryService,
  token: string,
  userId: string,
  caseId: string
) => {
  const date = new Date().toISOString();
  console.log(edit_obj);
  await clientService
    .editClient(token, edit_obj, clientInfo.SK)
    .then(async () => {
      if (edit_obj.firstName && edit_obj.lastName) {
        const name = edit_obj.firstName + " " + edit_obj.lastName;
        await caseService.editCase(token, { clientName: name }, caseId);
      } else if (edit_obj.firstName) {
        const name = edit_obj.firstName + " " + clientInfo.lastName;
        await caseService.editCase(token, { clientName: name }, caseId);
      } else if (edit_obj.lastName) {
        const name = clientInfo.firstName + " " + edit_obj.lastName;
        await caseService.editCase(token, { clientName: name }, caseId);
      }
    })
    .then(
      async () => await historyService.addHistory(token, caseId, { SK: `${caseId}#${date}`, action: CaseHistory.CLIENT_EDITED, name: userId, timestamp: date }).then(() => window.location.reload())
    );
};

export const ClientEditForm: React.FC<ClientEditFormProps> = ({ clientInfo, caseService, clientService, historyService, accessToken, caseId, user }) => {
  const [clientEditInfo, setClientEditInfo] = useState<ClientEditProps>();

  const handleClientEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    const { name, value } = event.target;

    setClientEditInfo({ ...clientEditInfo!, [name]: value });
  };

  return (
    <Form>
      <Form.Group controlId="formFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" name="firstName" placeholder="Enter first name" defaultValue={clientInfo.firstName} onChange={handleClientEditChange} />
      </Form.Group>
      <Form.Group controlId="formLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" name="lastName" placeholder="Enter last name" defaultValue={clientInfo.lastName} onChange={handleClientEditChange} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Address Line 1</Form.Label>
        <Form.Control type="text" name="addressLine1" placeholder="Enter address line 1" defaultValue={clientInfo.addressLine1} onChange={handleClientEditChange} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Address Line 2</Form.Label>
        <Form.Control type="text" name="addressLine2" placeholder="Enter address line 2" defaultValue={clientInfo.addressLine2} onChange={handleClientEditChange} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>City</Form.Label>
        <Form.Control type="text" name="city" placeholder="Enter city" defaultValue={clientInfo.city} onChange={handleClientEditChange} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>County</Form.Label>
        <Form.Control type="text" name="county" placeholder="Enter county" defaultValue={clientInfo.county} onChange={handleClientEditChange} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Postcode</Form.Label>
        <Form.Control type="text" name="postcode" placeholder="Enter postcode" defaultValue={clientInfo.postcode} onChange={handleClientEditChange} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" defaultValue={clientInfo.email} onChange={handleClientEditChange} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control type="tel" name="phoneNumber" placeholder="Enter phone number" defaultValue={clientInfo.phoneNumber} onChange={handleClientEditChange} />
      </Form.Group>

      <div className="text-center">
        <Button
          className="sidekick-primary-btn m-2"
          onClick={() => {
            submitClientEdit(clientEditInfo!, clientInfo, caseService, clientService, historyService, accessToken, user.name, caseId);
          }}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};
