import { Case } from "../../../../../interfaces/case/case.interface";

export interface CaseFormFieldsProps {
  caseInfo: Case;
  handleInputChange: (event: any) => void;
}
