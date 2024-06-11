import { CaseEditProps } from "../../../interfaces/case/caseEditProps.interface";
import { Case as CaseInfo } from "../../../interfaces/case/case.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";

export interface CaseInfoProps {
  caseInfo: CaseInfo;
  user: any;
  setEditCaseDetails: React.Dispatch<React.SetStateAction<boolean>>;
  editCaseDetails: boolean;
  caseService: CaseService;
  clientService: ClientService;
  accessToken: string;
  id: string;
  caseEditInfo: CaseEditProps;
  handleCaseEditChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
