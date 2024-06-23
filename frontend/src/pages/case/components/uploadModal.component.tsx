import { useState, useRef } from "react";
import { Modal, Spinner, Button, Form } from "react-bootstrap";
import { DocumentService } from "../../../services/document.service";
import { HistoryService } from "../../../services/history.service";
import { CaseHistory } from "../../../enums/caseHistory";

const uploadDocument = async (document: any, caseId: string, accessToken: string, historyService: HistoryService, user: any) => {
  const documentService = new DocumentService();

  documentService.getPresignedUrl(accessToken, caseId).then(async (res) => {
    const presignedUrl = res!.data.presignedUrl;
    const key = res!.data.key;
    console.log(presignedUrl);
    console.log(key);
    await documentService.uploadDocument(presignedUrl, document).then(async () => {
      await documentService.triggerIngestion(accessToken, caseId, key!).then(async () =>
        historyService.addHistory(accessToken, caseId, {
          SK: `${caseId}#${new Date().toISOString()}`,
          action: CaseHistory.DOCUMENT_UPLOADED,
          name: user!.name!,
          timestamp: new Date().toISOString(),
        })
      );
    });
  });
};

export const UploadModal = ({
  historyService,
  id,
  accessToken,
  show,
  setShow,
  user,
}: {
  historyService: HistoryService;
  id: string;
  accessToken: string;
  show: boolean;
  setShow: (prev: boolean) => void;
  user: any;
}) => {
  const [uploadFile, setUploadFile] = useState<any>();
  const [showLoader, setShowLoader] = useState(false);
  const uploadButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setUploadFile((target.files as FileList)[0]);
    uploadButtonRef!.current!.classList.remove("d-none");
  };

  const handleDocumentUpload = (historyService: HistoryService, user: any) => {
    console.log("Showl 1" + showLoader);
    uploadDocument(uploadFile, id, accessToken, historyService, user).then(() => {
      setShowLoader(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} data-testid="documentUploadModal">
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Please upload the file you wish to analyse</Form.Label>
          <Form.Control data-testid="fileInput" type="file" onChange={handleFileUpload} />
        </Form.Group>
        {showLoader && (
          <div data-testid="spinner" className="text-center mt-3">
            <Spinner className="text-center mt-3" animation="border" />
          </div>
        )}
        <div className="text-center mt-3">
          <Button data-testid="uploadButton" ref={uploadButtonRef} id="submitUploadBtn" className="sidekick-primary-btn d-none" onClick={() => handleDocumentUpload(historyService, user)}>
            Upload
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
