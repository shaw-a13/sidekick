import { useAuth0 } from "@auth0/auth0-react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";
import { UploadCard } from "./uploadCard.component";
import { UserCheckProps } from "../interfaces/userCheckProps.interface";

export const UserCheck: React.FC<UserCheckProps> = ({ setCaseType, isExisting }) => {
  const { user } = useAuth0();

  return user && user["authGroups"].includes("Worker") ? (
    <UploadCard setCaseType={setCaseType} isExisting={isExisting} />
  ) : (
    <Card>
      <div className="text-center">
        <FontAwesomeIcon className="m-3" icon={faTriangleExclamation} color="red" size="3x" />
        <h4>You must be a worker to upload to the Sidekick application</h4>
      </div>
    </Card>
  );
};
