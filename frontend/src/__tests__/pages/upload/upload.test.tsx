import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Upload from "../../../pages/upload/upload";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { DocumentService, IngestionResponse, PresignedUrlResponse } from "../../../services/document.service";
import { AxiosHeaders, AxiosResponse } from "axios";
import { HistoryService } from "../../../services/history.service";
import { CaseHistory } from "../../../enums/caseHistory";
import exp from "constants";
import { ClientService } from "../../../services/client.service";
import { CaseService } from "../../../services/case.service";
import { CaseStatus } from "../../../enums/caseStatus";

jest.mock("@auth0/auth0-react");

const mockLoginWithRedirect = jest.fn();
const mockLogout = jest.fn();
jest.mock("uuid", () => ({ v4: () => "123456789" }));

let mockDocumentPresignedUrlService: jest.SpyInstance;
let mockDocumentUploadService: jest.SpyInstance;
let mockDocumentTriggerIngestionService: jest.SpyInstance;
let mockHistoryService: jest.SpyInstance;
let mockAddClientService: jest.SpyInstance;
let mockAddCaseService: jest.SpyInstance;

const mockTime = "2021-09-01T00:00:00.000Z";

describe("Upload Component Tests", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { authGroups: ["Admin", "Worker"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
      loginWithRedirect: mockLoginWithRedirect,
      logout: mockLogout,
      isAuthenticated: true,
      getAccessTokenSilently: jest.fn().mockResolvedValue("testToken"),
    });

    mockAddClientService = jest.spyOn(ClientService.prototype, "addClient").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: {},
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });

    mockAddCaseService = jest.spyOn(CaseService.prototype, "addCase").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: {},
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });

    mockDocumentPresignedUrlService = jest.spyOn(DocumentService.prototype, "getPresignedUrl").mockImplementation(() => {
      return new Promise<AxiosResponse<PresignedUrlResponse>>((resolve) => {
        resolve({
          data: { presignedUrl: "https://testpresignedurl.com", key: "testKey" },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });

    mockDocumentUploadService = jest.spyOn(DocumentService.prototype, "uploadDocument").mockImplementation(() => {
      return new Promise((resolve) => {
        resolve();
      });
    });

    mockDocumentTriggerIngestionService = jest.spyOn(DocumentService.prototype, "triggerIngestion").mockImplementation(() => {
      return new Promise<AxiosResponse<IngestionResponse>>((resolve) => {
        resolve({
          data: { executionArn: "testExecutionArn" },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });

    jest.useFakeTimers().setSystemTime(new Date(mockTime));

    mockHistoryService = jest.spyOn(HistoryService.prototype, "addHistory").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: {},
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Upload component renders without crashing", () => {
    render(<Upload />);
  });

  describe("When the user is logged in", () => {
    test("it renders the uploadCard", async () => {
      render(<Upload />);
      await waitFor(() => {
        expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
      });
      expect(screen.getByTestId("uploadCard")).toBeInTheDocument();
    });

    test("it renders the case selection page", async () => {
      render(<Upload />);
      await waitFor(() => {
        expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
      });
      expect(screen.getByText("Is this a new or existing case?")).toBeInTheDocument();
      const newCaseButton = screen.getByRole("button", { name: /New/i });
      const existingCaseButton = screen.getByRole("button", { name: /Existing/i });
      expect(newCaseButton).toBeInTheDocument();
      expect(existingCaseButton).toBeInTheDocument();
    });

    describe("When the user selects a new case type", () => {
      describe("When it renders the client information page", () => {
        test("It renders the correct elements", async () => {
          render(<Upload />);
          await waitFor(() => {
            expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
          });
          const newCaseButton = screen.getByRole("button", { name: /New/i });
          await waitFor(() => {
            newCaseButton.click();
          });
          const clientInformationForm = screen.getByTestId("clientInformationForm");
          expect(clientInformationForm).toBeInTheDocument();

          const stepButtons = screen.getAllByTestId("stepButton");
          expect(stepButtons).toHaveLength(3);

          expect(within(clientInformationForm).getByText("Client Information")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("First name")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("Last name")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("Address Line 1")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("Address Line 2")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("Postcode")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("County")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("City")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("Phone Number")).toBeInTheDocument();
          expect(within(clientInformationForm).getByText("Email Address")).toBeInTheDocument();

          expect(within(clientInformationForm).getByPlaceholderText("First name")).toBeInTheDocument();
          expect(within(clientInformationForm).getByPlaceholderText("Last name")).toBeInTheDocument();
          expect(within(clientInformationForm).getByPlaceholderText("Apartment 2")).toBeInTheDocument();
          expect(within(clientInformationForm).getByPlaceholderText("111 Apartment Building")).toBeInTheDocument();
          expect(within(clientInformationForm).getByPlaceholderText("BT11 1AB")).toBeInTheDocument();
          expect(within(clientInformationForm).getByPlaceholderText("Antrim")).toBeInTheDocument();
          expect(within(clientInformationForm).getByPlaceholderText("Belfast")).toBeInTheDocument();
          expect(within(clientInformationForm).getByPlaceholderText("0123456789")).toBeInTheDocument();
          expect(within(clientInformationForm).getByPlaceholderText("john@test.com")).toBeInTheDocument();

          expect(within(clientInformationForm).getByTestId("nextButton")).toBeInTheDocument();
        });

        describe("When the user fills in the client information form correctly", () => {
          test("It allows the user to navigate to the case information page", async () => {
            render(<Upload />);
            await waitFor(() => {
              expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
            });
            const newCaseButton = screen.getByRole("button", { name: /New/i });
            await waitFor(() => {
              newCaseButton.click();
            });

            validClientInfoFormSteps();

            await waitFor(() => {
              const caseInformationForm = screen.getByTestId("caseInformationForm");
              expect(caseInformationForm).toBeInTheDocument();
            });
          });
        });

        describe("When the user fills in the client information form incorrectly", () => {
          test("It does not allow the user to navigate to the case information page and it displays an error", async () => {
            render(<Upload />);
            await waitFor(() => {
              expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
            });
            const newCaseButton = screen.getByRole("button", { name: /New/i });
            await waitFor(() => {
              newCaseButton.click();
            });
            const clientInformationForm = screen.getByTestId("clientInformationForm");

            const firstNameInput = within(clientInformationForm).getByPlaceholderText("First name") as HTMLInputElement;
            userEvent.type(firstNameInput, "John");

            const lastNameInput = within(clientInformationForm).getByPlaceholderText("Last name") as HTMLInputElement;
            userEvent.type(lastNameInput, "Doe");

            const addressLine1Input = within(clientInformationForm).getByPlaceholderText("Apartment 2") as HTMLInputElement;
            userEvent.type(addressLine1Input, "123 Main Street");

            const addressLine2Input = within(clientInformationForm).getByPlaceholderText("111 Apartment Building") as HTMLInputElement;
            userEvent.type(addressLine2Input, "Apt 2");

            const postcodeInput = within(clientInformationForm).getByPlaceholderText("BT11 1AB") as HTMLInputElement;
            userEvent.type(postcodeInput, "BT11 1AB");

            const countyInput = within(clientInformationForm).getByPlaceholderText("Antrim") as HTMLInputElement;
            userEvent.type(countyInput, "Antrim");

            const cityInput = within(clientInformationForm).getByPlaceholderText("Belfast") as HTMLInputElement;
            userEvent.type(cityInput, "Belfast");

            const phoneNumberInput = within(clientInformationForm).getByPlaceholderText("0123456789") as HTMLInputElement;
            userEvent.type(phoneNumberInput, "0123456789");

            const nextButton = within(clientInformationForm).getByTestId("nextButton");
            userEvent.click(nextButton);

            await waitFor(() => {
              expect(screen.queryByTestId("caseInformationForm")).not.toBeInTheDocument();
            });

            expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();
          });
        });
      });

      describe("When it renders the case information page", () => {
        test("It renders the correct elements", async () => {
          render(<Upload />);
          await waitFor(() => {
            expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
          });
          const newCaseButton = screen.getByRole("button", { name: /New/i });
          await waitFor(() => {
            newCaseButton.click();
          });

          validClientInfoFormSteps();

          let caseInformationForm = screen.getByTestId("caseInformationForm");
          await waitFor(() => {
            caseInformationForm = screen.getByTestId("caseInformationForm");
            expect(caseInformationForm).toBeInTheDocument();
          });

          expect(within(caseInformationForm).getByText("Case Information")).toBeInTheDocument();
          expect(within(caseInformationForm).getByText("What is the nature of the case?")).toBeInTheDocument();
          expect(within(caseInformationForm).getByText("Description of case")).toBeInTheDocument();
          expect(within(caseInformationForm).getByText("Date")).toBeInTheDocument();

          const natureSelect = within(caseInformationForm).getByRole("combobox");
          expect(natureSelect).toBeInTheDocument();
          expect(natureSelect).toHaveValue("Property");

          const descriptionInput = within(caseInformationForm).getByRole("textbox");
          expect(descriptionInput).toBeInTheDocument();
          expect(descriptionInput).toHaveValue("");

          const dateInput = within(caseInformationForm).getByTestId("dateInput");
          expect(dateInput).toBeInTheDocument();

          const nextButton = within(caseInformationForm).getByTestId("nextButton");
          expect(nextButton).toBeInTheDocument();
        });

        describe("When the user fills in the case information form correctly", () => {
          test("It allows the user to navigate to the upload form", async () => {
            render(
              <BrowserRouter>
                <Upload />
              </BrowserRouter>
            );
            await waitFor(() => {
              expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
            });
            const newCaseButton = screen.getByRole("button", { name: /New/i });
            await waitFor(() => {
              newCaseButton.click();
            });

            validClientInfoFormSteps();
            validCaseInfoFormSteps();

            await waitFor(() => {
              const uploadForm = screen.getByTestId("uploadForm");
              expect(uploadForm).toBeInTheDocument();
            });
          });
        });

        describe("When the user fills in the case information form incorrectly", () => {
          test("It does not allow the user to navigate to the upload form and it displays an error", async () => {
            render(
              <BrowserRouter>
                <Upload />
              </BrowserRouter>
            );
            await waitFor(() => {
              expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
            });
            const newCaseButton = screen.getByRole("button", { name: /New/i });
            await waitFor(() => {
              newCaseButton.click();
            });

            validClientInfoFormSteps();

            let caseInformationForm = screen.getByTestId("caseInformationForm");
            await waitFor(() => {
              caseInformationForm = screen.getByTestId("caseInformationForm");
              expect(caseInformationForm).toBeInTheDocument();
            });

            const natureSelect = within(caseInformationForm).getByRole("combobox");
            userEvent.selectOptions(natureSelect, "Family");

            const descriptionInput = within(caseInformationForm).getByRole("textbox");
            userEvent.type(descriptionInput, "Test description");

            const nextButton = within(caseInformationForm).getByTestId("nextButton");
            userEvent.click(nextButton);

            await waitFor(() => {
              expect(screen.queryByTestId("uploadForm")).not.toBeInTheDocument();
            });

            expect(screen.getByText("Please provide a valid date.")).toBeInTheDocument();
          });

          test("It should show the client info page with the correct data when the step button is clicked", async () => {
            render(
              <BrowserRouter>
                <Upload />
              </BrowserRouter>
            );
            const newCaseButton = screen.getByRole("button", { name: /New/i });
            await waitFor(() => {
              newCaseButton.click();
            });

            validClientInfoFormSteps();

            const stepButtons = screen.getAllByTestId("stepButton");
            await waitFor(() => {
              stepButtons[0].click();
            });

            const clientInformationForm = screen.getByTestId("clientInformationForm");
            expect(clientInformationForm).toBeInTheDocument();
            expect(screen.getByPlaceholderText("First name")).toHaveValue("John");
            expect(screen.getByPlaceholderText("Last name")).toHaveValue("Doe");
            expect(screen.getByPlaceholderText("Apartment 2")).toHaveValue("123 Main Street");
            expect(screen.getByPlaceholderText("111 Apartment Building")).toHaveValue("Apt 2");
            expect(screen.getByPlaceholderText("BT11 1AB")).toHaveValue("BT11 1AB");
            expect(screen.getByPlaceholderText("Antrim")).toHaveValue("Antrim");
            expect(screen.getByPlaceholderText("Belfast")).toHaveValue("Belfast");
            expect(screen.getByPlaceholderText("0123456789")).toHaveValue(123456789);
            expect(screen.getByPlaceholderText("john@test.com")).toHaveValue("john@test.com");
          });
        });
      });

      describe("When it renders the document upload page", () => {
        test("It renders the correct elements", async () => {
          render(
            <BrowserRouter>
              <Upload />
            </BrowserRouter>
          );
          await waitFor(() => {
            expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
          });
          const newCaseButton = screen.getByRole("button", { name: /New/i });
          await waitFor(() => {
            newCaseButton.click();
          });

          validClientInfoFormSteps();
          validCaseInfoFormSteps();

          let uploadForm = screen.queryByTestId("uploadForm");
          await waitFor(() => {
            uploadForm = screen.getByTestId("uploadForm");
            expect(uploadForm).toBeInTheDocument();
          });

          expect(within(uploadForm!).getByText("Document Upload")).toBeInTheDocument();
          expect(within(uploadForm!).getByText("Please upload the file you wish to analyse")).toBeInTheDocument();

          const fileInput = within(uploadForm!).getByTestId("fileInput") as HTMLInputElement;
          expect(fileInput).toBeInTheDocument();
        });

        describe("When the user uploads a file", () => {
          test("It allows the user to submit the form", async () => {
            render(
              <BrowserRouter>
                <Upload />
              </BrowserRouter>
            );
            await waitFor(() => {
              expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
            });
            const newCaseButton = screen.getByRole("button", { name: /New/i });
            await waitFor(() => {
              newCaseButton.click();
            });

            validClientInfoFormSteps();
            validCaseInfoFormSteps();

            let uploadForm = screen.queryByTestId("uploadForm");
            await waitFor(() => {
              uploadForm = screen.getByTestId("uploadForm");
              expect(uploadForm).toBeInTheDocument();
            });

            const fileInput = within(uploadForm!).getByTestId("fileInput") as HTMLInputElement;
            expect(fileInput).toBeInTheDocument();

            const file = new File(["(⌐□_□)"], "test-case.pdf", {
              type: "application/pdf",
            });
            userEvent.upload(fileInput, file);
            expect(fileInput.files).toHaveLength(1);

            const submitButton = within(uploadForm!).getByRole("button", { name: /Submit Case/i });

            userEvent.click(submitButton);
            await waitFor(() => {
              expect(mockAddClientService).toHaveBeenCalledWith("testToken", {
                SK: `123456789`,
                firstName: "John",
                lastName: "Doe",
                addressLine1: "123 Main Street",
                addressLine2: "Apt 2",
                postcode: "BT11 1AB",
                county: "Antrim",
                city: "Belfast",
                phoneNumber: "0123456789",
                email: "john@test.com",
              });
            });

            await waitFor(() => {
              expect(mockAddCaseService).toHaveBeenCalledWith("testToken", {
                SK: `123456789`,
                assignee: "",
                clientId: "123456789",
                clientName: "John Doe",
                date: "2021-09-01",
                description: "Test description",
                nature: "Family",
                status: CaseStatus.OPEN,
              });
            });
            await waitFor(() => {
              expect(mockDocumentPresignedUrlService).toHaveBeenCalledWith("testToken", "123456789");
            });
            await waitFor(() => {
              expect(mockDocumentUploadService).toHaveBeenCalledWith("https://testpresignedurl.com", file);
            });
            await waitFor(() => {
              expect(mockDocumentTriggerIngestionService).toHaveBeenCalledWith("testToken", "123456789", "testKey");
            });

            await waitFor(
              () => {
                jest.advanceTimersByTime(2000);
                expect(window.location.pathname).toBe("/case/123456789");
              },
              { timeout: 3000 }
            );
          });
        });
      });
      describe("When the user hits the reset button", () => {
        test("it resets the form", async () => {
          render(
            <BrowserRouter>
              <Upload />{" "}
            </BrowserRouter>
          );
          await waitFor(() => {
            expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
          });
          let newCaseButton = screen.getByRole("button", { name: /New/i });
          await waitFor(() => {
            newCaseButton.click();
            const clientInformationForm = screen.getByTestId("clientInformationForm");
            expect(clientInformationForm).toBeInTheDocument();
          });
          const resetButton = screen.getByRole("button", { name: /Reset/i });
          userEvent.click(resetButton);

          await waitFor(() => {
            expect(screen.getByText("Is this a new or existing case?")).toBeInTheDocument();
          });

          newCaseButton = screen.getByRole("button", { name: /New/i });
          const existingCaseButton = screen.getByRole("button", { name: /Existing/i });
          expect(newCaseButton).toBeInTheDocument();
          expect(existingCaseButton).toBeInTheDocument();
        });
      });
    });
  });

  describe("When the user selects a existing case type", () => {
    test("it renders the existing case upload page", async () => {
      render(<Upload />);
      await waitFor(() => {
        expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
      });
      const existingCaseButton = screen.getByRole("button", { name: /Existing/i });
      await waitFor(() => {
        existingCaseButton.click();
      });
      const existingCaseForm = screen.getByTestId("existingCaseForm");
      expect(existingCaseForm).toBeInTheDocument();

      const stepButtons = screen.getAllByTestId("stepButton");
      expect(stepButtons).toHaveLength(1);
      stepButtons[0].click();
      expect(existingCaseForm).toBeInTheDocument();

      expect(within(existingCaseForm).getByText("Case ID")).toBeInTheDocument();
      const caseIdInput = within(existingCaseForm).getByRole("textbox");
      expect(caseIdInput).toBeInTheDocument();
      expect(caseIdInput).toHaveAttribute("placeholder", "Enter a case ID");
    });
    describe("When the user enters a valid case id into the case id input", () => {
      test("it renders the upload form and performs as expected when file is uploaded", async () => {
        render(
          <BrowserRouter>
            <Upload />{" "}
          </BrowserRouter>
        );
        await waitFor(() => {
          expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
        });
        const existingCaseButton = screen.getByRole("button", { name: /Existing/i });
        await waitFor(() => {
          existingCaseButton.click();
        });
        const caseIdInput = screen.getByPlaceholderText("Enter a case ID") as HTMLInputElement;
        userEvent.type(caseIdInput, "123");

        userEvent.clear(caseIdInput);
        expect(screen.queryByTestId("uploadForm")).not.toBeInTheDocument();

        userEvent.type(caseIdInput, "123");

        let uploadForm = screen.getByTestId("uploadForm");
        await waitFor(() => {
          uploadForm = screen.getByTestId("uploadForm");
          expect(uploadForm).toBeInTheDocument();
        });

        expect(within(uploadForm).getByText("Document Upload")).toBeInTheDocument();
        expect(within(uploadForm).getByText("Please upload the file you wish to analyse")).toBeInTheDocument();

        const fileInput = within(uploadForm).getByTestId("fileInput") as HTMLInputElement;
        expect(fileInput).toBeInTheDocument();

        const file = new File(["(⌐□_□)"], "test-case.pdf", {
          type: "application/pdf",
        });
        userEvent.upload(fileInput, file);
        expect(fileInput.files).toHaveLength(1);

        const submitButton = within(uploadForm).getByRole("button", { name: /Submit Case/i });

        userEvent.click(submitButton);
        await waitFor(() => {
          expect(mockDocumentPresignedUrlService).toHaveBeenCalledWith("testToken", "123");
        });
        await waitFor(() => {
          expect(mockDocumentUploadService).toHaveBeenCalledWith("https://testpresignedurl.com", file);
        });
        await waitFor(() => {
          expect(mockDocumentTriggerIngestionService).toHaveBeenCalledWith("testToken", "123", "testKey");
        });

        await waitFor(() => {
          expect(mockHistoryService).toHaveBeenNthCalledWith(1, "testToken", "123", { SK: `123#${mockTime}`, action: CaseHistory.OPENED, name: "John Doe", timestamp: mockTime });
        });
        expect(mockHistoryService).toHaveBeenNthCalledWith(2, "testToken", "123", { SK: `123#${mockTime}`, action: CaseHistory.DOCUMENT_UPLOADED, name: "John Doe", timestamp: mockTime });

        await waitFor(
          () => {
            jest.advanceTimersByTime(2000);
            expect(window.location.pathname).toBe("/case/123");
          },
          { timeout: 3000 }
        );
      });
    });
    describe("When the user hits the reset button", () => {
      test("it resets the form", async () => {
        render(
          <BrowserRouter>
            <Upload />{" "}
          </BrowserRouter>
        );
        await waitFor(() => {
          expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
        });
        let existingCaseButton = screen.getByRole("button", { name: /Existing/i });
        await waitFor(() => {
          existingCaseButton.click();
        });
        const caseIdInput = screen.getByPlaceholderText("Enter a case ID") as HTMLInputElement;
        userEvent.type(caseIdInput, "123");

        let uploadForm = screen.getByTestId("uploadForm");
        await waitFor(() => {
          uploadForm = screen.getByTestId("uploadForm");
          expect(uploadForm).toBeInTheDocument();
        });

        const fileInput = within(uploadForm).getByTestId("fileInput") as HTMLInputElement;
        expect(fileInput).toBeInTheDocument();

        const file = new File(["(⌐□_□)"], "test-case.pdf", {
          type: "application/pdf",
        });
        userEvent.upload(fileInput, file);
        expect(fileInput.files).toHaveLength(1);

        const resetButton = screen.getByRole("button", { name: /Reset/i });
        userEvent.click(resetButton);

        await waitFor(() => {
          expect(screen.getByText("Is this a new or existing case?")).toBeInTheDocument();
        });

        const newCaseButton = screen.getByRole("button", { name: /New/i });
        existingCaseButton = screen.getByRole("button", { name: /Existing/i });
        expect(newCaseButton).toBeInTheDocument();
        expect(existingCaseButton).toBeInTheDocument();
      });
    });
  });
});

describe("When the user is not logged in", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: null,
      loginWithRedirect: mockLoginWithRedirect,
      logout: mockLogout,
      isAuthenticated: false,
    });
  });

  test("it renders the warning message and uploadCard not rendered", () => {
    render(<Upload />);
    const warningMessage = screen.getByText("You must be a worker to upload to the Sidekick application");
    expect(warningMessage).toBeInTheDocument();
    expect(screen.queryByTestId("uploadCard")).not.toBeInTheDocument();
  });
});

