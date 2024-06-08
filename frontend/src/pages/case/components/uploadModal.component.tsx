import { useState, useRef } from "react";
import { Modal, Spinner, Button, Form } from "react-bootstrap";
import { DocumentService } from "../../../services/document.service";

const uploadDocument = async (document: any, caseId: string, accessToken: string) => {
  const documentService = new DocumentService();

  // GET request: presigned URL
  documentService.getPresignedUrl(accessToken, caseId).then(async (res) => {
    const presignedUrl = res?.data.presignedUrl;
    const key = res?.data.key;
    console.log(presignedUrl);
    console.log(key);
    if (presignedUrl) {
      await documentService.uploadDocument(presignedUrl, document).then(async () => {
        await documentService.triggerIngestion(accessToken, caseId, key!).then(async (ingeRes) => {
          console.log(`IngesRes: ${ingeRes?.data.executionArn}`);
        });
      });
    }
  });
};

export const UploadModal = ({ id, accessToken, show, setShow }: { id: string; accessToken: string; show: boolean; setShow: (prev: boolean) => void }) => {
  const [uploadFile, setUploadFile] = useState<any>();
  const [showLoader, setShowLoader] = useState(false);
  const uploadButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setUploadFile((target.files as FileList)[0]);
    uploadButtonRef!.current!.classList.remove("d-none");
  };

  const handleDocumentUpload = () => {
    uploadDocument(uploadFile, id, accessToken);
    setShowLoader(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Please upload the file you wish to analyse</Form.Label>
          <Form.Control type="file" onChange={handleFileUpload} />
        </Form.Group>
        <div className="text-center mt-3">{showLoader && <Spinner animation="border" />}</div>
        <div className="text-center mt-3">
          <Button ref={uploadButtonRef} id="submitUploadBtn" className="sidekick-primary-btn d-none" onClick={handleDocumentUpload}>
            Upload
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
