import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Client } from "../../../interfaces/client/client.interface";
import { v4 as uuid } from "uuid";

const ClientInfoStep = (props: { stepSetter: (step: number) => void; clientInfo: Client; clientInfoSetter: React.Dispatch<React.SetStateAction<Client>> }) => {
  const [validated, setValidated] = useState(false);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    props.clientInfoSetter({ ...props.clientInfo, [name]: value });
  };

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("not valid");
      event.preventDefault();
      event.stopPropagation();
      document.getElementById("step1")!.style.pointerEvents = "none";
    }
    setValidated(true);
    event.preventDefault();
    if (form.checkValidity() === true) {
      props.clientInfo.SK = uuid();
      document.getElementById("step1")!.style.pointerEvents = "auto";
      props.stepSetter(1);
    }
    console.log("Values are", props.clientInfo);
  };

  return (
    <Container>
      <Card.Title>Client Information</Card.Title>
      <Card.Text>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Form.Group as={Col} md="6" controlId="validationCustom01">
              <Form.Label>First name</Form.Label>
              <Form.Control required type="text" placeholder="First name" name="firstName" value={props.clientInfo.firstName} onChange={handleInputChange} />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom02">
              <Form.Label>Last name</Form.Label>
              <Form.Control required type="text" placeholder="Last name" name="lastName" value={props.clientInfo.lastName} onChange={handleInputChange} />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-2">
            <Form.Group as={Col} md="6" controlId="validationCustom03">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control type="text" placeholder="Apartment 2" required name="addressLine1" value={props.clientInfo.addressLine1} onChange={handleInputChange} />
              <Form.Control.Feedback type="invalid">Please provide a valid address line 1.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom04">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control type="text" placeholder="111 Apartment Building" name="addressLine2" value={props.clientInfo.addressLine2} onChange={handleInputChange} />
              <Form.Control.Feedback type="invalid">Please provide a valid state.</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom05">
              <Form.Label>Postcode</Form.Label>
              <Form.Control type="text" placeholder="BT11 1AB" required name="postcode" value={props.clientInfo.postcode} onChange={handleInputChange} />
              <Form.Control.Feedback type="invalid">Please provide a valid postcode.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom05">
              <Form.Label>County</Form.Label>
              <Form.Control type="text" placeholder="Antrim" required name="county" value={props.clientInfo.county} onChange={handleInputChange} />
              <Form.Control.Feedback type="invalid">Please provide a valid county.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="validationCustom05">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" placeholder="Belfast" required name="city" value={props.clientInfo.city} onChange={handleInputChange} />
              <Form.Control.Feedback type="invalid">Please provide a valid city.</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-2">
            <Form.Group as={Col} md="6" controlId="validationCustom05">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="number" placeholder="0123456789" required name="phoneNumber" value={props.clientInfo.phoneNumber} onChange={handleInputChange} />
              <Form.Control.Feedback type="invalid">Please provide a valid phone number.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom05">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="john@test.com" name="email" value={props.clientInfo.email} onChange={handleInputChange} required />
              <Form.Control.Feedback type="invalid">Please provide a valid email address.</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit" className="sidekick-primary-btn">
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Form>
      </Card.Text>
    </Container>
  );
};

export default ClientInfoStep;
