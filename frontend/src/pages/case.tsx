import { useParams } from "react-router-dom";
import { CaseService } from "../services/case.service";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { CaseDynamo } from "../interfaces/case/caseDynamo.interface";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

interface ExtractionResult {
  key: string;
  locations: {
    filename: string;
    key: {};
    pageNumber: number;
    value: {};
  };
  score: number;
  source: string;
  value: string;
}

const Case = () => {
  let results = require("./processedResults.json");

  console.log(results);

  const mockDocs = [
    "https://www.clickdimensions.com/links/TestPDFfile.pdf",
    "https://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf",
    "https://www.orimi.com/pdf-test.pdf",
  ];
  const mockRes: CaseDynamo[] = [
    {
      clientName: {
        S: "Aaron Shaw",
      },
      nature: {
        S: "Property",
      },
      date: {
        S: "2024-05-07",
      },
      status: {
        S: "OPEN",
      },
      assignee: {
        S: "",
      },
      SK: {
        S: "e4c94afb-da5d-4d21-a64a-ccd0f694c7a5",
      },
      description: {
        S: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      },
      clientId: {
        S: "d5de31e6-0044-481e-bb6c-d1b3d8c8b386",
      },
    },
  ];
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [caseInfo, setCaseInfo] = useState<CaseDynamo>();
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [docNo, setDocNo] = useState(0);

  const caseService = new CaseService();
  const { id } = useParams();

  const getCase = async (token: string) => {
    return await caseService.getSingleCase(token, id!);
  };

  useEffect(() => {
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
    // getAccessToken().then(token => {getCase(token!).then(res => {setLoading(true); setCaseInfo(res?.data[0]); setLoading(false)});})
    getAccessToken().then((token) => {
      setLoading(true);
      setCaseInfo(mockRes[0]);
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
            <Container className="mt-5">
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Case Documents</Card.Title>
                      <hr />
                      <div className="mb-2">
                        {mockDocs.map((doc, index) => (
                          <Button
                            className="rounded-circle m-2"
                            onClick={() => setDocNo(index)}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>
                      <Card.Subtitle className="mb-2 text-muted">
                        <iframe
                          title="pdf-viewer"
                          src={mockDocs[docNo]}
                          width="700"
                          height="600"
                        ></iframe>
                      </Card.Subtitle>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Case Information</Card.Title>
                      <hr />
                      <Card.Subtitle className="mb-2 text-muted">
                        Client Name: {caseInfo?.clientName.S}
                      </Card.Subtitle>
                      <hr />
                      <Card.Subtitle className="mb-2 text-muted">
                        Nature: {caseInfo?.nature.S}
                      </Card.Subtitle>
                      <hr />
                      <Card.Subtitle className="mb-2 text-muted">
                        Date: {caseInfo?.date.S}
                      </Card.Subtitle>
                      <hr />
                      <Card.Subtitle className="mb-2 text-muted">
                        Status: {caseInfo?.status.S}
                      </Card.Subtitle>
                      <hr />
                      <Card.Subtitle className="mb-2 text-muted">
                        Assignee: {caseInfo?.assignee.S}
                      </Card.Subtitle>
                      <hr />
                      <Card.Subtitle className="mb-2 text-muted">
                        Client ID: {caseInfo?.clientId.S}
                      </Card.Subtitle>
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
                          {results.map((result: ExtractionResult) => (
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
                <Col className="mt-5">
                  <Card>
                    <Card.Body>
                      <Card.Title>Case Description</Card.Title>
                      <hr />
                      <Card.Subtitle className="mb-2 text-muted">
                        {caseInfo?.description.S}
                      </Card.Subtitle>
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
