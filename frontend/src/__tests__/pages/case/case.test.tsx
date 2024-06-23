import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Case from "../../../pages/case/case";
import { CaseService } from "../../../services/case.service";
import { AxiosHeaders, AxiosResponse } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ClientService } from "../../../services/client.service";
import { DocumentService, IngestionResponse, PresignedUrlResponse } from "../../../services/document.service";
import { getMockExtractionResult } from "./mockExtractionResult";
import { CommentService } from "../../../services/comment.service";
import { HistoryService } from "../../../services/history.service";
import { CaseHistory } from "../../../enums/caseHistory";
import { wait } from "@testing-library/user-event/dist/utils";
import userEvent from "@testing-library/user-event";
import exp from "constants";

jest.mock("@auth0/auth0-react");

let mockGetSingleCase: jest.SpyInstance;
let mockGetSingleClient: jest.SpyInstance;
let mockGetDocuments: jest.SpyInstance;
let mockGetDocumentExtractionResult: jest.SpyInstance;
let mockGetComments: jest.SpyInstance;
let mockGetHistory: jest.SpyInstance;
let mockAddHistory: jest.SpyInstance;
let mockEditCaseService: jest.SpyInstance;
let mockEditClientService: jest.SpyInstance;
let mockAddComment: jest.SpyInstance;
let mockEditComment: jest.SpyInstance;
let mockDeleteComment: jest.SpyInstance;
const mockTime = new Date("2021-09-01T00:00:00.000Z");

const mockLoginWithRedirect = jest.fn();
const mockLogout = jest.fn();

const mockReload = jest.fn();

