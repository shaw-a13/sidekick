import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroup, Button, Form } from "react-bootstrap";
import { SearchInputProps } from "../interfaces/searchInputProps.interface";

export const SearchInput: React.FC<SearchInputProps> = ({ placeholder, ariaLabel, onChange, onClick, buttonStyle }) => (
  <InputGroup>
    <Form.Control placeholder={placeholder} aria-label={ariaLabel} onChange={onChange} />
    <Button style={buttonStyle} onClick={onClick}>
      <FontAwesomeIcon icon={faSearch} />
    </Button>
  </InputGroup>
);
