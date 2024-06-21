import { Dropdown, Badge } from "react-bootstrap";
import { StatusDropdownProps } from "../interfaces/statusDropdownProps.interface";
import { CaseStatus, CaseStatusStyles } from "../../../enums/caseStatus";

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ onClick, buttonStyle }) => (
  <Dropdown data-testid="statusDropdown">
    <Dropdown.Toggle style={buttonStyle}>Status</Dropdown.Toggle>
    <Dropdown.Menu>
      {Object.keys(CaseStatus).map((statusItem) => (
        <Dropdown.Item key={statusItem} onClick={() => onClick(statusItem)}>
          <Badge bg={CaseStatusStyles[statusItem as CaseStatus].style} text="light">
            {statusItem}
          </Badge>
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);
