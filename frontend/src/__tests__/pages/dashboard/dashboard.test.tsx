import { render, screen, waitFor } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "../../../pages/dashboard/dashboard";
import axios, { AxiosResponse } from "axios";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { getMockCases } from "./mockCases";

jest.mock("@auth0/auth0-react");

const mockLoginWithRedirect = jest.fn();
let mockAxiosGet: jest.SpyInstance;

describe("Dashboard", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { authGroups: ["Admin"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: true,
      getAccessTokenSilently: jest.fn(() => Promise.resolve("testToken")),
    });

    mockAxiosGet = jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({
        data: getMockCases(),
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
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

  describe("when the cases have loaded", () => {
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

      expect(caseRows).toHaveLength(4);
      expect(caseRows[0]).toHaveTextContent("123");
      expect(caseRows[0]).toHaveTextContent("John Doe");
      expect(caseRows[0]).toHaveTextContent("OPEN");
      expect(caseRows[1]).toHaveTextContent("124");
      expect(caseRows[1]).toHaveTextContent("Jane Doe");
      expect(caseRows[1]).toHaveTextContent("ACTIVE");
      expect(caseRows[2]).toHaveTextContent("125");
      expect(caseRows[2]).toHaveTextContent("John Smith");
      expect(caseRows[2]).toHaveTextContent("PENDING");
      expect(caseRows[3]).toHaveTextContent("126");
      expect(caseRows[3]).toHaveTextContent("Jane Smith");
      expect(caseRows[3]).toHaveTextContent("CLOSED");

      const viewButtons = screen.getAllByRole("button", { name: /view/i });
      expect(viewButtons).toHaveLength(4);
    });

    test("renders the cases table with the correct amount of rows after filtering by reference", async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const filterInput = screen.getByPlaceholderText("Search for a reference") as HTMLInputElement;

      userEvent.type(filterInput, "123");

      const submitButtons = screen.getAllByRole("button");

      submitButtons[0].click();
      let caseRows = screen.getAllByTestId("caseRow");
      await waitFor(() => {
        caseRows = screen.getAllByTestId("caseRow");
        expect(caseRows).toHaveLength(1);
      });
      expect(caseRows[0]).toHaveTextContent("123");
      expect(caseRows[0]).toHaveTextContent("John Doe");
      expect(caseRows[0]).toHaveTextContent("OPEN");
    });

    test("renders the cases table with the correct amount of rows after filtering by name", async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const filterInput = screen.getByPlaceholderText("Search for a client") as HTMLInputElement;

      userEvent.type(filterInput, "Jane Doe");

      const submitButtons = screen.getAllByRole("button");

      submitButtons[1].click();
      let caseRows = screen.getAllByTestId("caseRow");
      await waitFor(() => {
        caseRows = screen.getAllByTestId("caseRow");
        expect(caseRows).toHaveLength(1);
      });
      expect(caseRows[0]).toHaveTextContent("124");
      expect(caseRows[0]).toHaveTextContent("Jane Doe");
      expect(caseRows[0]).toHaveTextContent("ACTIVE");
    });
  });

  describe("When the filtering by status", () => {
    test("renders only the open cases when open is clicked", async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const dropdownToggle = screen.getByRole("button", { name: /status/i });
      userEvent.click(dropdownToggle);
      const openOption = screen.getAllByText("OPEN")[0];
      userEvent.click(openOption);
      let caseRows = screen.getAllByTestId("caseRow");
      await waitFor(() => {
        caseRows = screen.getAllByTestId("caseRow");
        expect(caseRows).toHaveLength(1);
      });
      expect(caseRows[0]).toHaveTextContent("123");
      expect(caseRows[0]).toHaveTextContent("John Doe");
      expect(caseRows[0]).toHaveTextContent("OPEN");
    });

    test("renders only the active cases when active is clicked", async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const dropdownToggle = screen.getByRole("button", { name: /status/i });
      userEvent.click(dropdownToggle);
      const activeOption = screen.getAllByText("ACTIVE")[0];
      userEvent.click(activeOption);
      let caseRows = screen.getAllByTestId("caseRow");
      await waitFor(() => {
        caseRows = screen.getAllByTestId("caseRow");
        expect(caseRows).toHaveLength(1);
      });
      expect(caseRows[0]).toHaveTextContent("124");
      expect(caseRows[0]).toHaveTextContent("Jane Doe");
      expect(caseRows[0]).toHaveTextContent("ACTIVE");
    });

    test("renders only the pending cases when pending is clicked", async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const dropdownToggle = screen.getByRole("button", { name: /status/i });
      userEvent.click(dropdownToggle);
      const pendingOption = screen.getAllByText("PENDING")[0];
      userEvent.click(pendingOption);
      let caseRows = screen.getAllByTestId("caseRow");
      await waitFor(() => {
        caseRows = screen.getAllByTestId("caseRow");
        expect(caseRows).toHaveLength(1);
      });
      expect(caseRows[0]).toHaveTextContent("125");
      expect(caseRows[0]).toHaveTextContent("John Smith");
      expect(caseRows[0]).toHaveTextContent("PENDING");
    });
    test("renders only the closed cases when closed is clicked", async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const dropdownToggle = screen.getByRole("button", { name: /status/i });
      userEvent.click(dropdownToggle);
      const pendingOption = screen.getAllByText("CLOSED")[0];
      userEvent.click(pendingOption);
      let caseRows = screen.getAllByTestId("caseRow");
      await waitFor(() => {
        caseRows = screen.getAllByTestId("caseRow");
        expect(caseRows).toHaveLength(1);
      });
      expect(caseRows[0]).toHaveTextContent("126");
      expect(caseRows[0]).toHaveTextContent("Jane Smith");
      expect(caseRows[0]).toHaveTextContent("CLOSED");
    });
  });
  describe("When the reset button is clicked", () => {
    test("renders the cases table with the correct amount of rows", async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const filterInput = screen.getByPlaceholderText("Search for a reference") as HTMLInputElement;

      userEvent.type(filterInput, "123");

      const submitButtons = screen.getAllByRole("button");

      submitButtons[0].click();
      let caseRows = screen.getAllByTestId("caseRow");
      await waitFor(() => {
        caseRows = screen.getAllByTestId("caseRow");
        expect(caseRows).toHaveLength(1);
      });
      const resetButton = screen.getByRole("button", { name: /Reset/i });

      resetButton.click();
      await waitFor(() => {
        caseRows = screen.getAllByTestId("caseRow");
        expect(caseRows).toHaveLength(4);
      });
      expect(caseRows[0]).toHaveTextContent("123");
      expect(caseRows[0]).toHaveTextContent("John Doe");
      expect(caseRows[0]).toHaveTextContent("OPEN");
      expect(caseRows[1]).toHaveTextContent("124");
      expect(caseRows[1]).toHaveTextContent("Jane Doe");
      expect(caseRows[1]).toHaveTextContent("ACTIVE");
      expect(caseRows[2]).toHaveTextContent("125");
      expect(caseRows[2]).toHaveTextContent("John Smith");
      expect(caseRows[2]).toHaveTextContent("PENDING");
      expect(caseRows[3]).toHaveTextContent("126");
      expect(caseRows[3]).toHaveTextContent("Jane Smith");
      expect(caseRows[3]).toHaveTextContent("CLOSED");
    });
  });

  describe("When the view case button is clicked", () => {
    test("it redirects to the correct case page", async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const viewButtons = screen.getAllByRole("button", { name: /view/i });

      userEvent.click(viewButtons[0]);

      expect(window.location.pathname).toEqual("/case/123");
    });
  });

  describe("When a worker accesses the dashboard", () => {
    test("renders the cases table with the correct data", async () => {
      (useAuth0 as jest.Mock).mockReturnValue({
        user: { authGroups: ["Worker"], picture: "https://example.com", name: "Assignee 1", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
        loginWithRedirect: mockLoginWithRedirect,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(() => Promise.resolve("testToken")),
      });

      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const caseRows = screen.getAllByTestId("caseRow");

      expect(caseRows).toHaveLength(1);
      expect(caseRows[0]).toHaveTextContent("123");
      expect(caseRows[0]).toHaveTextContent("John Doe");
      expect(caseRows[0]).toHaveTextContent("OPEN");

      const viewButtons = screen.getAllByRole("button", { name: /view/i });
      expect(viewButtons).toHaveLength(1);
    });
  });

  describe("When a client accesses the dashboard", () => {
    test("renders the cases table with the correct data", async () => {
      (useAuth0 as jest.Mock).mockReturnValue({
        user: { authGroups: [], picture: "https://example.com", name: "Jane Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
        loginWithRedirect: mockLoginWithRedirect,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(() => Promise.resolve("testToken")),
      });

      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loadingSpinner")).not.toBeInTheDocument();
      });

      const caseRows = screen.getAllByTestId("caseRow");

      expect(caseRows).toHaveLength(1);
      expect(caseRows[0]).toHaveTextContent("124");
      expect(caseRows[0]).toHaveTextContent("Jane Doe");
      expect(caseRows[0]).toHaveTextContent("ACTIVE");

      const viewButtons = screen.getAllByRole("button", { name: /view/i });
      expect(viewButtons).toHaveLength(1);
    });
  });

  describe("When the getCases API returns an error", () => {
    test("it renders the error message", async () => {
      const error = new Error("An error occurred");
      mockAxiosGet = jest.spyOn(axios, "get").mockImplementation((resolve, rejects) => {
        return new Promise<AxiosResponse>((resolve, rejects) => {
          rejects(error);
        });
      });

      console.error = jest.fn();

      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(error);
      });
    });
  });
});
