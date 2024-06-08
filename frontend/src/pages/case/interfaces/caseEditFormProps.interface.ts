import { Case as CaseInfo } from "../../../interfaces/case/case.interface";
import { CaseEditProps } from "../../../interfaces/case/caseEditProps.interface";
import { CaseService } from "../../../services/case.service";

export interface CaseEditFormProps {
  caseInfo: CaseInfo;
  caseService: CaseService;
  accessToken: string;
  id: string;
  caseEditInfo: CaseEditProps;
  changeHandler: (event: any) => void;
}
