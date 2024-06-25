import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Client } from "../../../interfaces/client/client.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";
import { DocumentService } from "../../../services/document.service";
import { Case } from "../../../interfaces/case/case.interface";
import { useState } from "react";
import { DocumentUploadStepProps } from "../interfaces/documentUploadProps.interface";
import { HistoryService } from "../../../services/history.service";
import { CaseHistory } from "../../../enums/caseHistory";
import { useAuth0 } from "@auth0/auth0-react";

const uploadDocument = async (file: File, token: string, caseId: string) => {
  const documentService = new DocumentService();

  try {
    console.log("Uploading document");
    const res = await documentService.getPresignedUrl(token, caseId);
    const presignedUrl = res!.data.presignedUrl;
    const key = res!.data.key;
    await documentService.uploadDocument(presignedUrl, file);
    await documentService.triggerIngestion(token, caseId, key);
  } catch (error) {
    console.error(error);
  }
};

const addCase = async (clientInfo: Client, caseInfo: Case, accessToken: string) => {
  const clientService = new ClientService();
  const caseService = new CaseService();

  await clientService.addClient(accessToken, clientInfo);
  await caseService.addCase(accessToken, caseInfo);
};

const setInitialHistory = async (accessToken: string, caseId: string, user: any) => {
  const historyService = new HistoryService();
  let date = new Date().toISOString();

  await historyService.addHistory(accessToken, caseId, { SK: `${caseId}#${date}`, action: CaseHistory.OPENED, name: user!.name!, timestamp: date });

  date = new Date().toISOString();
  await historyService.addHistory(accessToken, caseId, { SK: `${caseId}#${date}`, action: CaseHistory.DOCUMENT_UPLOADED, name: user!.name!, timestamp: new Date().toISOString() });
};

const DocumentUploadStep = (props: DocumentUploadStepProps) => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const [showLoader, setShowLoader] = useState(false);

  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    props.uploadFileSetter((target.files as FileList)[0]);
    setShowSubmitButton(true);
  };

  const handleSubmit = async () => {
    console.log("Submitting case");

    if (props.newCase && props.clientInfo && props.caseInfo) {
      setShowLoader(true);
      await addCase(props.clientInfo, props.caseInfo, props.accessToken)
        .then(async () => {
          await uploadDocument(props.uploadFile!, props.accessToken, props.caseInfo!.SK);
        })
        .then(async () => await setInitialHistory(props.accessToken, props.caseInfo!.SK, user))
        .then(() =>
          setTimeout(() => {
            console.log(`Document uploaded ${props.caseInfo!.SK}`);
            navigate(`/case/${props.caseInfo!.SK}`);
          }, 2000)
        );
    } else {
      await uploadDocument(props.uploadFile!, props.accessToken, props.caseId!)
        .then(async () => await setInitialHistory(props.accessToken, props.caseId!, user))
        .then(() => {
          console.log(`Document uploaded ${props.caseId}`);
          setTimeout(() => {
            navigate(`/case/${props.caseId!}`);
          }, 2000);
        });
    }
  };

  return (
    <Container data-testid="uploadForm">
      <Card.Title>Document Upload</Card.Title>
      <Card.Text>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Please upload the file you wish to analyse</Form.Label>
          <Form.Control data-testid="fileInput" type="file" onChange={handleFileChange} />
        </Form.Group>
      </Card.Text>
      {showSubmitButton && (
        <Button className="m-2 sidekick-primary-btn" onClick={handleSubmit}>
          Submit Case
        </Button>
      )}
      <div className="text-center mt-3">{showLoader && <Spinner animation="border" />}</div>
    </Container>
  );
};

export default DocumentUploadStep;
