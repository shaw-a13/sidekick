import { Button } from "react-bootstrap";
import { StepButtonProps } from "../interfaces/stepButtonProps.interface";

export const StepButton: React.FC<StepButtonProps> = ({ onClick, stepNo }) => (
  <Button className="rounded-circle m-2 sidekick-primary-btn" id={`step${stepNo}`} onClick={onClick} style={stepNo !== 0 ? { pointerEvents: "none" } : {}}>
    {stepNo + 1}
  </Button>
);
