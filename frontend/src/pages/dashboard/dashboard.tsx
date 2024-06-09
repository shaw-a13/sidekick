import React, { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { CaseService } from "../../services/case.service";
import { Case } from "../../interfaces/case/case.interface";
import { CaseRow } from "./components/caseRow.component";
import { ResetButton } from "./components/resetButton.component";
import { SearchInput } from "./components/searchInput.component";
import { StatusDropdown } from "./components/statusDropdown.component";
import { CaseStatus } from "../../enums/caseStatus";

const Dashboard = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState("");
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [refSearch, setRefSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const buttonStyle = {
    color: "#CF7650",
    border: "2px solid",
    borderColor: "#CF7650",
    backgroundColor: "white",
  };

  // Map functions
  const adminCases = cases.map((caseRecord) => <CaseRow caseRecord={caseRecord} />);
  const workerCases = cases.filter((caseRecord) => caseRecord.status === CaseStatus.OPEN || caseRecord.assignee === user!.name).map((caseRecord) => <CaseRow caseRecord={caseRecord} />);
  const clientCases = cases.filter((caseRecord) => caseRecord.clientName === user!.name).map((caseRecord) => <CaseRow caseRecord={caseRecord} />);

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

  const caseService = new CaseService();

  const getCases = (token: string) => {
    caseService
      .getAllCases(token)
      .then((res) => {
        if (res) {
          console.log(res);
          setCases(res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setLoading(true);
    getAccessTokenSilently().then((token: string) => {
      setAccessToken(token!);
      getCases(token);
      setLoading(false);
    });
  }, [getAccessTokenSilently]);

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
                <SearchInput
                  placeholder="Search for a reference"
                  ariaLabel="Case reference"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRefSearch(e.target.value)}
                  onClick={() => filterByRef(refSearch)}
                  buttonStyle={buttonStyle}
                />
              </th>
              <th scope="col">
                <SearchInput
                  placeholder="Search for a client"
                  ariaLabel="Client name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientSearch(e.target.value)}
                  onClick={() => filterByClient(clientSearch)}
                  buttonStyle={buttonStyle}
                />
              </th>
              <th scope="col">
                <StatusDropdown onClick={filterByStatus} buttonStyle={buttonStyle} />
              </th>
              <th scope="col">
                <ResetButton onClick={() => getCases(accessToken)} buttonStyle={buttonStyle} />
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
          {!loading && <tbody>{user && user["authGroups"].includes("Admin") ? adminCases : user && user["authGroups"].includes("Worker") ? workerCases : clientCases}</tbody>}
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
