import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CaseRowProps } from "../interfaces/caseRowProps.interface";
import { CaseStatus, CaseStatusStyles } from "../../../enums/caseStatus";

export const CaseRow: React.FC<CaseRowProps> = ({ caseRecord }) => (
  <tr>
    <td>{caseRecord.SK}</td>
    <td>{caseRecord.clientName}</td>
    <td>
      <Badge bg={CaseStatusStyles[caseRecord.status as CaseStatus].style} text="light">
        {caseRecord.status}
      </Badge>
    </td>
    <td>
      <Link to={`../case/${caseRecord.SK}`}>
        <Button className="sidekick-primary-btn">View</Button>
      </Link>
    </td>
  </tr>
);
