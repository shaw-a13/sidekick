import { useParams } from "react-router-dom";
import { CaseService } from "../services/case.service";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Case as CaseInfo } from "../interfaces/case/case.interface";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
  Form,
} from "react-bootstrap";
import { DocumentService } from "../services/document.service";
import axios from "axios";
import { DocumentResultResponse } from "../interfaces/document/documentResultResponse.interface";
import { CaseEditProps } from "../interfaces/case/caseEditProps.interface";
interface ExtractionResult {
  key: string;
  locations: {
    fileName: string;
    key: {};
    pageNumber: number;
    value: {};
  };
  score: number;
  source: string;
  value: string;
}

const Case = () => {
  const handleCaseEditChange = (event: any) => {
    console.log(event.target);
    const { name, value } = event.target;

    setCaseEditInfo({ ...caseEditInfo!, [name]: value });
  };

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [caseInfo, setCaseInfo] = useState<CaseInfo>();
  const [caseEditInfo, setCaseEditInfo] = useState<CaseEditProps>();
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [docNo, setDocNo] = useState(0);
  const [docApiData, setDocApiData] = useState<DocumentResultResponse>();
  const [extractionData, setExtractionData] = useState<ExtractionResult[]>();
  const [documentData, setDocumentData] = useState("");

  const documentService = new DocumentService();
  const { id } = useParams();
  const [editCaseDetails, setEditCaseDetails] = useState(false);
  const [editCaseDescription, setEditCaseDescription] = useState(false);

  const getAccessToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://sidekick-api.com`,
          scope: "read:current_user",
        },
      });
      return accessToken;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const caseService = new CaseService();

  const submitCaseEdit = (edit_obj: CaseEditProps) => {
    console.log(edit_obj);
    getAccessToken().then(async (token) => {
      await caseService
        .editCase(token!, edit_obj, id!)
        .then(() => window.location.reload());
    });
  };

  const getCase = async (token: string) => {
    return await caseService.getSingleCase(token, id!);
  };

  let results: ExtractionResult;

  const updateExtractionData = async (docNo: number) => {
    await axios
      .get<ExtractionResult[]>(docApiData!.urls[docNo].processed)
      .then((res) => {
        setExtractionData(res.data);
        console.log(extractionData);
      });
  };

  useEffect(() => {
    getAccessToken().then(async (token) => {
      await getCase(token!).then((res) => {
        console.log(res?.data);
        setCaseInfo(res?.data);
      });
      await documentService.getDocuments(token!, id!).then(async (res) => {
        console.log(res);
        setDocApiData(res?.data);
        setDocumentData(res?.data.urls[docNo].original!);
        await axios
          .get<ExtractionResult[]>(res?.data.urls[docNo].processed!)
          .then((res) => {
            setExtractionData(res.data);
            console.log(res.data);
          });
      });

      setLoading(false);
    });
  }, []);

  return (
    <div style={{ paddingTop: "8rem" }}>
      <div>
        {loading && (
          <div>
            <Container className="mt-5">
              <Row>
                <Col className="text-center">
                  <Spinner animation="border" />
                </Col>
              </Row>
            </Container>
          </div>
        )}
        {!loading && (
          <div>
            <Container>
              <Row className="mb-3">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        Case Documents{" "}
                        <Button
                          style={{ backgroundColor: "#CF7650", border: "none" }}
                          onClick={() => {
                            setEditCaseDetails(!editCaseDetails);
                          }}
                        >
                          Upload
                        </Button>
                      </Card.Title>
                      <hr />
                      <div className="mb-2">
                        {docApiData!.urls.map((doc, index) => (
                          <Button
                            className="rounded-circle m-2"
                            style={{
                              backgroundColor: "#CF7650",
                              border: "none",
                            }}
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
                        <iframe
                          title="pdf-viewer"
                          src={documentData}
                          width="700"
                          height="600"
                        ></iframe>
                      </Card.Subtitle>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        Case Information{" "}
                        <Button
                          style={{ backgroundColor: "#CF7650", border: "none" }}
                          onClick={() => {
                            setEditCaseDetails(!editCaseDetails);
                          }}
                        >
                          Edit
                        </Button>
                      </Card.Title>
                      <hr />
                      {!editCaseDetails && (
                        <div>
                          <Card.Subtitle className="mb-2 text-muted">
                            Client Name: {caseInfo!.clientName}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Nature: {caseInfo!.nature}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Date: {caseInfo!.date}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Status: {caseInfo!.status}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Assignee: {caseInfo!.assignee}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Client ID: {caseInfo!.clientId}
                          </Card.Subtitle>
                        </div>
                      )}
                      {editCaseDetails && (
                        <div>
                          <Form>
                            <Form.Group controlId="formClientName">
                              <Form.Label>Client Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="clientName"
                                placeholder="Enter client name"
                                defaultValue={caseInfo!.clientName}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formNature">
                              <Form.Label>Nature</Form.Label>
                              <Form.Control
                                type="text"
                                name="nature"
                                placeholder="Enter nature"
                                defaultValue={caseInfo!.nature}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formDate">
                              <Form.Label>Date</Form.Label>
                              <Form.Control
                                type="date"
                                name="date"
                                defaultValue={caseInfo!.date}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formStatus">
                              <Form.Label>Status</Form.Label>
                              <Form.Control
                                type="text"
                                name="status"
                                placeholder="Enter status"
                                defaultValue={caseInfo!.status}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formAssignee">
                              <Form.Label>Assignee</Form.Label>
                              <Form.Control
                                type="text"
                                name="assignee"
                                placeholder="Enter assignee"
                                defaultValue={caseInfo!.assignee}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formClientId">
                              <Form.Label>Client ID</Form.Label>
                              <Form.Control
                                type="text"
                                name="clientId"
                                placeholder="Enter client ID"
                                defaultValue={caseInfo!.clientId}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <div className="text-center">
                              <Button
                                className="m-2"
                                style={{
                                  backgroundColor: "#CF7650",
                                  border: "none",
                                }}
                                onClick={() => {
                                  submitCaseEdit(caseEditInfo!);
                                }}
                              >
                                Submit
                              </Button>
                            </div>
                          </Form>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Document Extractions</Card.Title>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Page Number</th>
                            <th>Score</th>
                            <th>Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractionData!.map((result: ExtractionResult) => (
                            <tr>
                              <td>{result.key}</td>
                              <td>{result.value}</td>
                              <td>{result.locations.pageNumber}</td>
                              <td>{result.score}</td>
                              <td>{result.source}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
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
                          style={{ backgroundColor: "#CF7650", border: "none" }}
                          onClick={() => {
                            setEditCaseDescription(!editCaseDescription);
                          }}
                        >
                          Edit
                        </Button>
                      </Card.Title>
                      <hr />
                      {!editCaseDescription && (
                        <Card.Subtitle className="mb-2 text-muted">
                          {caseInfo!.description}
                        </Card.Subtitle>
                      )}
                      {editCaseDescription && (
                        <div>
                          <Form>
                            <Form.Group controlId="formClientName">
                              <Form.Control
                                as="textarea"
                                required
                                type="text"
                                placeholder=""
                                name="description"
                                defaultValue={caseInfo!.description}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <div className="text-center">
                              <Button
                                className="m-2"
                                style={{
                                  backgroundColor: "#CF7650",
                                  border: "none",
                                }}
                                onClick={() => {
                                  submitCaseEdit(caseEditInfo!);
                                }}
                              >
                                Submit
                              </Button>
                            </div>
                          </Form>
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
  );
};

export default Case;
