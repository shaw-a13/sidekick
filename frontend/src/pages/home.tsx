import { Button, Container, Row, Col, Card } from "react-bootstrap";
import banner from "../img/pexels-pixabay-48148.jpg";
import testimonialImg1 from "../img/testimonial-img-1.png";
import testimonialImg2 from "../img/testimonial-img-2.png";
import testimonialImg3 from "../img/testimonial-img-3.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faMicrochip,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container>
      <Row>
        <img src={banner} alt="" style={{ height: "35rem", padding: "0px" }} />
        <div
          style={{
            backgroundColor: "#3d5a80",
            position: "absolute",
            top: "25rem",
            left: "20rem",
            width: "30rem",
            color: "white",
          }}
        >
          <div className="m-2">
            <h5>Sidekick</h5>
            <p>Elevate your legal workflow</p>
            <p>
              Seamlessly integrate automation with your legal processes with
              your document extraction ally
            </p>
            <div className="text-center">
              <Button
                style={{ backgroundColor: "#e0fbfc", color: "black" }}
                onClick={() => loginWithRedirect()}
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div style={{ backgroundColor: "#3d5a80" }}>
          <Row className="text-center m-4">
            <Col>
              <FontAwesomeIcon icon={faGaugeHigh} size="8x" color="#e0fbfc" />
              <div style={{ color: "white" }}>
                <h6 className="m-2">Speedy document processing</h6>
                <p>
                  The automated extraction of content from legal documents
                  removes the need to manually search through documents to find
                  information
                </p>
              </div>
            </Col>
            <Col>
              <FontAwesomeIcon icon={faMicrochip} size="8x" color="#e0fbfc" />
              <div style={{ color: "white" }}>
                <h6 className="m-2">Intelligent extractions</h6>
                <p>
                  Using state of the art artificial intelligence and managed
                  services, information can be easily extracted
                </p>
              </div>
            </Col>
            <Col>
              <FontAwesomeIcon icon={faBoxOpen} size="8x" color="#e0fbfc" />
              <div style={{ color: "white" }}>
                <h6 className="m-2">Reliable storage</h6>
                <p>
                  Every document uploaded is stored reliably on the cloud, it is
                  also secured to a high standard following the latest security
                  guidelines
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </Row>
      <Row>
        <div className="mt-2">
          <h3>Testimonials</h3>
          <Row>
            <Col>
              <Card
                className="h-100"
                style={{ backgroundColor: "#3d5a80", color: "white" }}
              >
                <Card.Img
                  variant="bottom"
                  src={testimonialImg1}
                  style={{ margin: "1rem", width: "8rem" }}
                />
                <Card.Body>
                  <Card.Title>John (Solicitor, 32)</Card.Title>
                  <Card.Text>
                    "Switching to using Sidekick has improved case processing
                    times by 50% at JS and Associates, we havent looked back
                    since switching to Sidekick!"
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                className="h-100"
                style={{ backgroundColor: "#3d5a80", color: "white" }}
              >
                <Card.Img
                  variant="bottom"
                  src={testimonialImg2}
                  style={{ margin: "1rem", width: "8rem" }}
                />
                <Card.Body>
                  <Card.Title>Jane (Secretary, 30)</Card.Title>
                  <Card.Text>
                    "Sidekick has made my job so much easier. Gone are the days
                    of needing to trawl through long documents to find
                    information. I can now focus on more importnt activities!"
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                className="h-100"
                style={{ backgroundColor: "#3d5a80", color: "white" }}
              >
                <Card.Img
                  variant="bottom"
                  src={testimonialImg3}
                  style={{ margin: "1rem", width: "8rem" }}
                />
                <Card.Body>
                  <Card.Title>Sarah (Solicitor, 50)</Card.Title>
                  <Card.Text>
                    "Sidekick has opened up so many possibilities for my law
                    firm! Since switching to using it, we have received very
                    positive feedback from clients about how much better our
                    process is"
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Row>
      <Row className="mt-5 mb-5">
        <Col xs={4}>
          <h1>Make the switch today</h1>
        </Col>
        <Col className="mt-2">
          <Button
            style={{ backgroundColor: "#e0fbfc", color: "black" }}
            onClick={() => loginWithRedirect()}
          >
            Get started
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
