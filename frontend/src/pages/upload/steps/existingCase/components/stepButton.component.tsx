import { Button } from "react-bootstrap";
import { StepButtonProps } from "../interfaces/stepButtonProps.interface";

export const StepButton: React.FC<StepButtonProps> = ({ stepNumber, onClick, disabled = false }) => {
  const buttonClasses = `rounded-circle m-2 sidekick-primary-btn ${disabled ? "disabled" : ""}`;
  const buttonId = `step${stepNumber}`;

  return (
    <Button className={buttonClasses} id={buttonId} onClick={onClick} disabled={disabled}>
      {stepNumber + 1}
    </Button>
  );
};
