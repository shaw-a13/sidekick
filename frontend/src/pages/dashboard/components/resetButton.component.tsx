import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { ResetButtonProps } from "../interfaces/resetButtonProps.interface";

export const ResetButton: React.FC<ResetButtonProps> = ({ onClick, buttonStyle }) => (
  <Button style={buttonStyle} onClick={onClick}>
    Reset
    <FontAwesomeIcon className="ms-2" icon={faUndo} />
  </Button>
);
