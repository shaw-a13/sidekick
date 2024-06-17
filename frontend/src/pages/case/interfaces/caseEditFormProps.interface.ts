import { Case as CaseInfo } from "../../../interfaces/case/case.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";

export interface CaseEditFormProps {
  caseInfo: CaseInfo;
  caseService: CaseService;
  clientService: ClientService;
  accessToken: string;
  id: string;
}
