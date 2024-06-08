import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { FeatureInterface } from "../interfaces/feature.interface";

export const Feature = ({ icon, title, text }: { icon: IconDefinition; title: string; text: string }) => (
  <Col>
    <FontAwesomeIcon icon={icon} size="8x" color="#CF7650" />
    <div style={{ color: "white" }}>
      <h6 className="m-2">{title}</h6>
      <p>{text}</p>
    </div>
  </Col>
);

export const FeatureSection = ({ features }: { features: FeatureInterface[] }) => (
  <Row>
    <div style={{ backgroundColor: "#162836" }}>
      <Row className="text-center m-4">
        {features.map((feature, index) => (
          <Feature icon={feature.icon} title={feature.title} text={feature.text} />
        ))}
      </Row>
    </div>
  </Row>
);
