import { useParams } from "react-router-dom";
import axios from "axios";
import { CaseService } from "../../services/case.service";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Case as CaseInfo } from "../../interfaces/case/case.interface";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { DocumentService } from "../../services/document.service";
import { DocumentResultResponse } from "../../interfaces/document/documentResultResponse.interface";
import { CaseEditProps } from "../../interfaces/case/caseEditProps.interface";
import { UploadModal } from "./components/uploadModal.component";
import { ExtractionResultProps } from "./interfaces/extractionResultProps.interface";
import { CaseDescEditForm, CaseEditForm } from "./components/caseEditForm.component";
import { EmptyResults, ExtractionTable } from "./components/extrationTable.component";
import { DocumentViewer } from "./components/documentViewer.component";
import { LoadingSpinner } from "./components/loadingSpinner.component";
import { CaseInfo as CaseInfoComponent } from "./components/caseInfo.component";
import { UnauthorizedMessage } from "./components/unauthorisedMessage.component";

const Case = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [caseInfo, setCaseInfo] = useState<CaseInfo>();
  const [caseEditInfo, setCaseEditInfo] = useState<CaseEditProps>();

  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [docNo, setDocNo] = useState(0);
  const [docApiData, setDocApiData] = useState<DocumentResultResponse>();
  const [extractionData, setExtractionData] = useState<ExtractionResultProps[]>();
  const [documentData, setDocumentData] = useState("");
  const [uploadModal, setUploadModal] = useState(false);

  const documentService = new DocumentService();
  const { id } = useParams();
  const [editCaseDetails, setEditCaseDetails] = useState(false);
  const [editCaseDescription, setEditCaseDescription] = useState(false);

  const caseService = new CaseService();

  const handleCaseEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    const { name, value } = event.target;

    setCaseEditInfo({ ...caseEditInfo!, [name]: value });
  };

  const getCase = async (token: string) => {
    return await caseService.getSingleCase(token, id!);
  };

  const updateExtractionData = async (docNo: number) => {
    try {
      await axios.get<ExtractionResultProps[]>(docApiData!.urls[docNo].processed).then((res) => {
        setExtractionData(res.data);
        console.log(extractionData);
      });
    } catch (error) {
      setExtractionData(undefined);
    }
  };

  useEffect(() => {
    getAccessTokenSilently().then(async (token: string) => {
      setAccessToken(token!);
      await getCase(token!).then((res) => {
        setCaseInfo(res?.data);
      });
      await documentService.getDocuments(token!, id!).then(async (res) => {
        setDocApiData(res?.data);
        setDocumentData(res?.data.urls[docNo].original!);
        try {
          await axios.get<ExtractionResultProps[]>(res?.data.urls[docNo].processed!).then((res) => {
            setExtractionData(res.data);
            console.log(res.data);
          });
        } catch (error) {
          setExtractionData(undefined);
        }
      });

      setLoading(false);
    });
  }, []);

  return (
    <Container>
      {(isAuthenticated && user && user["authGroups"].includes("Worker")) || (isAuthenticated && user && user["authGroups"].length === 0 && caseInfo?.clientName === user.name) ? (
        <div style={{ paddingTop: "8rem" }}>
          <UploadModal id={id!} accessToken={accessToken} show={uploadModal} setShow={setUploadModal} />
          <div>
            {loading && <LoadingSpinner />}
            {!loading && (
              <div>
                <Container>
                  <Row className="mb-3">
                    <Col>
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
                    <Col sm={4}>
                      <CaseInfoComponent
                        caseInfo={caseInfo!}
                        user={user}
                        setEditCaseDetails={setEditCaseDetails}
                        editCaseDetails={editCaseDetails}
                        caseService={caseService}
                        accessToken={accessToken}
                        id={id!}
                        caseEditInfo={caseEditInfo!}
                        handleCaseEditChange={handleCaseEditChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Card>
                        <Card.Body>
                          <Card.Title>Document Extractions</Card.Title>
                          {extractionData && <ExtractionTable extractionData={extractionData} />}
                          {!extractionData && <EmptyResults />}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mt-3 mb-5">
                      <Card>
                        <Card.Body>
                          <Card.Title>
                            Case Description{" "}
                            <Button
                              className="sidekick-primary-btn"
                              disabled={caseInfo?.assignee !== user.name && !user["authGroups"].includes("Admin")}
                              onClick={() => {
                                setEditCaseDescription(!editCaseDescription);
                              }}
                            >
                              Edit
                            </Button>
                          </Card.Title>
                          <hr />
                          {!editCaseDescription && <Card.Subtitle className="mb-2 text-muted">{caseInfo!.description}</Card.Subtitle>}
                          {editCaseDescription && (
                            <div>
                              <CaseDescEditForm caseInfo={caseInfo!} caseService={caseService} accessToken={accessToken} id={id!} caseEditInfo={caseEditInfo!} changeHandler={handleCaseEditChange} />
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
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
