import { Client } from "../../../interfaces/client/client.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";

export interface ClientInfoProps {
  clientInfo: Client;
  caseService: CaseService;
  clientService: ClientService;
  accessToken: string;
  caseId: string;
}
