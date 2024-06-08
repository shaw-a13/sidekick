import { Dropdown, Badge } from "react-bootstrap";
import { StatusDropdownProps } from "../interfaces/statusDropdownProps.interface";

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ statuses, onClick, buttonStyle }) => (
  <Dropdown>
    <Dropdown.Toggle style={buttonStyle}>Status</Dropdown.Toggle>
    <Dropdown.Menu>
      {Object.keys(statuses).map((statusItem) => (
        <Dropdown.Item onClick={() => onClick(statusItem)}>
          <Badge bg={statuses[statusItem]} text="light">
            {statusItem}
          </Badge>
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);
