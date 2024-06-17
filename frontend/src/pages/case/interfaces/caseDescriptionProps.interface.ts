import { Case } from "../../../interfaces/case/case.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";

export interface CaseDescriptionProps {
  caseInfo: Case;
  user: any;
  caseService: CaseService;
  clientService: ClientService;
  accessToken: string;
}
