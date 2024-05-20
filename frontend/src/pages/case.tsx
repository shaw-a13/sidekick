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
import { DocumentService } from "../services/document.service";

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

  const mockDocRes = {
    "urls": [
        {
            "14414744-a8b7-4fa1-977c-19c4247126e3": {
                "original": "https://sidekick-cases.s3.amazonaws.com/b9a8a137-5802-43b3-ae8a-653869f761c1/14414744-a8b7-4fa1-977c-19c4247126e3/original/14414744-a8b7-4fa1-977c-19c4247126e3.pdf?AWSAccessKeyId=ASIAU6GDW6WBB675GTBK&Signature=EeLIoYuTBTNac%2BQ4jwf7t1WRUnI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIAW9l512yc44999FdvSxNARCtNBJdK%2BDWcDjuC5uf7CeAiEAzA%2BmsZGpxmb7hf1FVTUg5%2BLK8PFKzwQJ7u1R2Ldt25kqtwMILxAAGgwzMzk3MTI4NjU2NjYiDPm74MW0hyeL6rLzMSqUA1CoqSyGfGz8%2BnDby8Fu2WA7Hb6VAAWtk3KcxWEtqkXHZm%2B4BqDcot%2FDfEQINgrQaOPMYsbwxooIuLhWKzo%2FDn4sr2i4HXA6j0sV6%2BIOCuTGJTON6FgR4Ods%2BnNtMVPXvIQZWfk1AZCnRc%2FdAYSLGz4ncbkulOVlvNPO3n0ncIR3aDLaOZofwAo9SYaLgjCTW6%2FUt0OPeyOZ%2BLCYd34bWyU0qYRvM8aVlHUnwANzn%2BMkZ3mrit8StVXaAEH4hKFttV6CUH2rkQA%2F8ol8AeDnlGsklffXGCDuMsh4EJe0i0XSjVj76E%2Bl2N6lgNuQcGrWxTwBUE7CvlthKM27Jti7YFpuN8Jus06hHgDiV%2Bs8p5JX1vtJlKeHUawrImB0KfRwOA01rwJ%2FAi%2BIB%2FIyrK%2B3zNNHp6L1K7l9Igf1watT4HAX9zkqcyLxsna%2BZu1VQJmIZzYjJAwhMrLewaJ%2BBMS%2BSUNgxjNtuapETTxJdGRk%2F69ORuZLImmdkDHbVRSIJHQy04JP3ecRhz61P7a37jdSbvMo6nDpMJqurbIGOp4BB9RTtDA7YWrL5gfrQRUQIW9gJiIRUPH1TjdGYaSSlBs7pt6N6hNGvhDBjW%2B93k6Aq%2BG%2F2Un02JY6yJuclCmbfgxrOYqKILN8LdfA%2FXcDq2cON3a%2FBBbNbrgekOSbiEnQWbVENGpHB6o1K93Rwj3tSsP%2F1SaAhHDGkPdVySpAHLiFbER19H%2FZ1JzqeBBpKw8GOQWqIDxt1G9lG1fORlc%3D&Expires=1716217131",
                "processed": "https://sidekick-cases.s3.amazonaws.com/b9a8a137-5802-43b3-ae8a-653869f761c1/14414744-a8b7-4fa1-977c-19c4247126e3/processedResults/processedResults.json?AWSAccessKeyId=ASIAU6GDW6WBB675GTBK&Signature=wiFXE4HiVU%2B0Jgv3A3jYyTC5CzQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIAW9l512yc44999FdvSxNARCtNBJdK%2BDWcDjuC5uf7CeAiEAzA%2BmsZGpxmb7hf1FVTUg5%2BLK8PFKzwQJ7u1R2Ldt25kqtwMILxAAGgwzMzk3MTI4NjU2NjYiDPm74MW0hyeL6rLzMSqUA1CoqSyGfGz8%2BnDby8Fu2WA7Hb6VAAWtk3KcxWEtqkXHZm%2B4BqDcot%2FDfEQINgrQaOPMYsbwxooIuLhWKzo%2FDn4sr2i4HXA6j0sV6%2BIOCuTGJTON6FgR4Ods%2BnNtMVPXvIQZWfk1AZCnRc%2FdAYSLGz4ncbkulOVlvNPO3n0ncIR3aDLaOZofwAo9SYaLgjCTW6%2FUt0OPeyOZ%2BLCYd34bWyU0qYRvM8aVlHUnwANzn%2BMkZ3mrit8StVXaAEH4hKFttV6CUH2rkQA%2F8ol8AeDnlGsklffXGCDuMsh4EJe0i0XSjVj76E%2Bl2N6lgNuQcGrWxTwBUE7CvlthKM27Jti7YFpuN8Jus06hHgDiV%2Bs8p5JX1vtJlKeHUawrImB0KfRwOA01rwJ%2FAi%2BIB%2FIyrK%2B3zNNHp6L1K7l9Igf1watT4HAX9zkqcyLxsna%2BZu1VQJmIZzYjJAwhMrLewaJ%2BBMS%2BSUNgxjNtuapETTxJdGRk%2F69ORuZLImmdkDHbVRSIJHQy04JP3ecRhz61P7a37jdSbvMo6nDpMJqurbIGOp4BB9RTtDA7YWrL5gfrQRUQIW9gJiIRUPH1TjdGYaSSlBs7pt6N6hNGvhDBjW%2B93k6Aq%2BG%2F2Un02JY6yJuclCmbfgxrOYqKILN8LdfA%2FXcDq2cON3a%2FBBbNbrgekOSbiEnQWbVENGpHB6o1K93Rwj3tSsP%2F1SaAhHDGkPdVySpAHLiFbER19H%2FZ1JzqeBBpKw8GOQWqIDxt1G9lG1fORlc%3D&Expires=1716217131"
            }
        },
        {
            "2cfe7f88-da2b-411c-be0f-4e736e6703db": {
                "original": "https://sidekick-cases.s3.amazonaws.com/b9a8a137-5802-43b3-ae8a-653869f761c1/2cfe7f88-da2b-411c-be0f-4e736e6703db/original/2cfe7f88-da2b-411c-be0f-4e736e6703db.pdf?AWSAccessKeyId=ASIAU6GDW6WBB675GTBK&Signature=Ec8VjPwHHUSoPzSluXAXAEIhoAc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIAW9l512yc44999FdvSxNARCtNBJdK%2BDWcDjuC5uf7CeAiEAzA%2BmsZGpxmb7hf1FVTUg5%2BLK8PFKzwQJ7u1R2Ldt25kqtwMILxAAGgwzMzk3MTI4NjU2NjYiDPm74MW0hyeL6rLzMSqUA1CoqSyGfGz8%2BnDby8Fu2WA7Hb6VAAWtk3KcxWEtqkXHZm%2B4BqDcot%2FDfEQINgrQaOPMYsbwxooIuLhWKzo%2FDn4sr2i4HXA6j0sV6%2BIOCuTGJTON6FgR4Ods%2BnNtMVPXvIQZWfk1AZCnRc%2FdAYSLGz4ncbkulOVlvNPO3n0ncIR3aDLaOZofwAo9SYaLgjCTW6%2FUt0OPeyOZ%2BLCYd34bWyU0qYRvM8aVlHUnwANzn%2BMkZ3mrit8StVXaAEH4hKFttV6CUH2rkQA%2F8ol8AeDnlGsklffXGCDuMsh4EJe0i0XSjVj76E%2Bl2N6lgNuQcGrWxTwBUE7CvlthKM27Jti7YFpuN8Jus06hHgDiV%2Bs8p5JX1vtJlKeHUawrImB0KfRwOA01rwJ%2FAi%2BIB%2FIyrK%2B3zNNHp6L1K7l9Igf1watT4HAX9zkqcyLxsna%2BZu1VQJmIZzYjJAwhMrLewaJ%2BBMS%2BSUNgxjNtuapETTxJdGRk%2F69ORuZLImmdkDHbVRSIJHQy04JP3ecRhz61P7a37jdSbvMo6nDpMJqurbIGOp4BB9RTtDA7YWrL5gfrQRUQIW9gJiIRUPH1TjdGYaSSlBs7pt6N6hNGvhDBjW%2B93k6Aq%2BG%2F2Un02JY6yJuclCmbfgxrOYqKILN8LdfA%2FXcDq2cON3a%2FBBbNbrgekOSbiEnQWbVENGpHB6o1K93Rwj3tSsP%2F1SaAhHDGkPdVySpAHLiFbER19H%2FZ1JzqeBBpKw8GOQWqIDxt1G9lG1fORlc%3D&Expires=1716217131",
                "processed": "https://sidekick-cases.s3.amazonaws.com/b9a8a137-5802-43b3-ae8a-653869f761c1/2cfe7f88-da2b-411c-be0f-4e736e6703db/processedResults/processedResults.json?AWSAccessKeyId=ASIAU6GDW6WBB675GTBK&Signature=dXloIuqYqnE9hvNB5bwJm5y71X4%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIAW9l512yc44999FdvSxNARCtNBJdK%2BDWcDjuC5uf7CeAiEAzA%2BmsZGpxmb7hf1FVTUg5%2BLK8PFKzwQJ7u1R2Ldt25kqtwMILxAAGgwzMzk3MTI4NjU2NjYiDPm74MW0hyeL6rLzMSqUA1CoqSyGfGz8%2BnDby8Fu2WA7Hb6VAAWtk3KcxWEtqkXHZm%2B4BqDcot%2FDfEQINgrQaOPMYsbwxooIuLhWKzo%2FDn4sr2i4HXA6j0sV6%2BIOCuTGJTON6FgR4Ods%2BnNtMVPXvIQZWfk1AZCnRc%2FdAYSLGz4ncbkulOVlvNPO3n0ncIR3aDLaOZofwAo9SYaLgjCTW6%2FUt0OPeyOZ%2BLCYd34bWyU0qYRvM8aVlHUnwANzn%2BMkZ3mrit8StVXaAEH4hKFttV6CUH2rkQA%2F8ol8AeDnlGsklffXGCDuMsh4EJe0i0XSjVj76E%2Bl2N6lgNuQcGrWxTwBUE7CvlthKM27Jti7YFpuN8Jus06hHgDiV%2Bs8p5JX1vtJlKeHUawrImB0KfRwOA01rwJ%2FAi%2BIB%2FIyrK%2B3zNNHp6L1K7l9Igf1watT4HAX9zkqcyLxsna%2BZu1VQJmIZzYjJAwhMrLewaJ%2BBMS%2BSUNgxjNtuapETTxJdGRk%2F69ORuZLImmdkDHbVRSIJHQy04JP3ecRhz61P7a37jdSbvMo6nDpMJqurbIGOp4BB9RTtDA7YWrL5gfrQRUQIW9gJiIRUPH1TjdGYaSSlBs7pt6N6hNGvhDBjW%2B93k6Aq%2BG%2F2Un02JY6yJuclCmbfgxrOYqKILN8LdfA%2FXcDq2cON3a%2FBBbNbrgekOSbiEnQWbVENGpHB6o1K93Rwj3tSsP%2F1SaAhHDGkPdVySpAHLiFbER19H%2FZ1JzqeBBpKw8GOQWqIDxt1G9lG1fORlc%3D&Expires=1716217131"
            }
        }
    ]
}


  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [caseInfo, setCaseInfo] = useState<CaseDynamo>();
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [docNo, setDocNo] = useState(0);
  const [documentData, setDocumentData] = useState([])

  const caseService = new CaseService();
  const documentService = new DocumentService();
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
    getAccessToken().then(async (token) => {
      setLoading(true);
      setCaseInfo(mockRes[0]);
      // const result = await documentService.getDocuments(token!, id!)
      // console.log(result)
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
