import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

type clientInfo = {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  county: string;
  city: string;
  phoneNumber: string;
  email: string;
};

const CaseTypePage = (props: {
  caseSetter: React.Dispatch<React.SetStateAction<string>>;
  stepSetter: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <Container>
      <Card.Title>Is this a new or existing case?</Card.Title>
      <Card.Text>
        <Button
          className="m-2"
          onClick={() => {
            props.caseSetter("new");
            props.stepSetter(1);
          }}
        >
          New
        </Button>
        <Button
          className="m-2"
          onClick={() => {
            props.caseSetter("existing");
            props.stepSetter(1);
          }}
        >
          Existing
        </Button>
      </Card.Text>
    </Container>
  );
};

const ClientInfoPage = (props: {
  stepSetter: React.Dispatch<React.SetStateAction<number>>;
  clientInfo: clientInfo;
  clientInfoSetter: React.Dispatch<React.SetStateAction<clientInfo>>;
}) => {
  const [validated, setValidated] = useState(false);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    props.clientInfoSetter({ ...props.clientInfo, [name]: value });
  };

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
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
              <Form.Control
                required
                type="text"
                placeholder="First name"
                name="firstName"
                value={props.clientInfo.firstName}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom02">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Last name"
                name="lastName"
                value={props.clientInfo.lastName}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-2">
            <Form.Group as={Col} md="6" controlId="validationCustom03">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apartment 2"
                required
                name="addressLine1"
                value={props.clientInfo.addressLine1}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid address line 1.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom04">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                type="text"
                placeholder="111 Apartment Building"
                name="addressLine2"
                value={props.clientInfo.addressLine2}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid state.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom05">
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="BT11 1AB"
                required
                name="postcode"
                value={props.clientInfo.postcode}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid postcode.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom05">
              <Form.Label>County</Form.Label>
              <Form.Control
                type="text"
                placeholder="Antrim"
                required
                name="county"
                value={props.clientInfo.county}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid county.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="validationCustom05">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Belfast"
                required
                name="city"
                value={props.clientInfo.city}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-2">
            <Form.Group as={Col} md="6" controlId="validationCustom05">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="0123456789"
                required
                name="phoneNumber"
                value={props.clientInfo.phoneNumber}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid phone number.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom05">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="john@test.com"
                name="email"
                value={props.clientInfo.email}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email address.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit">Submit form</Button>
        </Form>
      </Card.Text>
    </Container>
  );
};

const Upload = () => {
  const [step, setStep] = useState(0);
  const [caseType, setCaseType] = useState("");
  const initialFormState = {
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    county: "",
    city: "",
    phoneNumber: "",
    email: "",
  };

  const [clientInfo, setClientInfo] = useState(initialFormState);
  const steps = [
    {
      stepName: "caseType",
      component: <CaseTypePage caseSetter={setCaseType} stepSetter={setStep} />,
    },
    {
      stepName: "clientInfo",
      component: <ClientInfoPage stepSetter={setStep} clientInfo={clientInfo} clientInfoSetter={setClientInfo}/>,
    },
  ];
  console.log(caseType);
  return (
    <Container>
      <Row md={2} className="justify-content-md-center pt-5">
        <Card>
          <Card.Header>
            <Button className="rounded-circle m-2" onClick={() => setStep(0)}>
              1
            </Button>
            <Button className="rounded-circle m-2" onClick={() => setStep(1)}>
              2
            </Button>
            <Button className="rounded-circle m-2" onClick={() => setStep(2)}>
              3
            </Button>
          </Card.Header>
          <Card.Body className="text-center">{steps[step].component}</Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default Upload;
