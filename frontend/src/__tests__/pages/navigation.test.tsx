import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navigation from "../../pages/navigation";
import { BrowserRouter } from "react-router-dom";
import exp from "constants";

jest.mock("@auth0/auth0-react");

const mockLoginWithRedirect = jest.fn();

describe("Navigation Component Tests", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { authGroups: ["Admin,Worker"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Navigation component renders without crashing", () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  });

  test("it renders the navbar with the correct logo", () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    const logo = screen.getByTestId("logo");

    expect(logo).toBeInTheDocument();
  });

  describe("When the user is logged in", () => {
    test("it renders the navbar with the hello message", () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      );

      const navbar = screen.getByTestId("navbar");

      expect(navbar).toHaveTextContent("Hello, John Doe");
    });

    test("it renders the navbar with the correct buttons", async () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      );

      const buttons = await screen.findAllByRole("button");

      expect(buttons).toHaveLength(2);

      expect(buttons[1]).toHaveTextContent("Log Out");
    });
    describe("When the user is an admin", () => {
      beforeEach(() => {
        (useAuth0 as jest.Mock).mockReturnValue({
          user: { authGroups: ["Admin"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
          loginWithRedirect: mockLoginWithRedirect,
          isAuthenticated: true,
        });
      });
      test("it renders the navbar with the correct links", () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
        const navLinks = screen.getByTestId("navLinks");

        expect(navLinks).toHaveTextContent("Home");
        expect(navLinks).toHaveTextContent("Upload");
        expect(navLinks).toHaveTextContent("Dashboard");
        expect(navLinks).toHaveTextContent("Profile");
      });
    });
    describe("When the user is an worker", () => {
      beforeEach(() => {
        (useAuth0 as jest.Mock).mockReturnValue({
          user: { authGroups: ["Worker"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
          loginWithRedirect: mockLoginWithRedirect,
          isAuthenticated: true,
        });
      });
      test("it renders the navbar with the correct links", () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
        const navLinks = screen.getByTestId("navLinks");

        expect(navLinks).toHaveTextContent("Home");
        expect(navLinks).toHaveTextContent("Upload");
        expect(navLinks).toHaveTextContent("Dashboard");
        expect(navLinks).toHaveTextContent("Profile");
      });
    });
    describe("When the user has no roles", () => {
      beforeEach(() => {
        (useAuth0 as jest.Mock).mockReturnValue({
          user: { authGroups: [], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
          loginWithRedirect: mockLoginWithRedirect,
          isAuthenticated: true,
        });
      });
      test("it renders the navbar with the correct links", () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
        const navLinks = screen.getByTestId("navLinks");

        expect(navLinks).toHaveTextContent("Home");
        expect(navLinks).toHaveTextContent("Dashboard");
        expect(navLinks).toHaveTextContent("Profile");
      });
    });
  });

  describe("When the user is not logged in", () => {
    beforeEach(() => {
      (useAuth0 as jest.Mock).mockReturnValue({
        isAuthenticated: false,
      });
    });
    test("it renders the navbar with the correct links", () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      );
      const navLinks = screen.getByTestId("navLinks");

      expect(navLinks).toHaveTextContent("Home");
      expect(navLinks).not.toHaveTextContent("Upload");
      expect(navLinks).not.toHaveTextContent("Dashboard");
      expect(navLinks).not.toHaveTextContent("Profile");
    });

    test("it renders the navbar without the hello message", () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      );

      const navbar = screen.getByTestId("navbar");

      expect(navbar).not.toHaveTextContent("Hello, John Doe");
    });

    test("it renders the navbar with the correct buttons", async () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      );

      const buttons = await screen.findAllByRole("button");

      expect(buttons).toHaveLength(2);

      expect(buttons[1]).toHaveTextContent("Log In");
    });
  });
});
