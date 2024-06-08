import { Case } from "../../../interfaces/case/case.interface";
import { Client } from "../../../interfaces/client/client.interface";

export interface DocumentUploadStepProps {
  clientInfo?: Client;
  caseInfo?: Case;
  caseId?: string;
  accessToken: string;
  uploadFile: File | null;
  newCase: boolean;
  uploadFileSetter: React.Dispatch<React.SetStateAction<File | null>>;
}
