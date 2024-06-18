import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Home from "../../../pages/home/home";
import { useAuth0 } from "@auth0/auth0-react";

jest.mock("@auth0/auth0-react");

const mockLoginWithRedirect = jest.fn();

describe("Home Component Tests", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: jest.fn(),
      loginWithRedirect: mockLoginWithRedirect,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Home component renders without crashing", () => {
    render(<Home />);
  });

  describe("When it renders the banner section", () => {
    test("it renders the banner image", () => {
      render(<Home />);
      const bannerElement = screen.getByRole("presentation", { name: "banner image" });
      expect(bannerElement).toBeInTheDocument();
    });

    test("it renders the blurb text", () => {
      render(<Home />);
      const blurbSection = screen.getByTestId("blurb");

      const blurbTexts = within(blurbSection).getAllByText(/Sidekick|Elevate your legal workflow|Seamlessly integrate automation with your legal processes with your document extraction ally/i);

      expect(blurbTexts).toHaveLength(3);
    });
  });

  test("renders the feature sections", async () => {
    render(<Home />);
    const featureTitles = await screen.findAllByText(/Speedy document processing|Intelligent extractions|Reliable storage/i);
    expect(featureTitles).toHaveLength(3);
  });

  test("renders the testimonial sections", async () => {
    render(<Home />);
    const testimonialTexts = await screen.findAllByText(/Switching to using Sidekick|Sidekick has made my job so much easier|Sidekick has opened up so many possibilities/i);
    expect(testimonialTexts).toHaveLength(3);
  });

  test("renders the call to action section", async () => {
    render(<Home />);
    const callToActionElements = await screen.findAllByRole("button", { name: /get started/i });
    expect(callToActionElements).toHaveLength(2);
  });

  test("calls loginWithRedirect when the Get Started buttons are clicked", async () => {
    render(<Home />);
    const getStartedButtons = await screen.findAllByRole("button", { name: /get started/i });
    userEvent.click(getStartedButtons[0]);
    userEvent.click(getStartedButtons[1]);

    expect(mockLoginWithRedirect).toBeCalledTimes(2);
  });
});
