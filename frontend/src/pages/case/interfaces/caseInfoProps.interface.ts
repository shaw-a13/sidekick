import { CaseEditProps } from "../../../interfaces/case/caseEditProps.interface";
import { Case as CaseInfo } from "../../../interfaces/case/case.interface";
import { CaseService } from "../../../services/case.service";

export interface CaseInfoProps {
  caseInfo: CaseInfo;
  user: any;
  setEditCaseDetails: React.Dispatch<React.SetStateAction<boolean>>;
  editCaseDetails: boolean;
  caseService: CaseService;
  accessToken: string;
  id: string;
  caseEditInfo: CaseEditProps;
  handleCaseEditChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
