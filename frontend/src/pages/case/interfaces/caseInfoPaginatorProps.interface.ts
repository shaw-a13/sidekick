import { Case } from "../../../interfaces/case/case.interface";
import { Client } from "../../../interfaces/client/client.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";

export interface CaseInfoPaginatorProps {
  caseInfo: Case;
  user: any;
  caseService: CaseService;
  clientService: ClientService;
  accessToken: string;
  clientInfo: Client;
}
