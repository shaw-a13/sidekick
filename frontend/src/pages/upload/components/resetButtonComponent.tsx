import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { ResetButtonProps } from "../interfaces/resetButtonProps.interface";

export const ResetButton: React.FC<ResetButtonProps> = ({ setCaseSelected }) => {
  return (
    <div className="text-center">
      <Button className="m-2 sidekick-primary-btn" id="reset" onClick={() => setCaseSelected(false)}>
        Reset
        <FontAwesomeIcon className="ms-2" icon={faUndo} />
      </Button>
    </div>
  );
};
