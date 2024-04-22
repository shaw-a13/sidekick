import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

type caseInfo = {
  description: string;
  nature: string;
  date: string;
};

const services = ['Property', 'Family', 'Civil', 'Criminal']

const CaseInfoStep = (props: {
  stepSetter: React.Dispatch<React.SetStateAction<number>>;
  caseInfo: caseInfo;
  caseInfoSetter: React.Dispatch<React.SetStateAction<caseInfo>>;
}) => {
  const [validated, setValidated] = useState(false);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    props.caseInfoSetter({ ...props.caseInfo, [name]: value });
  };

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log('not valid')
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    event.preventDefault();
    if(form.checkValidity() === true) {
      props.stepSetter(3)
    }
    console.log("Values are", props.caseInfo);
  };

  return (
    <Container>
      <Card.Title>Case Information</Card.Title>
      <Card.Text>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-1">
            <Form.Group as={Col} controlId="validationCustom01">
              <Form.Label>What is the nature of the case?</Form.Label>
              <Form.Select
                required
                name="nature"
                onChange={handleInputChange}
                value={props.caseInfo.nature}
              >
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
              <Form.Control as="textarea"
                              required
                              type="text"
                              placeholder=""
                              name="description"
                              defaultValue={props.caseInfo.description}
                              onChange={handleInputChange}
                />
              <Form.Control.Feedback type="invalid">
                Please provide a valid description.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} controlId="validationCustom05">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                required
                name="date"
                value={props.caseInfo.date}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid date.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit"><FontAwesomeIcon icon={faArrowRight} /></Button>
        </Form>
      </Card.Text>
    </Container>
  );
};

export default CaseInfoStep;
