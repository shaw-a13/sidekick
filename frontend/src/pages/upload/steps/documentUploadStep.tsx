import {
  Button,
  Card,
  Container,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Client } from "../../../interfaces/client/client.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";
import { DocumentService } from "../../../services/document.service";
import { Case } from "../../../interfaces/case/case.interface";


const uploadDocument = async (document: any, token: string, caseId: string) => {
  const documentService = new DocumentService()
    
    // GET request: presigned URL
    documentService.getPresignedUrl(token, caseId).then(
      res => {
        const presignedUrl = res?.data.presignedUrl
        console.log(presignedUrl);
        if (presignedUrl){
          documentService.uploadDocument(presignedUrl, document).then(
            res => console.log(res)
          )
        }        
      }
    )
};

const addCase = async (clientInfo: Client, caseInfo: Case, accessToken: string) => {
  const clientService = new ClientService();
  const caseService = new CaseService();

  try {
    await clientService.addClient(accessToken, clientInfo)
    await caseService.addCase(accessToken, caseInfo)
  } catch (e) {
    console.log(e);
  }
}

const DocumentUploadStep = (props: {
  clientInfo: Client,
  caseInfo: Case,
  accessToken: string,
  uploadFile: any,
  uploadFileSetter: React.Dispatch<React.SetStateAction<any>>,
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
              document.getElementById('submitCaseBtn')!.classList.remove('d-none')
            }}
          />
        </Form.Group>
      </Card.Text>
      <Button
          className="m-2 d-none"
          id="submitCaseBtn"
          onClick={() => {
            addCase(props.clientInfo, props.caseInfo, props.accessToken)
            uploadDocument(props.uploadFile, props.accessToken, props.caseInfo.SK)
            navigate(`../case/${props.caseInfo.SK}`)
          }}>
          Submit Case
        </Button>
    </Container>
  );
};

export default DocumentUploadStep