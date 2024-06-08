import React from "react";
import { Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { ExtractionResultProps } from "../interfaces/extractionResultProps.interface";
import { ExtractionTableProps } from "../interfaces/extractionTableProps.interface";

export const EmptyResults: React.FC = () => (
  <div className="text-center">
    <Container className="mt-5">
      <Row>
        <Col className="text-center">
          <h4>Awaiting extraction results, please refresh the page</h4>
          <Spinner animation="border" />
        </Col>
      </Row>
    </Container>
  </div>
);

export const ExtractionTable: React.FC<ExtractionTableProps> = ({ extractionData }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
        <th>Page Number</th>
        <th>Score</th>
        <th>Source</th>
      </tr>
    </thead>
    <tbody>
      {extractionData &&
        extractionData.map((result: ExtractionResultProps) => (
          <tr>
            <td>{result.key}</td>
            <td>{result.value}</td>
            <td>{result.locations.pageNumber}</td>
            <td>{result.score}</td>
            <td>{result.source}</td>
          </tr>
        ))}
    </tbody>
  </Table>
);
