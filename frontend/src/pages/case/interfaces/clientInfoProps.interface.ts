import { Client } from "../../../interfaces/client/client.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";
import { HistoryService } from "../../../services/history.service";

export interface ClientInfoProps {
  clientInfo: Client;
  caseService: CaseService;
  clientService: ClientService;
  historyService: HistoryService;
  accessToken: string;
  caseId: string;
  assignee: string;
  user: any;
}
