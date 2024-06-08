import { Card, Button } from "react-bootstrap";
import { DocumentViewerProps } from "../interfaces/documentViewerProps.interface";

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ caseInfo, user, docApiData, setUploadModal, updateExtractionData, setDocumentData, setDocNo, documentData }) => (
  <Card>
    <Card.Body>
      <Card.Title>
        Case Documents{" "}
        <Button
          className="sidekick-primary-btn"
          disabled={caseInfo?.assignee !== user.name && caseInfo?.clientName !== user.name && !user["authGroups"].includes("Admin")}
          onClick={() => {
            setUploadModal(true);
          }}
        >
          Upload
        </Button>
      </Card.Title>
      <hr />
      <div className="mb-2">
        {docApiData!.urls.map((doc: any, index: number) => (
          <Button
            className="sidekick-primary-btn rounded-circle m-2"
            onClick={() => {
              updateExtractionData(index);
              setDocumentData(docApiData!.urls[index].original);
              setDocNo(index);
            }}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      <Card.Subtitle className="mb-2 text-muted">
        <iframe title="pdf-viewer" src={documentData} width="700" height="600"></iframe>
      </Card.Subtitle>
    </Card.Body>
  </Card>
);