Object.defineProperty(window, "location", {
  configurable: true,
  value: { reload: mockReload },
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({ id: "12345678" }),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Case Component", () => {
  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { authGroups: ["Admin", "Worker"], picture: "https://example.com", name: "John Doe", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
      loginWithRedirect: mockLoginWithRedirect,
      logout: mockLogout,
      isAuthenticated: true,
      getAccessTokenSilently: jest.fn().mockResolvedValue("testToken"),
    });

    mockGetSingleCase = jest.spyOn(CaseService.prototype, "getSingleCase").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: {
            SK: "12345678",
            clientId: "56789",
            clientName: "John Doe",
            status: "OPEN",
            description: "Test Description",
            nature: "Property",
            date: "2021-09-01",
            assignee: "",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });
    mockGetSingleClient = jest.spyOn(ClientService.prototype, "getSingleClient").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: {
            SK: "56789",
            firstName: "John",
            lastName: "Doe",
            addressLine1: "123 Test St",
            addressLine2: "",
            postcode: "12345",
            county: "Test County",
            city: "Test City",
            phoneNumber: "1234567890",
            email: "john@test.com",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });
    mockGetDocuments = jest.spyOn(DocumentService.prototype, "getDocuments").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: {
            urls: [
              {
                original: "https://example.com/original1234567.pdf",
                processed: "https://example.com/processed12345667.json",
              },
              {
                original: "https://example.com/original874747383.pdf",
                processed: "https://example.com/processed874747383.json",
              },
            ],
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });

    mockGetDocumentExtractionResult = jest.spyOn(DocumentService.prototype, "getDocumentExtractionResult").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: getMockExtractionResult(),
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });

    mockGetComments = jest.spyOn(CommentService.prototype, "getAllComments").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: [
            {
              SK: "123456",
              name: "John Doe",
              text: "Test Comment 1",
              timestamp: "2021-09-01T00:00:02.000Z",
            },
            {
              SK: "1234567",
              name: "Jane Doe",
              text: "Test Comment 2",
              timestamp: "2021-09-01T00:00:01.000Z",
            },
            {
              SK: "332221",
              name: "Jack Jones",
              text: "Test Comment 3",
              timestamp: "2021-09-01T00:00:02.000Z",
            },
            {
              SK: "33399",
              name: "Jill Smith",
              text: "Test Comment 4",
              timestamp: "2021-09-01T00:00:01.000Z",
            },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });

    mockGetHistory = jest.spyOn(HistoryService.prototype, "getAllHistory").mockImplementation(() => {
      return new Promise<AxiosResponse>((resolve) => {
        resolve({
          data: [
            {
              SK: "123456",
              name: "John Doe",
              action: CaseHistory.OPENED,
              timestamp: "2021-09-01T00:00:00.100Z",
            },
            {
              SK: "1234567",
              name: "Jane Doe",
              action: CaseHistory.DOCUMENT_UPLOADED,
              timestamp: "2021-09-01T00:00:00.020Z",
            },
            {
              SK: "332221",
              name: "Jack Jones",
              action: CaseHistory.COMMENT_ADDED,
              timestamp: "2021-09-01T00:00:00.010Z",
            },
            {
              SK: "33399",
              name: "Jill Smith",
              action: CaseHistory.COMMENT_ADDED,
              timestamp: "2021-09-01T00:00:00.001Z",
            },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
        });
      });
    });

    mockAddHistory = jest.spyOn(HistoryService.prototype, "addHistory").mockImplementation(() => {
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

    mockEditCaseService = jest.spyOn(CaseService.prototype, "editCase").mockImplementation(() => {
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

    mockEditClientService = jest.spyOn(ClientService.prototype, "editClient").mockImplementation(() => {
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

    mockAddComment = jest.spyOn(CommentService.prototype, "addComment").mockImplementation(() => {
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

    mockEditComment = jest.spyOn(CommentService.prototype, "editComment").mockImplementation(() => {
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

    mockDeleteComment = jest.spyOn(CommentService.prototype, "deleteComment").mockImplementation(() => {
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

    jest.useFakeTimers().setSystemTime(mockTime);
  });

  describe("When the user is not logged in", () => {
    beforeEach(() => {
      (useAuth0 as jest.Mock).mockReturnValue({
        user: null,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
        isAuthenticated: false,
        getAccessTokenSilently: jest.fn().mockResolvedValue("testToken"),
      });
    });

    test("the authenticated error message will display", async () => {
      render(<Case />);
      await waitFor(() => {
        expect(screen.getByText("You must be authenticated to view cases")).toBeInTheDocument();
      });
    });
  });

  describe("When the user is not a worker or admin", () => {
    beforeEach(() => {
      (useAuth0 as jest.Mock).mockReturnValue({
        user: { authGroups: [], picture: "https://example.com", name: "Sam Jones", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn().mockResolvedValue("testToken"),
      });
    });

    test("the authenticated error message will display", async () => {
      render(<Case />);
      await waitFor(() => {
        expect(screen.getByText("You must be a worker to view cases not relating to yourself")).toBeInTheDocument();
      });
    });
  });

  describe("When the user is authenticated and admin", () => {
    test("the case component will render", async () => {
      render(<Case />);
      await waitFor(() => {
        expect(screen.getByText("Document Extractions")).toBeInTheDocument();
      });
      expect(screen.getByText("Comments")).toBeInTheDocument();
    });

    test("the case component will render with the document viewer section", async () => {
      render(<Case />);
      await waitFor(() => {
        expect(screen.getByText("Case Documents")).toBeInTheDocument();
      });

      const documentUploadBtn = screen.getByTestId("documentUploadBtn");
      expect(documentUploadBtn).toBeInTheDocument();
      expect(documentUploadBtn).toBeEnabled();

      const documentViewerBtns = screen.queryAllByTestId("documentViewerBtn");
      expect(documentViewerBtns).toHaveLength(2);

      let documentIframe = screen.getByTitle("pdf-viewer");
      expect(documentIframe).toBeInTheDocument();
      expect(documentIframe).toHaveAttribute("src", "https://example.com/original1234567.pdf");

      documentViewerBtns[1].click();
      await waitFor(() => {
        documentIframe = screen.getByTitle("pdf-viewer");
        expect(documentIframe).toHaveAttribute("src", "https://example.com/original874747383.pdf");
      });
    });

    test("the case component will render with the correct case information", async () => {
      render(<Case />);
      await waitFor(() => {
        expect(screen.getByText("Client Name: John Doe")).toBeInTheDocument();
      });
      expect(screen.getByText("Nature: Property")).toBeInTheDocument();
      expect(screen.getByText("Date: 2021-09-01")).toBeInTheDocument();
      expect(screen.getByText("OPEN")).toBeInTheDocument();
      expect(screen.getByText("Assignee:")).toBeInTheDocument();
      expect(screen.getByText("Client ID: 56789")).toBeInTheDocument();

      expect(screen.getByTestId("assignToMeBtn")).toBeInTheDocument();
    });

    test("the case component will render with the correct client information", async () => {
      render(<Case />);
      let caseInfoPaginator = screen.queryAllByTestId("caseInfoPaginator");
      await waitFor(() => {
        caseInfoPaginator = screen.getAllByTestId("caseInfoPaginator");
        expect(caseInfoPaginator).toHaveLength(2);
      });
      caseInfoPaginator[1].click();
      await waitFor(() => {
        expect(screen.getByText("Client Name: John Doe")).toBeInTheDocument();
      });
      expect(screen.getByText("Address Line 1: 123 Test St")).toBeInTheDocument();
      expect(screen.getByText("Address Line 2:")).toBeInTheDocument();
      expect(screen.getByText("City: Test City")).toBeInTheDocument();
      expect(screen.getByText("County: Test County")).toBeInTheDocument();
      expect(screen.getByText("Postcode: 12345")).toBeInTheDocument();
      expect(screen.getByText("Email: john@test.com")).toBeInTheDocument();
      expect(screen.getByText("Phone Number: 1234567890")).toBeInTheDocument();
    });

    test("the case component will render with the correct history", async () => {
      render(<Case />);
      let caseHistorySection = screen.queryByTestId("caseHistory");
      await waitFor(() => {
        caseHistorySection = screen.getByTestId("caseHistory");
        expect(caseHistorySection).toBeInTheDocument();
      });
      expect(within(caseHistorySection!).getByText("History")).toBeInTheDocument();

      const historyPaginator = screen.getAllByTestId("historyPaginator");
      expect(historyPaginator).toHaveLength(2);

      let historyItems = within(caseHistorySection!).getAllByTestId("history");
      expect(historyItems).toHaveLength(3);

      expect(within(historyItems[0]).getByText(CaseHistory.OPENED)).toBeInTheDocument();
      expect(within(historyItems[0]).getByText("John Doe")).toBeInTheDocument();
      expect(within(historyItems[0]).getByText("Wed Sep 01 2021 | 1:00:00 AM")).toBeInTheDocument();

      expect(within(historyItems[1]).getByText(CaseHistory.DOCUMENT_UPLOADED)).toBeInTheDocument();
      expect(within(historyItems[1]).getByText("Jane Doe")).toBeInTheDocument();
      expect(within(historyItems[1]).getByText("Wed Sep 01 2021 | 1:00:00 AM")).toBeInTheDocument();

      expect(within(historyItems[2]).getByText(CaseHistory.COMMENT_ADDED)).toBeInTheDocument();
      expect(within(historyItems[2]).getByText("Jack Jones")).toBeInTheDocument();
      expect(within(historyItems[2]).getByText("Wed Sep 01 2021 | 1:00:00 AM")).toBeInTheDocument();

      historyPaginator[1].click();
      await waitFor(() => {
        historyItems = within(caseHistorySection!).getAllByTestId("history");
        expect(historyItems).toHaveLength(1);
      });
      expect(within(historyItems[0]).getByText(CaseHistory.COMMENT_ADDED)).toBeInTheDocument();
      expect(within(historyItems[0]).getByText("Jill Smith")).toBeInTheDocument();
      expect(within(historyItems[0]).getByText("Wed Sep 01 2021 | 1:00:00 AM")).toBeInTheDocument();
    });

    test("the case component will render with the correct document extractions", async () => {
      render(<Case />);
      let documentExtractions = screen.queryByTestId("documentExtractions");
      await waitFor(() => {
        documentExtractions = screen.getByTestId("documentExtractions");
        expect(documentExtractions).toBeInTheDocument();
      });
      expect(within(documentExtractions!).getByText("Document Extractions")).toBeInTheDocument();

      const extractionPaginator = screen.getAllByTestId("extractionPaginator");
      expect(extractionPaginator).toHaveLength(2);

      let extractionTable = within(documentExtractions!).getByTestId("extractionTable");
      expect(extractionTable).toBeInTheDocument();

      const extractionTableHeading = within(extractionTable!).getByTestId("extractionTableHeading");
      expect(extractionTableHeading).toBeInTheDocument();
      expect(within(extractionTableHeading).getByText("Key")).toBeInTheDocument();
      expect(within(extractionTableHeading).getByText("Value")).toBeInTheDocument();
      expect(within(extractionTableHeading).getByText("Page Number")).toBeInTheDocument();
      expect(within(extractionTableHeading).getByText("Score")).toBeInTheDocument();
      expect(within(extractionTableHeading).getByText("Source")).toBeInTheDocument();

      let extractionResults = within(extractionTable!).getAllByTestId("extractionResult");
      expect(extractionResults).toHaveLength(10);

      getMockExtractionResult()
        .slice(0, 10)
        .forEach((result, index) => {
          expect(within(extractionResults[index]).getByText(result.key)).toBeInTheDocument();
          expect(within(extractionResults[index]).getByText(result.value)).toBeInTheDocument();
          expect(within(extractionResults[index]).getByText(result.locations.pageNumber)).toBeInTheDocument();
          expect(within(extractionResults[index]).getByText(result.score)).toBeInTheDocument();
          expect(within(extractionResults[index]).getByText(result.source)).toBeInTheDocument();
        });

      extractionPaginator[1].click();

      await waitFor(() => {
        extractionTable = within(documentExtractions!).getByTestId("extractionTable");
        expect(extractionTable).toBeInTheDocument();
      });

      extractionResults = within(extractionTable!).getAllByTestId("extractionResult");
      expect(extractionResults).toHaveLength(10);

      getMockExtractionResult()
        .slice(10, 20)
        .forEach((result, index) => {
          expect(within(extractionResults[index]).getByText(result.key)).toBeInTheDocument();
          expect(within(extractionResults[index]).getByText(result.value)).toBeInTheDocument();
          expect(within(extractionResults[index]).getByText(result.locations.pageNumber)).toBeInTheDocument();
          expect(within(extractionResults[index]).getByText(result.score)).toBeInTheDocument();
          expect(within(extractionResults[index]).getByText(result.source)).toBeInTheDocument();
        });
    });

    test("the case component will render with the correct description", async () => {
      render(<Case />);
      let descriptionSection = screen.queryByTestId("descriptionSection");
      await waitFor(() => {
        descriptionSection = screen.getByTestId("descriptionSection");
        expect(descriptionSection).toBeInTheDocument();
      });
      expect(within(descriptionSection!).getByText("Case Description")).toBeInTheDocument();
      expect(within(descriptionSection!).getByText("Test Description")).toBeInTheDocument();
    });

    test("the case component will render with the correct comments", async () => {
      render(<Case />);
      let commentsSection = screen.queryByTestId("commentsSection");
      await waitFor(() => {
        commentsSection = screen.getByTestId("commentsSection");
        expect(commentsSection).toBeInTheDocument();
      });
      expect(within(commentsSection!).getByText("Comments")).toBeInTheDocument();

      let commentItems = within(commentsSection!).getAllByTestId("comment");
      expect(commentItems).toHaveLength(4);

      expect(within(commentItems[0]).getByText("John Doe")).toBeInTheDocument();
      expect(within(commentItems[0]).getByText("Test Comment 1")).toBeInTheDocument();
      expect(within(commentItems[0]).getByText("Wed Sep 01 2021 | 1:00:02 AM")).toBeInTheDocument();

      expect(within(commentItems[1]).getByText("Jack Jones")).toBeInTheDocument();
      expect(within(commentItems[1]).getByText("Test Comment 3")).toBeInTheDocument();
      expect(within(commentItems[1]).getByText("Wed Sep 01 2021 | 1:00:02 AM")).toBeInTheDocument();

      expect(within(commentItems[2]).getByText("Jane Doe")).toBeInTheDocument();
      expect(within(commentItems[2]).getByText("Test Comment 2")).toBeInTheDocument();
      expect(within(commentItems[2]).getByText("Wed Sep 01 2021 | 1:00:01 AM")).toBeInTheDocument();

      expect(within(commentItems[3]).getByText("Jill Smith")).toBeInTheDocument();
      expect(within(commentItems[3]).getByText("Test Comment 4")).toBeInTheDocument();
      expect(within(commentItems[3]).getByText("Wed Sep 01 2021 | 1:00:01 AM")).toBeInTheDocument();
    });
    describe("When the user clicks the upload document button", () => {
      test("the document upload modal will open and render the correct elements", async () => {
        render(<Case />);
        await waitFor(() => {
          expect(screen.getByText("Case Documents")).toBeInTheDocument();
        });
        const documentUploadBtn = screen.getByTestId("documentUploadBtn");
        documentUploadBtn.click();
        let documentUploadModal = screen.queryByTestId("documentUploadModal");
        await waitFor(() => {
          documentUploadModal = screen.getByTestId("documentUploadModal");
          expect(documentUploadModal).toBeInTheDocument();
        });

        expect(within(documentUploadModal!).getByText("Upload Document")).toBeInTheDocument();
        expect(within(documentUploadModal!).getByText("Please upload the file you wish to analyse")).toBeInTheDocument();
      });

      test("the document upload modal will close when the user clicks the hide button", async () => {
        render(<Case />);
        await waitFor(() => {
          expect(screen.getByText("Case Documents")).toBeInTheDocument();
        });
        const documentUploadBtn = screen.getByTestId("documentUploadBtn");
        documentUploadBtn.click();
        let documentUploadModal = screen.queryByTestId("documentUploadModal");
        await waitFor(() => {
          documentUploadModal = screen.getByTestId("documentUploadModal");
          expect(documentUploadModal).toBeInTheDocument();
        });

        expect(within(documentUploadModal!).getByText("Upload Document")).toBeInTheDocument();
        expect(within(documentUploadModal!).getByText("Please upload the file you wish to analyse")).toBeInTheDocument();

        const hideButton = within(documentUploadModal!).getAllByRole("button");

        hideButton[0].click();
        await waitFor(() => {
          expect(screen.queryByTestId("documentUploadModal")).not.toBeInTheDocument();
        });
      });

      test("the document will be uploaded when a valid file is uploaded", async () => {
        const mockDocumentPresignedUrlService = jest.spyOn(DocumentService.prototype, "getPresignedUrl").mockImplementation(() => {
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

        const mockDocumentUploadService = jest.spyOn(DocumentService.prototype, "uploadDocument").mockImplementation(() => {
          return new Promise((resolve) => {
            resolve();
          });
        });

        const mockDocumentTriggerIngestionService = jest.spyOn(DocumentService.prototype, "triggerIngestion").mockImplementation(() => {
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

        render(<Case />);
        await waitFor(() => {
          expect(screen.getByText("Case Documents")).toBeInTheDocument();
        });
        const documentUploadBtn = screen.getByTestId("documentUploadBtn");
        documentUploadBtn.click();
        let documentUploadModal = screen.queryByTestId("documentUploadModal");
        await waitFor(() => {
          documentUploadModal = screen.getByTestId("documentUploadModal");
          expect(documentUploadModal).toBeInTheDocument();
        });

        const fileInput = screen.getByTestId("fileInput") as HTMLInputElement;

        const file = new File(["(⌐□_□)"], "test.pdf", { type: "application/pdf" });

        userEvent.upload(fileInput, file);
        expect(fileInput.files).toHaveLength(1);

        const uploadButton = screen.getByTestId("uploadButton");

        let spinner = screen.queryByTestId("spinner");
        expect(spinner).not.toBeInTheDocument();

        uploadButton.click();

        await waitFor(() => {
          spinner = screen.getByTestId("spinner");
          expect(spinner).toBeInTheDocument();
        });

        await waitFor(() => {
          expect(mockDocumentPresignedUrlService).toHaveBeenCalledWith("testToken", "12345678");
        });

        await waitFor(() => {
          expect(mockDocumentUploadService).toHaveBeenCalledWith("https://testpresignedurl.com", file);
        });

        await waitFor(() => {
          expect(mockDocumentTriggerIngestionService).toHaveBeenCalledWith("testToken", "12345678", "testKey");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.150Z",
            action: CaseHistory.DOCUMENT_UPLOADED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.150Z",
          });
        });

        jest.advanceTimersByTime(2000);

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });
    });

    describe("When the user clicks the edit case details button", () => {
      test("the case details will be editable", async () => {
        render(<Case />);

        let caseInfoSection = screen.queryByTestId("caseInfoSection");
        await waitFor(() => {
          caseInfoSection = screen.getByTestId("caseInfoSection");
          expect(caseInfoSection).toBeInTheDocument();
        });

        const editButton = within(caseInfoSection!).getByText("Edit");

        editButton.click();

        let caseEditForm = screen.queryByTestId("caseEditForm");
        await waitFor(() => {
          caseEditForm = screen.getByTestId("caseEditForm");
          expect(caseEditForm).toBeInTheDocument();
        });

        const clientNameInput = within(caseEditForm!).getByPlaceholderText("Enter client name");
        const natureInput = within(caseEditForm!).getByPlaceholderText("Enter nature");
        const dateInput = within(caseEditForm!).getByDisplayValue("2021-09-01");
        const statusInput = within(caseEditForm!).getByText("OPEN");
        const assigneeInput = within(caseEditForm!).getByPlaceholderText("Enter assignee");
        const clientIdInput = within(caseEditForm!).getByPlaceholderText("Enter client ID");

        expect(clientNameInput).toBeInTheDocument();
        expect(natureInput).toBeInTheDocument();
        expect(dateInput).toBeInTheDocument();
        expect(statusInput).toBeInTheDocument();
        expect(assigneeInput).toBeInTheDocument();
        expect(clientIdInput).toBeInTheDocument();
      });

      test("the case details will be updated when the submit button is clicked", async () => {
        render(<Case />);

        let caseInfoSection = screen.queryByTestId("caseInfoSection");
        await waitFor(() => {
          caseInfoSection = screen.getByTestId("caseInfoSection");
          expect(caseInfoSection).toBeInTheDocument();
        });

        const editButton = within(caseInfoSection!).getByText("Edit");

        editButton.click();

        let caseEditForm = screen.queryByTestId("caseEditForm");
        await waitFor(() => {
          caseEditForm = screen.getByTestId("caseEditForm");
          expect(caseEditForm).toBeInTheDocument();
        });

        const clientNameInput = within(caseEditForm!).getByPlaceholderText("Enter client name");
        const natureInput = within(caseEditForm!).getByPlaceholderText("Enter nature");
        const dateInput = within(caseEditForm!).getByDisplayValue("2021-09-01");
        const statusInput = within(caseEditForm!).getByTestId("statusSelect");
        const assigneeInput = within(caseEditForm!).getByPlaceholderText("Enter assignee");
        const clientIdInput = within(caseEditForm!).getByPlaceholderText("Enter client ID");

        userEvent.clear(clientNameInput);
        userEvent.type(clientNameInput, "Zac Efron");

        userEvent.clear(natureInput);
        userEvent.type(natureInput, "Criminal");

        userEvent.clear(dateInput);
        userEvent.type(dateInput, "2021-09-02");

        userEvent.clear(assigneeInput);
        userEvent.type(assigneeInput, "Jane Jones");

        userEvent.selectOptions(statusInput, "ACTIVE");

        userEvent.clear(clientIdInput);
        userEvent.type(clientIdInput, "56789");

        const submitButton = within(caseEditForm!).getByText("Submit");

        submitButton.click();

        await waitFor(() => {
          expect(mockEditCaseService).toHaveBeenCalledWith(
            "testToken",
            { assignee: "Jane Jones", clientId: "56789", clientName: "Zac Efron", date: "2021-09-02", nature: "Criminal", status: "ACTIVE" },
            "12345678"
          );
        });

        await waitFor(() => {
          expect(mockEditClientService).toHaveBeenCalledWith("testToken", { firstName: "Zac", lastName: "Efron" }, "56789");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.100Z",
            action: CaseHistory.DETAILS_EDITED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.100Z",
          });
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });
    });

    describe("When the user clicks the edit client details button", () => {
      test("the client details will be editable", async () => {
        render(<Case />);

        let caseInfoPaginator = screen.queryAllByTestId("caseInfoPaginator");
        await waitFor(() => {
          caseInfoPaginator = screen.getAllByTestId("caseInfoPaginator");
          expect(caseInfoPaginator).toHaveLength(2);
        });
        caseInfoPaginator[1].click();

        let clientInfoSection = screen.queryByTestId("clientInfoSection");
        await waitFor(() => {
          clientInfoSection = screen.getByTestId("clientInfoSection");
          expect(clientInfoSection).toBeInTheDocument();
        });

        const editButton = within(clientInfoSection!).getByText("Edit");

        editButton.click();

        let clientEditForm = screen.queryByTestId("clientEditForm");
        await waitFor(() => {
          clientEditForm = screen.getByTestId("clientEditForm");
          expect(clientEditForm).toBeInTheDocument();
        });

        const firstNameInput = within(clientEditForm!).getByPlaceholderText("Enter first name");
        const lastNameInput = within(clientEditForm!).getByPlaceholderText("Enter last name");
        const addressLine1Input = within(clientEditForm!).getByPlaceholderText("Enter address line 1");
        const addressLine2Input = within(clientEditForm!).getByPlaceholderText("Enter address line 2");
        const cityInput = within(clientEditForm!).getByPlaceholderText("Enter city");
        const countyInput = within(clientEditForm!).getByPlaceholderText("Enter county");
        const postcodeInput = within(clientEditForm!).getByPlaceholderText("Enter postcode");
        const emailInput = within(clientEditForm!).getByPlaceholderText("Enter email");
        const phoneNumberInput = within(clientEditForm!).getByPlaceholderText("Enter phone number");

        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(addressLine1Input).toBeInTheDocument();
        expect(addressLine2Input).toBeInTheDocument();
        expect(cityInput).toBeInTheDocument();
        expect(countyInput).toBeInTheDocument();
        expect(postcodeInput).toBeInTheDocument();
        expect(phoneNumberInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
      });

      test("the client details (first name only) will be updated when the submit button is clicked", async () => {
        const mockEditClientService = jest.spyOn(ClientService.prototype, "editClient").mockImplementation(() => {
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

        render(<Case />);

        let caseInfoPaginator = screen.queryAllByTestId("caseInfoPaginator");
        await waitFor(() => {
          caseInfoPaginator = screen.getAllByTestId("caseInfoPaginator");
          expect(caseInfoPaginator).toHaveLength(2);
        });
        caseInfoPaginator[1].click();

        let clientInfoSection = screen.queryByTestId("clientInfoSection");
        await waitFor(() => {
          clientInfoSection = screen.getByTestId("clientInfoSection");
          expect(clientInfoSection).toBeInTheDocument();
        });

        const editButton = within(clientInfoSection!).getByText("Edit");

        editButton.click();

        let clientEditForm = screen.queryByTestId("clientEditForm");
        await waitFor(() => {
          clientEditForm = screen.getByTestId("clientEditForm");
          expect(clientEditForm).toBeInTheDocument();
        });

        const firstNameInput = within(clientEditForm!).getByPlaceholderText("Enter first name");

        userEvent.clear(firstNameInput);
        userEvent.type(firstNameInput, "Zac");

        const submitButton = within(clientEditForm!).getByText("Submit");

        submitButton.click();

        await waitFor(() => {
          expect(mockEditClientService).toHaveBeenCalledWith("testToken", { firstName: "Zac" }, "56789");
        });

        await waitFor(() => {
          expect(mockEditCaseService).toHaveBeenCalledWith("testToken", { clientName: "Zac Doe" }, "12345678");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.150Z",
            action: CaseHistory.CLIENT_EDITED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.150Z",
          });
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });

      test("the client details (last name only) will be updated when the submit button is clicked", async () => {
        const mockEditClientService = jest.spyOn(ClientService.prototype, "editClient").mockImplementation(() => {
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

        render(<Case />);

        let caseInfoPaginator = screen.queryAllByTestId("caseInfoPaginator");
        await waitFor(() => {
          caseInfoPaginator = screen.getAllByTestId("caseInfoPaginator");
          expect(caseInfoPaginator).toHaveLength(2);
        });
        caseInfoPaginator[1].click();

        let clientInfoSection = screen.queryByTestId("clientInfoSection");
        await waitFor(() => {
          clientInfoSection = screen.getByTestId("clientInfoSection");
          expect(clientInfoSection).toBeInTheDocument();
        });

        const editButton = within(clientInfoSection!).getByText("Edit");

        editButton.click();

        let clientEditForm = screen.queryByTestId("clientEditForm");
        await waitFor(() => {
          clientEditForm = screen.getByTestId("clientEditForm");
          expect(clientEditForm).toBeInTheDocument();
        });

        const lastNameInput = within(clientEditForm!).getByPlaceholderText("Enter last name");

        userEvent.clear(lastNameInput);
        userEvent.type(lastNameInput, "Efron");

        const submitButton = within(clientEditForm!).getByText("Submit");

        submitButton.click();

        await waitFor(() => {
          expect(mockEditClientService).toHaveBeenCalledWith("testToken", { lastName: "Efron" }, "56789");
        });

        await waitFor(() => {
          expect(mockEditCaseService).toHaveBeenCalledWith("testToken", { clientName: "John Efron" }, "12345678");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.150Z",
            action: CaseHistory.CLIENT_EDITED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.150Z",
          });
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });

      test("the client details (first and last name) will be updated when the submit button is clicked", async () => {
        const mockEditClientService = jest.spyOn(ClientService.prototype, "editClient").mockImplementation(() => {
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

        render(<Case />);

        let caseInfoPaginator = screen.queryAllByTestId("caseInfoPaginator");
        await waitFor(() => {
          caseInfoPaginator = screen.getAllByTestId("caseInfoPaginator");
          expect(caseInfoPaginator).toHaveLength(2);
        });
        caseInfoPaginator[1].click();

        let clientInfoSection = screen.queryByTestId("clientInfoSection");
        await waitFor(() => {
          clientInfoSection = screen.getByTestId("clientInfoSection");
          expect(clientInfoSection).toBeInTheDocument();
        });

        const editButton = within(clientInfoSection!).getByText("Edit");

        editButton.click();

        let clientEditForm = screen.queryByTestId("clientEditForm");
        await waitFor(() => {
          clientEditForm = screen.getByTestId("clientEditForm");
          expect(clientEditForm).toBeInTheDocument();
        });

        const firstNameInput = within(clientEditForm!).getByPlaceholderText("Enter first name");
        const lastNameInput = within(clientEditForm!).getByPlaceholderText("Enter last name");

        userEvent.clear(firstNameInput);
        userEvent.type(firstNameInput, "Zac");

        userEvent.clear(lastNameInput);
        userEvent.type(lastNameInput, "Efron");

        const submitButton = within(clientEditForm!).getByText("Submit");

        submitButton.click();

        await waitFor(() => {
          expect(mockEditClientService).toHaveBeenCalledWith("testToken", { firstName: "Zac", lastName: "Efron" }, "56789");
        });

        await waitFor(() => {
          expect(mockEditCaseService).toHaveBeenCalledWith("testToken", { clientName: "Zac Efron" }, "12345678");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.150Z",
            action: CaseHistory.CLIENT_EDITED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.150Z",
          });
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });
    });

    describe("When the user clicks the assign to me button", () => {
      test("the case will be assigned to the user", async () => {
        render(<Case />);

        let caseInfoSection = screen.queryByTestId("caseInfoSection");
        await waitFor(() => {
          caseInfoSection = screen.getByTestId("caseInfoSection");
          expect(caseInfoSection).toBeInTheDocument();
        });

        const assignToMeBtn = screen.getByTestId("assignToMeBtn");

        assignToMeBtn.click();

        await waitFor(() => {
          expect(mockEditCaseService).toHaveBeenCalledWith("testToken", { assignee: "John Doe", status: "ACTIVE" }, "12345678");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenNthCalledWith(1, "testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.050Z",
            action: CaseHistory.DETAILS_EDITED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.050Z",
          });
        });

        expect(mockAddHistory).toHaveBeenNthCalledWith(2, "testToken", "12345678", {
          SK: "12345678#2021-09-01T00:00:00.050Z",
          action: CaseHistory.ASSIGNED,
          name: "John Doe",
          timestamp: "2021-09-01T00:00:00.050Z",
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });
    });

    describe("When the user clicks the add comment button", () => {
      test("the comment will be added to the case", async () => {
        render(<Case />);

        let commentsSection = screen.queryByTestId("commentsSection");
        await waitFor(() => {
          commentsSection = screen.getByTestId("commentsSection");
          expect(commentsSection).toBeInTheDocument();
        });

        const addCommentBtn = screen.getByTestId("addCommentButton");

        addCommentBtn.click();

        let commentForm = screen.queryByTestId("commentForm");
        await waitFor(() => {
          commentForm = screen.getByTestId("commentForm");
          expect(commentForm).toBeInTheDocument();
        });

        const commentInput = within(commentForm!).getByPlaceholderText("Add new comment");

        userEvent.type(commentInput, "Test Comment");

        const submitButton = within(commentForm!).getByText("Submit");

        submitButton.click();

        await waitFor(() => {
          expect(mockAddComment).toHaveBeenCalledWith(
            "testToken",
            { SK: "12345678#2021-09-01T00:00:00.100Z", name: "John Doe", text: "Test Comment", timestamp: "2021-09-01T00:00:00.100Z" },
            "12345678"
          );
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.100Z",
            action: CaseHistory.COMMENT_ADDED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.100Z",
          });
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });
    });
    describe("When the user clicks the edit comment button", () => {
      test("the comment will be edited", async () => {
        render(<Case />);

        let commentsSection = screen.queryByTestId("commentsSection");
        await waitFor(() => {
          commentsSection = screen.getByTestId("commentsSection");
          expect(commentsSection).toBeInTheDocument();
        });

        const editCommentBtn = screen.getAllByTestId("editCommentButton");

        editCommentBtn[0].click();

        let commentEditForm = screen.queryByTestId("commentEditForm");
        await waitFor(() => {
          commentEditForm = screen.getByTestId("commentEditForm");
          expect(commentEditForm).toBeInTheDocument();
        });

        const commentInput = within(commentEditForm!).getByPlaceholderText("Edit comment");

        userEvent.clear(commentInput);
        userEvent.type(commentInput, "Edited Comment");

        const submitButton = within(commentEditForm!).getByText("Submit");

        submitButton.click();

        await waitFor(() => {
          expect(mockEditComment).toHaveBeenCalledWith("testToken", { text: "Edited Comment" }, "12345678", "2021-09-01T00:00:02.000Z");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.100Z",
            action: CaseHistory.COMMENT_EDITED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.100Z",
          });
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });
    });
    describe("When the user clicks the delete comment button", () => {
      test("the comment will be deleted", async () => {
        render(<Case />);

        let commentsSection = screen.queryByTestId("commentsSection");
        await waitFor(() => {
          commentsSection = screen.getByTestId("commentsSection");
          expect(commentsSection).toBeInTheDocument();
        });

        const deleteCommentBtn = screen.getAllByTestId("deleteCommentButton");

        deleteCommentBtn[0].click();

        await waitFor(() => {
          expect(mockDeleteComment).toHaveBeenCalledWith("testToken", "12345678", "2021-09-01T00:00:02.000Z");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.050Z",
            action: CaseHistory.COMMENT_DELETED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.050Z",
          });
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });
    });

    describe("When the user clicks the edit description button", () => {
      test("the description will be editable", async () => {
        render(<Case />);

        let descriptionSection = screen.queryByTestId("descriptionSection");
        await waitFor(() => {
          descriptionSection = screen.getByTestId("descriptionSection");
          expect(descriptionSection).toBeInTheDocument();
        });

        const editButton = within(descriptionSection!).getByText("Edit");

        editButton.click();

        let descriptionEditForm = screen.queryByRole("descriptionEditForm");
        await waitFor(() => {
          descriptionEditForm = screen.getByTestId("descriptionEditForm");
          expect(descriptionEditForm).toBeInTheDocument();
        });

        const descriptionInput = within(descriptionEditForm!).getByRole("textbox");

        expect(descriptionInput).toBeInTheDocument();
      });

      test("the description will be updated when the submit button is clicked", async () => {
        render(<Case />);

        let descriptionSection = screen.queryByTestId("descriptionSection");
        await waitFor(() => {
          descriptionSection = screen.getByTestId("descriptionSection");
          expect(descriptionSection).toBeInTheDocument();
        });

        const editButton = within(descriptionSection!).getByText("Edit");

        editButton.click();

        let descriptionEditForm = screen.queryByRole("descriptionEditForm");
        await waitFor(() => {
          descriptionEditForm = screen.getByTestId("descriptionEditForm");
          expect(descriptionEditForm).toBeInTheDocument();
        });

        const descriptionInput = within(descriptionEditForm!).getByRole("textbox");
        userEvent.clear(descriptionInput);
        userEvent.type(descriptionInput, "Edited Description");

        const submitButton = within(descriptionEditForm!).getByText("Submit");

        submitButton.click();

        await waitFor(() => {
          expect(mockEditCaseService).toHaveBeenCalledWith("testToken", { description: "Edited Description" }, "12345678");
        });

        await waitFor(() => {
          expect(mockAddHistory).toHaveBeenCalledWith("testToken", "12345678", {
            SK: "12345678#2021-09-01T00:00:00.100Z",
            action: CaseHistory.DESCRIPTION_EDITED,
            name: "John Doe",
            timestamp: "2021-09-01T00:00:00.100Z",
          });
        });

        await waitFor(() => {
          expect(mockReload).toHaveBeenCalled();
        });
      });
    });
  });

  describe("When the user is authenticated but not assigned to the case", () => {
    beforeEach(() => {
      (useAuth0 as jest.Mock).mockReturnValue({
        user: { authGroups: ["Worker"], picture: "https://example.com", name: "Sam Jones", sub: "123", nickname: "JD", updated_at: "2021-09-01" },
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn().mockResolvedValue("testToken"),
      });

      mockGetSingleCase = jest.spyOn(CaseService.prototype, "getSingleCase").mockImplementation(() => {
        return new Promise<AxiosResponse>((resolve) => {
          resolve({
            data: {
              SK: "12345678",
              clientId: "56789",
              clientName: "John Doe",
              status: "ACTIVE",
              description: "Test Description",
              nature: "Property",
              date: "2021-09-01",
              assignee: "Jack Smith",
            },
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
    test("the user will not be able to upload a document", async () => {
      render(<Case />);
      await waitFor(() => {
        expect(screen.getByText("Case Documents")).toBeInTheDocument();
      });

      const documentUploadBtn = screen.getByTestId("documentUploadBtn");
      expect(documentUploadBtn).toBeInTheDocument();
      expect(documentUploadBtn).toBeDisabled();
    });

    test("the user will not be able to edit the case details", async () => {
      render(<Case />);

      let caseInfoSection = screen.queryByTestId("caseInfoSection");
      await waitFor(() => {
        caseInfoSection = screen.getByTestId("caseInfoSection");
        expect(caseInfoSection).toBeInTheDocument();
      });

      const editButton = within(caseInfoSection!).getByText("Edit");

      expect(editButton).toBeDisabled();
    });

    test("the user will not be able to edit the client details", async () => {
      render(<Case />);

      let caseInfoPaginator = screen.queryAllByTestId("caseInfoPaginator");
      await waitFor(() => {
        caseInfoPaginator = screen.getAllByTestId("caseInfoPaginator");
        expect(caseInfoPaginator).toHaveLength(2);
      });
      caseInfoPaginator[1].click();

      let clientInfoSection = screen.queryByTestId("clientInfoSection");
      await waitFor(() => {
        clientInfoSection = screen.getByTestId("clientInfoSection");
        expect(clientInfoSection).toBeInTheDocument();
      });

      const editButton = within(clientInfoSection!).getByText("Edit");

      expect(editButton).toBeDisabled();
    });

    test("the user will not be able to assign the case to themselves", async () => {
      render(<Case />);

      let caseInfoSection = screen.queryByTestId("caseInfoSection");
      await waitFor(() => {
        caseInfoSection = screen.getByTestId("caseInfoSection");
        expect(caseInfoSection).toBeInTheDocument();
      });

      expect(screen.queryByTestId("assignToMeBtn")).not.toBeInTheDocument();
    });

    test("the user will not be able to edit a comment", async () => {
      render(<Case />);

      let commentsSection = screen.queryByTestId("commentsSection");
      await waitFor(() => {
        commentsSection = screen.getByTestId("commentsSection");
        expect(commentsSection).toBeInTheDocument();
      });

      const editCommentBtns = screen.getAllByTestId("editCommentButton");

      expect(editCommentBtns).toHaveLength(4);

      editCommentBtns.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });

    test("the user will not be able to delete a comment", async () => {
      render(<Case />);

      let commentsSection = screen.queryByTestId("commentsSection");
      await waitFor(() => {
        commentsSection = screen.getByTestId("commentsSection");
        expect(commentsSection).toBeInTheDocument();
      });

      const deleteCommentBtns = screen.getAllByTestId("deleteCommentButton");

      expect(deleteCommentBtns).toHaveLength(4);

      deleteCommentBtns.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });

    test("the user will not be able to edit the description", async () => {
      render(<Case />);

      let descriptionSection = screen.queryByTestId("descriptionSection");
      await waitFor(() => {
        descriptionSection = screen.getByTestId("descriptionSection");
        expect(descriptionSection).toBeInTheDocument();
      });

      const editButton = within(descriptionSection!).getByText("Edit");

      expect(editButton).toBeDisabled();
    });
  });

  describe("When an error occurs in the updateExtractionData function during initial rendering", () => {
    test("the extractions table will be empty", async () => {
      mockGetDocumentExtractionResult = jest.spyOn(DocumentService.prototype, "getDocumentExtractionResult").mockImplementation(() => {
        return new Promise<AxiosResponse>((resolve, reject) => {
          reject(new Error("Test error"));
        });
      });

      render(<Case />);
      let documentExtractions = screen.queryByTestId("documentExtractions");
      await waitFor(() => {
        documentExtractions = screen.getByTestId("documentExtractions");
        expect(documentExtractions).toBeInTheDocument();
      });

      expect(within(documentExtractions!).getByText("Awaiting extraction results, please refresh the page")).toBeInTheDocument();
    });
  });

  describe("When an error occurs in the updateExtractionData function during rerender", () => {
    test("the extractions table will be empty", async () => {
      mockGetDocumentExtractionResult
        .mockImplementationOnce(() => {
          return new Promise<AxiosResponse>((resolve) => {
            resolve({
              data: getMockExtractionResult(),
              status: 200,
              statusText: "OK",
              headers: {},
              config: {
                headers: new AxiosHeaders(),
              },
            });
          });
        })
        .mockImplementationOnce(() => {
          return new Promise<AxiosResponse>((resolve, reject) => {
            reject(new Error("Test error"));
          });
        });

      console.error = jest.fn();

      render(<Case />);
      let documentExtractions = screen.queryByTestId("documentExtractions");
      await waitFor(() => {
        documentExtractions = screen.getByTestId("documentExtractions");
        expect(documentExtractions).toBeInTheDocument();
      });

      const documentViewerBtns = screen.queryAllByTestId("documentViewerBtn");
      expect(documentViewerBtns).toHaveLength(2);
      documentViewerBtns[1].click();

      await waitFor(() => {
        expect(within(documentExtractions!).getByText("Awaiting extraction results, please refresh the page")).toBeInTheDocument();
      });

      expect(console.error).toHaveBeenCalledWith(new Error("Test error"));
    });
  });
});
