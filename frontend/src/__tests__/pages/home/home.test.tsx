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
    test("renders the image correctly", async () => {
      render(<Home />);
      const bannerSection = screen.getByTestId("bannerSection");
      const image = await within(bannerSection).findByTestId("bannerImage");

      expect(image).toBeInTheDocument();
    });

    test("renders the blurb section with the correct text", async () => {
      render(<Home />);
      const bannerSection = screen.getByTestId("bannerSection");

      expect(bannerSection).toHaveTextContent("Sidekick");
      expect(bannerSection).toHaveTextContent("Elevate your legal workflow");
      expect(bannerSection).toHaveTextContent("Seamlessly integrate automation with your legal processes with your document extraction ally");
    });

    test("renders the get started button", async () => {
      render(<Home />);
      const bannerSection = screen.getByTestId("bannerSection");
      const getStartedButton = await within(bannerSection).findByRole("button", { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();
    });
  });

  describe("When it renders the feature section", () => {
    test("renders the correct amount of features", async () => {
      render(<Home />);
      const featureSection = screen.getByTestId("featureSection");
      const features = await within(featureSection).findAllByTestId("feature");
      expect(features).toHaveLength(3);
    });

    test("renders the feature sections with the correct text", async () => {
      render(<Home />);
      const featureSection = screen.getByTestId("featureSection");
      const features = await within(featureSection).findAllByTestId("feature");

      expect(features[0]).toHaveTextContent("Speedy document processing");
      expect(features[1]).toHaveTextContent("Intelligent extractions");
      expect(features[2]).toHaveTextContent("Reliable storage");

      expect(features[0]).toHaveTextContent("The automated extraction of content from legal documents removes the need to manually search through documents to find information");
      expect(features[1]).toHaveTextContent("Using state of the art artificial intelligence and managed services, information can be easily extracted");
      expect(features[2]).toHaveTextContent("Every document uploaded is stored reliably on the cloud, it is also secured to a high standard following the latest security guidelines");
    });
  });

  describe("When it renders the testimonial section", () => {
    test("renders the correct amount of testimonials", async () => {
      render(<Home />);
      const testimonialSection = screen.getByTestId("testimonialSection");
      const testimonials = await within(testimonialSection).findAllByTestId("testimonial");
      expect(testimonials).toHaveLength(3);
    });

    test("renders the testimonial sections with the correct text", async () => {
      render(<Home />);
      const testimonialSection = screen.getByTestId("testimonialSection");
      const testimonials = await within(testimonialSection).findAllByTestId("testimonial");

      expect(testimonials[0]).toHaveTextContent("John (Solicitor, 32)");
      expect(testimonials[1]).toHaveTextContent("Jane (Secretary, 30)");
      expect(testimonials[2]).toHaveTextContent("Sarah (Solicitor, 50)");

      expect(testimonials[0]).toHaveTextContent("Switching to using Sidekick has improved case processing times by 50% at JS and Associates, we havent looked back since switching to Sidekick!");
      expect(testimonials[1]).toHaveTextContent(
        "Sidekick has made my job so much easier. Gone are the days of needing to trawl through long documents to find information. I can now focus on more important activities!"
      );
      expect(testimonials[2]).toHaveTextContent(
        "Sidekick has opened up so many possibilities for my law firm! Since switching to using it, we have received very positive feedback from clients about how much better our process is"
      );
    });

    test("renders the testimonial sections with correct number of images", async () => {
      render(<Home />);
      const testimonialSection = screen.getByTestId("testimonialSection");
      const testimonialImages = await within(testimonialSection).findAllByRole("img");
      expect(testimonialImages).toHaveLength(3);
    });
  });

  describe("When it renders the call to action section", () => {
    test("renders the section heading", async () => {
      render(<Home />);
      const callToActionSection = screen.getByTestId("callToActionSection");
      const heading = await within(callToActionSection).findByText(/Make the switch today/i);
      expect(heading).toBeInTheDocument();
    });
    test("renders the get started button", async () => {
      render(<Home />);
      const callToActionSection = screen.getByTestId("callToActionSection");
      const getStartedButton = await within(callToActionSection).findByRole("button", { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();
    });
  });

  describe("When the Get Started buttons are clicked", () => {
    test("it calls loginWithRedirect", async () => {
      render(<Home />);
      const getStartedButtons = await screen.findAllByRole("button", { name: /get started/i });
      userEvent.click(getStartedButtons[0]);
      userEvent.click(getStartedButtons[1]);

      expect(mockLoginWithRedirect).toBeCalledTimes(2);
    });
  });
});
