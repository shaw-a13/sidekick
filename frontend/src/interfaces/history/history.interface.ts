import { CaseHistory } from "../../enums/caseHistory";

export interface History {
  SK: string;
  action: CaseHistory;
  name: string;
  timestamp: string;
}
