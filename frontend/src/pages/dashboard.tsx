import React, { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Container,
  Button,
  Badge,
  Dropdown,
  InputGroup,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { CaseService } from "../services/case.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUndo } from "@fortawesome/free-solid-svg-icons";
import { Case } from "../interfaces/case/case.interface";
import { Link } from "react-router-dom";

const statuses: { [key: string]: string } = {
  ACTIVE: "success",
  PENDING: "warning",
  CLOSED: "danger",
  OPEN: "primary",
};

const Dashboard = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [refSearch, setRefSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const filterByStatus = (status: string) => {
    setCases(
      cases.filter((caseRecord) => {
        return caseRecord.status === status;
      })
    );
  };

  const filterByRef = (search: string) => {
    setCases(
      cases.filter((caseRecord) => {
        return caseRecord.SK.includes(search);
      })
    );
  };

  const filterByClient = (search: string) => {
    setCases(
      cases.filter((caseRecord) => {
        return caseRecord.clientName.includes(search);
      })
    );
  };

  const getAccessToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://sidekick-api.com`,
          scope: "read:current_user",
        },
      });
      console.log(accessToken);
      return accessToken;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const caseService = new CaseService();

  const getCases = () => {
    getAccessToken().then(async (res) => {
      let accessToken = res;
      if (accessToken) {
        try {
          await caseService.getAllCases(accessToken).then((res) => {
            if (res) {
              console.log(res);
              setCases(res.data);
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    getCases();
    setLoading(false);
  }, [getAccessTokenSilently, user?.sub]);

  return (
    <Container style={{ paddingTop: "8rem" }}>
      <h2>Dashboard</h2>
      <Container className="pt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Filter by Reference</th>
              <th scope="col">Filter by Name</th>
              <th scope="col">Filter by Status</th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th scope="col">
                <InputGroup>
                  <Form.Control
                    placeholder="Search for a reference"
                    aria-label="Case reference"
                    onChange={(e) => setRefSearch(e.target.value)}
                  />
                  <Button
                    style={{
                      color: "#CF7650",
                      border: "2px solid",
                      borderColor: "#CF7650",
                      backgroundColor: "white",
                    }}
                    onClick={() => filterByRef(refSearch)}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </th>
              <th scope="col">
                <InputGroup>
                  <Form.Control
                    placeholder="Search for a client"
                    aria-label="Client name"
                    onChange={(e) => setClientSearch(e.target.value)}
                  />
                  <Button
                    style={{
                      color: "#CF7650",
                      border: "2px solid",
                      borderColor: "#CF7650",
                      backgroundColor: "white",
                    }}
                    onClick={() => filterByClient(clientSearch)}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </th>
              <th scope="col">
                <Dropdown>
                  <Dropdown.Toggle
                    style={{
                      color: "#CF7650",
                      border: "2px solid",
                      borderColor: "#CF7650",
                      backgroundColor: "white",
                    }}
                  >
                    Status
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {Object.keys(statuses).map((statusItem) => (
                      <Dropdown.Item onClick={() => filterByStatus(statusItem)}>
                        <Badge bg={statuses[statusItem]} text="light">
                          {statusItem}
                        </Badge>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </th>
              <th scope="col">
                <Button
                  style={{
                    color: "#CF7650",
                    border: "2px solid",
                    borderColor: "#CF7650",
                    backgroundColor: "white",
                  }}
                  onClick={() => {
                    getCases();
                  }}
                >
                  Reset
                  <FontAwesomeIcon className="ms-2" icon={faUndo} />
                </Button>
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th scope="col">Reference</th>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          {!loading && (
            <tbody>
              {user && user["authGroups"].includes("Admin")
                ? cases.map((caseRecord) => (
                    <tr>
                      <td>{caseRecord.SK}</td>
                      <td>{caseRecord.clientName}</td>
                      <td>
                        <Badge bg={statuses[caseRecord.status]} text="light">
                          {caseRecord.status}
                        </Badge>
                      </td>
                      <td>
                        <Link to={`../case/${caseRecord.SK}`}>
                          <Button className="sidekick-primary-btn">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                : user && user["authGroups"].includes("Worker")
                  ? cases
                      .filter((caseRecord) => caseRecord.assignee === user.name)
                      .map((caseRecord) => (
                        <tr>
                          <td>{caseRecord.SK}</td>
                          <td>{caseRecord.clientName}</td>
                          <td>
                            <Badge
                              bg={statuses[caseRecord.status]}
                              text="light"
                            >
                              {caseRecord.status}
                            </Badge>
                          </td>
                          <td>
                            <Link to={`../case/${caseRecord.SK}`}>
                              <Button className="sidekick-primary-btn">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                  : cases
                      .filter(
                        (caseRecord) => caseRecord.clientName === user!.name
                      )
                      .map((caseRecord) => (
                        <tr>
                          <td>{caseRecord.SK}</td>
                          <td>{caseRecord.clientName}</td>
                          <td>
                            <Badge
                              bg={statuses[caseRecord.status]}
                              text="light"
                            >
                              {caseRecord.status}
                            </Badge>
                          </td>
                          <td>
                            <Link to={`../case/${caseRecord.SK}`}>
                              <Button className="sidekick-primary-btn">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
            </tbody>
          )}
        </table>
        {loading && (
            <div className="text-center">
              <Container className="mt-5">
                <Row>
                  <Col className="text-center">
                    <Spinner animation="border" />
                  </Col>
                </Row>
              </Container>
            </div>
          )}
      </Container>
    </Container>
  );
};

export default withAuthenticationRequired(Dashboard);
