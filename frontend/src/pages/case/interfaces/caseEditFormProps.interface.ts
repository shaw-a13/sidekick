import { Case as CaseInfo } from "../../../interfaces/case/case.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";
import { HistoryService } from "../../../services/history.service";

export interface CaseEditFormProps {
  caseInfo: CaseInfo;
  caseService: CaseService;
  clientService: ClientService;
  historyService: HistoryService;
  accessToken: string;
  id: string;
  user: any;
}
