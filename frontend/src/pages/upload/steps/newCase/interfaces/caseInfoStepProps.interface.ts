import { Case } from "../../../../../interfaces/case/case.interface";

export interface CaseInfoStepProps {
  stepSetter: (step: number) => void;
  clientName: string;
  clientId: string;
  caseInfo: Case;
  caseInfoSetter: React.Dispatch<React.SetStateAction<Case>>;
}
