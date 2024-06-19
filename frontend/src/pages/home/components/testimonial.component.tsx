import { Col, Card, Row } from "react-bootstrap";
import { TestimonialComponentProps, TestimonialProps } from "../interfaces/testimonialProps.interface";
import "../../styles/home.css";

export const Testimonial: React.FC<TestimonialComponentProps> = ({ imgSrc, title, text }) => (
  <Col>
    <Card className="h-100 shadow" style={{backgroundColor: '#162836', color: 'white'}} data-testid="testimonial">
      <Card.Img variant="bottom" src={imgSrc} style={{margin: '1rem', width: '8rem'}} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

export const TestimonialSection = ({ testimonials }: { testimonials: TestimonialProps[] }) => (
  <Row className="mt-4" data-testid="testimonialSection">
    {testimonials.map((testimonial, index) => (
      <Testimonial imgSrc={testimonial.img} title={testimonial.title} text={testimonial.text} />
    ))}
  </Row>
);
