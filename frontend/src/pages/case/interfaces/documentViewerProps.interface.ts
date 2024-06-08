import { Case as CaseInfo } from "../../../interfaces/case/case.interface";
import { DocumentResultResponse } from "../../../interfaces/document/documentResultResponse.interface";

export interface DocumentViewerProps {
  caseInfo: CaseInfo;
  user: any;
  docApiData: DocumentResultResponse;
  setUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateExtractionData: (docNo: number) => Promise<void>;
  setDocumentData: React.Dispatch<React.SetStateAction<string>>;
  setDocNo: React.Dispatch<React.SetStateAction<number>>;
  documentData: string;
}
