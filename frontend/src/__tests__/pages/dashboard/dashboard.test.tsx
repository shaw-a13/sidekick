import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "../../../pages/dashboard/dashboard";
import { CaseService } from "../../../services/case.service";
import { AxiosHeaders, AxiosResponse } from "axios";
import { Case } from "../../../interfaces/case/case.interface";
import { getMockCases } from "./mockCases";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import exp from "constants";
import { CaseStatus, CaseStatusStyles } from "../../../enums/caseStatus";

jest.mock("@auth0/auth0-react");

// jest.mock("../../../enums/caseStatus", () => ({
//   CaseStatus: {
//     OPEN: "OPEN",
//     ACTIVE: "ATIVE",
//     PENDING: "PENDING",
//     CLOSED: "CLOSED",
//   },

//   CaseStatusStyles: {
//     OPEN: { style: "primary" },
//     ACTIVE: { style: "success" },
//     PENDING: { style: "warning" },
//     CLOSED: { style: "danger" },
//   },
// }));

CaseStatusStyles[CaseStatus.CLOSED] = { style: "danger" };

const mockLoginWithRedirect = jest.fn();
let mockCaseService: jest.SpyInstance;

describe("Dashboard", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { authGroups: ["Admin,Worker"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: true,
      getAccessTokenSilently: jest.fn(() => Promise.resolve("testToken")),
    });

    mockCaseService = jest.spyOn(CaseService.prototype, "getAllCases").mockImplementation(() => {
      return new Promise<AxiosResponse<Case[]>>((resolve) => {
        resolve({
          data: getMockCases(),
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });
  });

  test("renders without errors", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  });

  test("renders the dashboard section", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("dashboardSection")).toBeInTheDocument();
  });

  test("renders the dashboard title", () => {
    render(<Dashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renders the cases table", async () => {
    render(<Dashboard />);

    const table = screen.getByRole("table");

    expect(table).toBeInTheDocument();
  });

  test("renders the cases table with the correct filter headings", async () => {
    render(<Dashboard />);

    const tableFilterHeadings = screen.getByTestId("tableFilterHeadings");

    expect(tableFilterHeadings).toHaveTextContent("Filter by Reference");
    expect(tableFilterHeadings).toHaveTextContent("Filter by Name");
    expect(tableFilterHeadings).toHaveTextContent("Filter by Status");
  });

  test("renders the cases table with the correct search inputs", async () => {
    render(<Dashboard />);

    const filterByReference = screen.getByPlaceholderText("Search for a reference") as HTMLInputElement;
    const filterByClient = screen.getByPlaceholderText("Search for a client") as HTMLInputElement;
    const statusDropdown = screen.getByTestId("statusDropdown");
    const resetButton = screen.getByRole("button", { name: /reset/i });
    expect(filterByReference).toBeInTheDocument();
    expect(filterByClient).toBeInTheDocument();
    expect(statusDropdown).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });

  test("renders the cases table with the correct table data headings", async () => {
    render(<Dashboard />);

    const tableDataHeadings = screen.getByTestId("tableDataHeadings");

    expect(tableDataHeadings).toHaveTextContent("Reference");
    expect(tableDataHeadings).toHaveTextContent("Name");
    expect(tableDataHeadings).toHaveTextContent("Status");
  });

  test("renders the cases table with the correct data", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
    });

    const caseRows = screen.getAllByTestId("caseRow");

    expect(caseRows).toHaveLength(3);

    // expect(screen.getByText("123")).toBeInTheDocument();
    // expect(screen.getByText("Client 1")).toBeInTheDocument();
    // expect(screen.getByText("John Doe")).toBeInTheDocument();
    // expect(screen.getByText("OPEN")).toBeInTheDocument();

    // SK: "123",
    //   clientId: "Client 1",
    //   clientName: "John Doe",

    //   SK: "124",
    //   clientId: "Client 2",
    //   clientName: "Jane Doe",
    //   status: "CLOSED",

    // expect(tableRows[0]).toHaveTextContent("Client 1");
    // expect(tableRows[0]).toHaveTextContent("Active");
    // expect(tableRows[1]).toHaveTextContent("456");
    // expect(tableRows[1]).toHaveTextContent("Client 2");
    // expect(tableRows[1]).toHaveTextContent("Inactive");
    // expect(tableRows[2]).toHaveTextContent("789");
    // expect(tableRows[2]).toHaveTextContent("Client 3");
    // expect(tableRows[2]).toHaveTextContent("Active");
  });

  test("renders the cases table with the correct amount of rows after filtering by reference", async () => {
    render(<Dashboard />);

    const tableRows = screen.getAllByTestId("tableRow");

    expect(tableRows).toHaveLength(3);

    const filterInput = screen.getByPlaceholderText("Search for a reference") as HTMLInputElement;

    filterInput.value = "123";

    filterInput.dispatchEvent(new Event("input"));

    expect(tableRows).toHaveLength(1);
  });
});
