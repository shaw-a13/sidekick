import { Row, Col, Form } from "react-bootstrap";
import { CaseFormFieldsProps } from "../interfaces/caseFormFieldProps.interface";

const services = ["Property", "Family", "Civil", "Criminal"];

export const CaseFormFields: React.FC<CaseFormFieldsProps> = ({ caseInfo, handleInputChange }) => (
  <>
    <Row className="mb-1">
      <Form.Group as={Col} controlId="validationCustom01">
        <Form.Label>What is the nature of the case?</Form.Label>
        <Form.Select required name="nature" onChange={handleInputChange} value={caseInfo.nature}>
          {services.map((service: string) => (
            <option>{service}</option>
          ))}
        </Form.Select>
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
      </Form.Group>
    </Row>
    <Row className="mb-1">
      <Form.Group as={Col} controlId="validationCustom03">
        <Form.Label>Description of case</Form.Label>
        <Form.Control as="textarea" required type="text" placeholder="" name="description" defaultValue={caseInfo.description} onChange={handleInputChange} />
        <Form.Control.Feedback type="invalid">Please provide a valid description.</Form.Control.Feedback>
      </Form.Group>
    </Row>
    <Row className="mb-1">
      <Form.Group as={Col} controlId="validationCustom05">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" required name="date" value={caseInfo.date} onChange={handleInputChange} />
        <Form.Control.Feedback type="invalid">Please provide a valid date.</Form.Control.Feedback>
      </Form.Group>
    </Row>
  </>
);
