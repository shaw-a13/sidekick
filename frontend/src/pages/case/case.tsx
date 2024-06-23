import { useParams } from "react-router-dom";
import axios from "axios";
import { CaseService } from "../../services/case.service";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Case as CaseInfo } from "../../interfaces/case/case.interface";
import { Card, Col, Container, Row } from "react-bootstrap";
import { DocumentService } from "../../services/document.service";
import { DocumentResultResponse } from "../../interfaces/document/documentResultResponse.interface";
import { UploadModal } from "./components/uploadModal.component";
import { ExtractionResultProps } from "./interfaces/extractionResultProps.interface";
import { EmptyResults, ExtractionTable } from "./components/extrationTable.component";
import { DocumentViewer } from "./components/documentViewer.component";
import { LoadingSpinner } from "./components/loadingSpinner.component";
import { UnauthorizedMessage } from "./components/unauthorisedMessage.component";
import { CommentService } from "../../services/comment.service";
import { Comment } from "../../interfaces/comment/comment.interface";
import { Comments } from "./components/comments.component";
import { HistoryService } from "../../services/history.service";
import { History as HistoryProps } from "../../interfaces/history/history.interface";
import { History } from "./components/history.component";
import { Client } from "../../interfaces/client/client.interface";
import { ClientService } from "../../services/client.service";
import { CaseDescription } from "./components/caseDescription.component";
import { CaseInfoPaginator } from "./components/caseInfoPaginator";

const Case = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [caseInfo, setCaseInfo] = useState<CaseInfo>();
  const [clientInfo, setClientInfo] = useState<Client>();
  const [comments, setComments] = useState<Comment[]>();
  const [history, setHistory] = useState<HistoryProps[]>();

  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [docNo, setDocNo] = useState(0);
  const [docApiData, setDocApiData] = useState<DocumentResultResponse>();
  const [extractionData, setExtractionData] = useState<ExtractionResultProps[]>();
  const [documentData, setDocumentData] = useState("");
  const [uploadModal, setUploadModal] = useState(false);

  const documentService = new DocumentService();
  const { id } = useParams();

  const caseService = new CaseService();
  const clientService = new ClientService();
  const commentService = new CommentService();
  const historyService = new HistoryService();

  const getComments = async (token: string) => {
    return await commentService.getAllComments(token, id!);
  };

  const getHistory = async (token: string) => {
    return await historyService.getAllHistory(token, id!);
  };

  const getClientInfo = async (token: string, clientId: string) => {
    return await clientService.getSingleClient(token, clientId);
  };

  const getCase = async (token: string) => {
    return await caseService.getSingleCase(token, id!);
  };

  const updateExtractionData = async (docNo: number) => {
    try {
      await documentService.getDocumentExtractionResult(docApiData!.urls[docNo].processed).then((res) => {
        setExtractionData(res!.data);
        console.log(extractionData);
      });
    } catch (error) {
      setExtractionData(undefined);
    }
  };

  useEffect(() => {
    getAccessTokenSilently().then(async (token: string) => {
      setAccessToken(token!);
      await getCase(token!).then(async (res) => {
        setCaseInfo(res!.data);
        if (res)
          await getClientInfo(token!, res?.data.clientId).then((res) => {
            setClientInfo(res?.data);
          });
      });
      await documentService.getDocuments(token!, id!).then(async (res) => {
        setDocApiData(res!.data);
        setDocumentData(res!.data.urls[docNo].original!);
        try {
          await documentService.getDocumentExtractionResult(res!.data.urls[docNo].processed!).then((res) => {
            setExtractionData(res!.data);
            console.log(res!.data);
          });
        } catch (error) {
          setExtractionData(undefined);
        }
      });
      await getComments(token!).then((res) => {
        setComments(res?.data);
      });
      await getHistory(token!).then((res) => {
        setHistory(res?.data);
      });

      setLoading(false);
    });
  }, []);

  return (
    <Container>
      {(isAuthenticated && user && user["authGroups"].includes("Worker")) || (isAuthenticated && user && user["authGroups"].length === 0 && caseInfo?.clientName === user.name) ? (
        <div style={{ paddingTop: "8rem" }}>
          <UploadModal historyService={historyService} id={id!} accessToken={accessToken} show={uploadModal} setShow={setUploadModal} user={user} />
          <div>
            {loading && <LoadingSpinner />}
            {!loading && (
              <div>
                <Container>
                  <Row className="mb-3">
                    <Col sm={7}>
                      <DocumentViewer
                        caseInfo={caseInfo!}
                        user={user}
                        docApiData={docApiData!}
                        setUploadModal={setUploadModal}
                        updateExtractionData={updateExtractionData}
                        setDocumentData={setDocumentData}
                        setDocNo={setDocNo}
                        documentData={documentData}
                      />
                    </Col>
                    <Col>
                      <CaseInfoPaginator
                        caseInfo={caseInfo!}
                        user={user}
                        caseService={caseService}
                        clientService={clientService}
                        historyService={historyService}
                        accessToken={accessToken}
                        clientInfo={clientInfo!}
                      />
                      {history && <History history={history} />}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Card data-testid="documentExtractions">
                        <Card.Body>
                          <Card.Title>Document Extractions</Card.Title>
                          {extractionData && <ExtractionTable extractionData={extractionData} />}
                          {!extractionData && <EmptyResults />}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={6}>
                      <CaseDescription caseInfo={caseInfo!} user={user!} caseService={caseService} clientService={clientService} historyService={historyService} accessToken={accessToken} />
                    </Col>
                    <Col sm={6}>{comments && <Comments comments={comments} caseId={id!} user={user!} commentService={commentService} historyService={historyService} accessToken={accessToken} />}</Col>
                  </Row>
                  <Row className="mt-3 mb-3"></Row>
                </Container>
              </div>
            )}
          </div>
        </div>
      ) : isAuthenticated && user && user["authGroups"].length === 0 && !loading && caseInfo && caseInfo.clientName !== user.name ? (
        <UnauthorizedMessage message="You must be a worker to view cases not relating to yourself" />
      ) : (
        <UnauthorizedMessage message="You must be authenticated to view cases" />
      )}
    </Container>
  );
};

export default Case;
