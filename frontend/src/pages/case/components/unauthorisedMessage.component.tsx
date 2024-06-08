import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UnauthorisedMessageProps } from "../interfaces/unauthorisedMessageProps.interface";

export const UnauthorizedMessage: React.FC<UnauthorisedMessageProps> = ({ message }) => (
  <div style={{ paddingTop: "8rem" }}>
    <div className="text-center">
      <FontAwesomeIcon className="m-3" icon={faTriangleExclamation} color="red" size="3x" />
      <h4>{message}</h4>
    </div>
  </div>
);
