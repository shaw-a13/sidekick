import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Client } from "../../../interfaces/client/client.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";
import { DocumentService } from "../../../services/document.service";
import { Case } from "../../../interfaces/case/case.interface";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const uploadDocument = async (document: any, token: string, caseId: string) => {
  const documentService = new DocumentService();

  document.getElementById("step1")!.style.pointerEvents = "auto";

  // GET request: presigned URL
  documentService.getPresignedUrl(token, caseId).then(async (res) => {
    const presignedUrl = res?.data.presignedUrl;
    const key = res?.data.key;
    console.log(presignedUrl);
    console.log(key);
    if (presignedUrl) {
      await documentService
        .uploadDocument(presignedUrl, document)
        .then(async () => {
          await documentService.triggerIngestion(
            token,
            caseId,
            key!
          ).then(async (ingeRes) => {
            console.log(`IngesRes: ${ingeRes?.data.executionArn}`)
          });
        });
    }
  });
};

const addCase = async (
  clientInfo: Client,
  caseInfo: Case,
  accessToken: string
) => {
  const clientService = new ClientService();
  const caseService = new CaseService();

  try {
    await clientService.addClient(accessToken, clientInfo);
    await caseService.addCase(accessToken, caseInfo);
  } catch (e) {
    console.log(e);
  }
};

const DocumentUploadStep = (props: {
  clientInfo?: Client;
  caseInfo?: Case;
  caseId?: string;
  accessToken: string;
  uploadFile: any;
  newCase: boolean;
  uploadFileSetter: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Card.Title>Document Upload</Card.Title>
      <Card.Text>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Please upload the file you wish to analyse</Form.Label>
          <Form.Control
            type="file"
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              props.uploadFileSetter((target.files as FileList)[0]);
              document
                .getElementById("submitCaseBtn")!
                .classList.remove("d-none");
            }}
          />
        </Form.Group>
      </Card.Text>
      <Button
        className="m-2 sidekick-primary-btn d-none"
        id="submitCaseBtn"
        onClick={() => {
          if (props.newCase)
            addCase(props.clientInfo!, props.caseInfo!, props.accessToken);
          if (props.caseInfo) {
            uploadDocument(
              props.uploadFile,
              props.accessToken,
              props.caseInfo!.SK
            );
            navigate(`../case/${props.caseInfo!.SK}`);
          } else {
            uploadDocument(props.uploadFile, props.accessToken, props.caseId!);
            // navigate(`../case/${props.caseId!}`);
          }
        }}
      >
        Submit Case
      </Button>
    </Container>
  );
};

export default DocumentUploadStep;
