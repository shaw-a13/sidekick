import { useState } from "react";
import { Card } from "react-bootstrap";
import ExistingCase from "../steps/existingCase/existingCase";
import NewCase from "../steps/newCase/newCase";
import { ResetButton } from "./resetButtonComponent";
import { CaseSelection } from "./caseSelection.component";
import { UploadCardProps } from "../interfaces/uploadCardProps.interface";

export const UploadCard: React.FC<UploadCardProps> = ({ setCaseType, isExisting }) => {
  const [caseSelected, setCaseSelected] = useState(false);
  return (
    <Card>
      <Card.Body className="text-center">{!caseSelected && <CaseSelection setCaseSelected={setCaseSelected} setCaseType={setCaseType} />}</Card.Body>
      {!isExisting && caseSelected && <NewCase />}
      {isExisting && caseSelected && <ExistingCase />}
      {caseSelected && <ResetButton setCaseSelected={setCaseSelected} />}
    </Card>
  );
};