describe("When an error occurs", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { authGroups: ["Admin", "Worker"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
      loginWithRedirect: mockLoginWithRedirect,
      logout: mockLogout,
      isAuthenticated: true,
      getAccessTokenSilently: jest.fn().mockResolvedValue("testToken"),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("in the upload document function", async () => {
    const error = new Error("Test error");
    mockDocumentPresignedUrlService = jest.spyOn(DocumentService.prototype, "getPresignedUrl").mockImplementation(() => {
      return new Promise<AxiosResponse<PresignedUrlResponse>>((resolve, reject) => {
        reject(error);
      });
    });

    console.error = jest.fn();

    render(
      <BrowserRouter>
        <Upload />{" "}
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
    });
    const existingCaseButton = screen.getByRole("button", { name: /Existing/i });
    await waitFor(() => {
      existingCaseButton.click();
    });
    const caseIdInput = screen.getByPlaceholderText("Enter a case ID") as HTMLInputElement;
    userEvent.type(caseIdInput, "123");

    let uploadForm = screen.getByTestId("uploadForm");
    await waitFor(() => {
      uploadForm = screen.getByTestId("uploadForm");
    });

    const fileInput = within(uploadForm).getByTestId("fileInput") as HTMLInputElement;

    const file = new File(["(⌐□_□)"], "test-case.pdf", {
      type: "application/pdf",
    });
    userEvent.upload(fileInput, file);

    const submitButton = within(uploadForm).getByRole("button", { name: /Submit Case/i });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  test("in the add case function", async () => {
    const error = new Error("Test error");
    mockAddCaseService = jest.spyOn(CaseService.prototype, "addCase").mockImplementation(() => {
      return new Promise<AxiosResponse<PresignedUrlResponse>>((resolve, reject) => {
        reject(error);
      });
    });

    console.error = jest.fn();

    render(
      <BrowserRouter>
        <Upload />{" "}
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText("You must be a worker to upload to the Sidekick application")).not.toBeInTheDocument();
    });
    const newCaseButton = screen.getByRole("button", { name: /New/i });
    await waitFor(() => {
      newCaseButton.click();
    });

    validClientInfoFormSteps();
    validCaseInfoFormSteps();

    let uploadForm = screen.queryByTestId("uploadForm");
    await waitFor(() => {
      uploadForm = screen.getByTestId("uploadForm");
    });

    const fileInput = within(uploadForm!).getByTestId("fileInput") as HTMLInputElement;

    const file = new File(["(⌐□_□)"], "test-case.pdf", {
      type: "application/pdf",
    });

    userEvent.upload(fileInput, file);

    const submitButton = within(uploadForm!).getByRole("button", { name: /Submit Case/i });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
const validClientInfoFormSteps = () => {
  const clientInformationForm = screen.getByTestId("clientInformationForm");

  const firstNameInput = within(clientInformationForm).getByPlaceholderText("First name") as HTMLInputElement;
  userEvent.type(firstNameInput, "John");

  const lastNameInput = within(clientInformationForm).getByPlaceholderText("Last name") as HTMLInputElement;
  userEvent.type(lastNameInput, "Doe");

  const addressLine1Input = within(clientInformationForm).getByPlaceholderText("Apartment 2") as HTMLInputElement;
  userEvent.type(addressLine1Input, "123 Main Street");

  const addressLine2Input = within(clientInformationForm).getByPlaceholderText("111 Apartment Building") as HTMLInputElement;
  userEvent.type(addressLine2Input, "Apt 2");

  const postcodeInput = within(clientInformationForm).getByPlaceholderText("BT11 1AB") as HTMLInputElement;
  userEvent.type(postcodeInput, "BT11 1AB");

  const countyInput = within(clientInformationForm).getByPlaceholderText("Antrim") as HTMLInputElement;
  userEvent.type(countyInput, "Antrim");

  const cityInput = within(clientInformationForm).getByPlaceholderText("Belfast") as HTMLInputElement;
  userEvent.type(cityInput, "Belfast");

  const phoneNumberInput = within(clientInformationForm).getByPlaceholderText("0123456789") as HTMLInputElement;
  userEvent.type(phoneNumberInput, "0123456789");

  const emailInput = within(clientInformationForm).getByPlaceholderText("john@test.com") as HTMLInputElement;
  userEvent.type(emailInput, "john@test.com");

  const nextButton = within(clientInformationForm).getByTestId("nextButton");
  userEvent.click(nextButton);
};

const validCaseInfoFormSteps = async () => {
  let caseInformationForm = screen.getByTestId("caseInformationForm");
  await waitFor(() => {
    caseInformationForm = screen.getByTestId("caseInformationForm");
    expect(caseInformationForm).toBeInTheDocument();
  });

  const natureSelect = within(caseInformationForm).getByRole("combobox");
  userEvent.selectOptions(natureSelect, "Family");

  const descriptionInput = within(caseInformationForm).getByRole("textbox");
  userEvent.type(descriptionInput, "Test description");

  const dateInput = within(caseInformationForm).getByTestId("dateInput") as HTMLInputElement;
  userEvent.type(dateInput, "2021-09-01");

  const nextButton = within(caseInformationForm).getByTestId("nextButton");
  userEvent.click(nextButton);
};
