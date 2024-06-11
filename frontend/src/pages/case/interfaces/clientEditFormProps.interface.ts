import { Case as CaseInfo } from "../../../interfaces/case/case.interface";
import { Client } from "../../../interfaces/client/client.interface";
import { ClientEditProps } from "../../../interfaces/client/clientEditProps.interface";
import { CaseService } from "../../../services/case.service";
import { ClientService } from "../../../services/client.service";

export interface ClientEditFormProps {
  clientInfo: Client;
  caseService: CaseService;
  clientService: ClientService;
  accessToken: string;
  clientId: string;
  caseId: string;
  clientEditInfo: ClientEditProps;
  changeHandler: (event: any) => void;
}

