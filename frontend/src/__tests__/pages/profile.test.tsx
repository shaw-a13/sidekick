import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "../../pages/profile";

jest.mock("@auth0/auth0-react");

const mockLoginWithRedirect = jest.fn();

describe("Profile Component Tests", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { authGroups: ["admin"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Profile component renders without crashing", () => {
    render(<Profile />);
  });

  describe("When the user is logged in", () => {
    test("it renders the correct text", () => {
      render(<Profile />);
      const profileCard = screen.getByTestId("profileCard");

      expect(profileCard).toHaveTextContent("Profile Information");
      expect(profileCard).toHaveTextContent("Name: John Doe");
      expect(profileCard).toHaveTextContent("User ID: 123");
      expect(profileCard).toHaveTextContent("Nickname: JD");
      expect(profileCard).toHaveTextContent("Updated: 2021-09-01");
      expect(profileCard).toHaveTextContent("User Groups: admin");
    });

    test("it renders the edit button", async () => {
      window.open = jest.fn();

      render(<Profile />);
      const profileCard = screen.getByTestId("profileCard");

      const editButton = await within(profileCard).findByRole("button", { name: /Edit/i });
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass("sidekick-primary-btn");
      userEvent.click(editButton);

      expect(window.open).toHaveBeenCalledWith("https://manage.auth0.com");
    });
  });

  describe("When the user is not logged in", () => {
    test("it renders the correct text", () => {
      (useAuth0 as jest.Mock).mockReturnValue({
        isAuthenticated: false,
      });
      render(<Profile />);
      expect(screen.getByText("Not Authenticated")).toBeInTheDocument();
    });
  });
});
