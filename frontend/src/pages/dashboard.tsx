import React, { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Container,
  Button,
  Badge,
  Dropdown,
  InputGroup,
  Form,
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
};

const Dashboard = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [refSearch, setRefSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const caseRes = {
    data: [
      {
        SK: "REF12336",
        clientId: "922884",
        clientName: "Jayne Salter",
        status: "CLOSED",
        description: "Test desc",
        nature: "Property",
        date: "04/05/2024",
        assignee: "Jane Sawer",
      },
      {
        SK: "REF12345",
        clientId: "00988",
        clientName: "John Smith",
        status: "ACTIVE",
        description: "Test desc",
        nature: "Property",
        date: "04/05/2024",
        assignee: "Jane Sawer",
      },
      {
        SK: "REF44332",
        clientId: "4799",
        clientName: "Jack Doe",
        status: "ACTIVE",
        description: "Test desc",
        nature: "Property",
        date: "04/05/2024",
        assignee: "Jane Sawer",
      },
      {
        SK: "REF55744",
        clientId: "78900",
        clientName: "Louise Smith",
        status: "ACTIVE",
        description: "Test desc",
        nature: "Property",
        date: "04/05/2024",
        assignee: "Jane Sawer",
      },
      {
        SK: "REF67899",
        clientId: "65432",
        clientName: "Jane Doe",
        status: "ACTIVE",
        description: "Test desc",
        nature: "Property",
        date: "04/05/2024",
        assignee: "Jane Sawer",
      },
    ],
    status: 200,
    statusText: "",
    headers: {
      "content-length": "420",
      "content-type": "application/json",
    },
    config: {
      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false,
      },
      adapter: ["xhr", "http"],
      transformRequest: [null],
      transformResponse: [null],
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {},
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkdqQ3pUVFVrQVNESlMxWkhiR3BESCJ9.eyJpc3MiOiJodHRwczovL2Rldi1sb292eHg0Znd1em9oaThrLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NTYyNjAxMjE3YjRiZGI1MDExMzYwYmQiLCJhdWQiOlsiaHR0cHM6Ly9zaWRla2ljay1hcGkuY29tIiwiaHR0cHM6Ly9kZXYtbG9vdnh4NGZ3dXpvaGk4ay51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzEyNTE2OTQ5LCJleHAiOjE3MTI2MDMzNDksInNjb3BlIjoib3BlbmlkIiwiYXpwIjoiNGtPZnl6VFFlWW1EbzBzSXNMaHYxa05ld0ptTEVXbGsifQ.ZVQPjdhBk_jPgx2a_QiMUOACQOA1UAojjBrBAD5FXHE6-gbshngNbatjib4pnBEYDGew7f0pJtZqsiWvCfr_rPdQohWtScUJXtIpy9BGUhC10EgM9OJmE5yXQsxc8ZwkycaiFisO3eh3x5bO7zirZQwX3DGhIoqi2bteVJYCnfIRYXgOWJ3hT_8Kd5HeYxP3dzQdbE5GNSWYeFYF-REYQiW1_g3Pp76M4h0sUIgAN0YdR7ZSjnNgOF5tAgUNQUckiBfcaubJLO_gALOCXnq79XSz6oXhc0LEcwFbn8rkYGk_hDYERFCRlwvtn_opu2DzcrmVNUaED6xo-jy8I-M7EA",
      },
      method: "get",
      url: "https://0lsi10z5ki.execute-api.eu-west-1.amazonaws.com/prod/cases",
    },
    request: {},
  };

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
        return caseRecord.SK === search;
      })
    );
  };

  const filterByClient = (search: string) => {
    setCases(
      cases.filter((caseRecord) => {
        return caseRecord.clientName === search;
      })
    );
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
        console.log(accessToken);
        return accessToken;
      } catch (e: any) {
        console.log(e.message);
      }
    };

    const caseService = new CaseService();

    let accessToken;

    getAccessToken().then(async (res) => {
      accessToken = res;
      if (accessToken) {
        setLoading(true);
        setCases(caseRes.data);
        setLoading(false);
        // setLoading(true);
        // try {
        //   await caseService.getAllCases(accessToken).then((res) => {
        //     if (res) {
        //       console.log(res)
        //       setCases(res.data)
        //     }
        //   });
        // } catch (e) {
        //   console.log(e);
        // }
        // setLoading(false);
      }
    });
  }, [getAccessTokenSilently, user?.sub]);

  return (
    <Container style={{ paddingTop: "8rem" }}>
      <h2>Dashboard</h2>
      <p>{clientSearch}</p>
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
                    variant="outline-primary"
                    id="button-addon2"
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
                    variant="outline-primary"
                    id="button-addon2"
                    onClick={() => filterByClient(clientSearch)}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </th>
              <th scope="col">
                <Dropdown>
                  <Dropdown.Toggle variant="primary">Status</Dropdown.Toggle>

                  <Dropdown.Menu>
                    {Object.keys(statuses).map((statusItem) => (
                      <Dropdown.Item onClick={() => filterByStatus(statusItem)}>
                        {statusItem}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </th>
              <th scope="col">
                <Button
                  variant="outline-primary"
                  id="button-addon2"
                  onClick={() => {
                    setCases(caseRes.data);
                  }}
                >
                  <FontAwesomeIcon icon={faUndo} />
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
          <tbody>
            {cases.map((caseRecord) => (
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
                    <Button
                      style={{ backgroundColor: "#e0fbfc", color: "black" }}
                    >
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <div>
        {loading && <div>Loading</div>}
        {!loading && (
          <div>
            <h2>Doing stuff with data</h2>
            {cases.map((caseRecord) => (
              <h1>{caseRecord.customerName}</h1>
            ))}
          </div>
        )}
      </div> */}
      </Container>
    </Container>
  );
};

export default withAuthenticationRequired(Dashboard);
