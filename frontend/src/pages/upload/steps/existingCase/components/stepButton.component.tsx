import { Button } from "react-bootstrap";
import { StepButtonProps } from "../interfaces/stepButtonProps.interface";

export const StepButton: React.FC<StepButtonProps> = ({ stepNumber }) => {
  const buttonClasses = "rounded-circle m-2 sidekick-primary-btn";
  const buttonId = `step${stepNumber}`;

  return (
    <Button data-testid="stepButton" className={buttonClasses} id={buttonId}>
      {stepNumber + 1}
    </Button>
  );
};
