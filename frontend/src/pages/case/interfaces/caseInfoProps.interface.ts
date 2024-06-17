import { Case as CaseInfo } from "../../../interfaces/case/case.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";

export interface CaseInfoProps {
  caseInfo: CaseInfo;
  user: any;
  caseService: CaseService;
  clientService: ClientService;
  accessToken: string;
  id: string;
}
