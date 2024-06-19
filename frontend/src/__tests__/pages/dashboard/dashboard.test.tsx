import React from "react";
import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "../../../pages/dashboard/dashboard";
import { CaseService } from "../../../services/case.service";
import { AxiosResponse } from "axios";
import { Case } from "../../../interfaces/case/case.interface";

jest.mock("@auth0/auth0-react");

const mockLoginWithRedirect = jest.fn();
jest.mock("../../../services/case.service");
// (CaseService.getAllCases as jest.Mock).mockImplementation(() =>
//   Promise.resolve([
//     {
//       SK: "testSK",
//       clientId: "testClientId",
//       clientName: "testClientName",
//       status: "testStatus",
//       description: "testDescription",
//       nature: "testNature",
//       date: "2024-06-19T20:41:35Z",
//       assignee: "testAssignee",
//     },
//   ])
// );

describe("Dashboard", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { authGroups: ["Admin,Worker"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: true,
      getAccessTokenSilently: jest.fn(() => Promise.resolve({ token: "testToken" })),
    });
    jest.spyOn(CaseService.prototype, "getAllCases").mockImplementation(() =>
      Promise.resolve( data: [
        {
          SK: "testSK",
          clientId: "testClientId",
          clientName: "testClientName",
          status: "testStatus",
          description: "testDescription",
          nature: "testNature",
          date: "2024-06-19T20:41:35Z",
          assignee: "testAssignee",
        },
      ] as AxiosResponse<Case[]>)
    );
  });

  test("renders without errors", () => {
    render(<Dashboard />);
  });

  test("renders the dashboard section", () => {
    render(<Dashboard />);
    const dashboardSection = screen.getByTestId("dashboardSection");
    expect(dashboardSection).toBeInTheDocument();
  });

  test("renders the dashboard title", () => {
    render(<Dashboard />);
    const dashboardSection = screen.getByTestId("dashboardSection");
    expect(dashboardSection).toHaveTextContent("Dashboard");
  });
});
