import React, { useState } from "react";
import { Col, Container, Pagination, Row, Spinner, Table } from "react-bootstrap";
import { ExtractionResultProps } from "../interfaces/extractionResultProps.interface";
import { ExtractionTableProps } from "../interfaces/extractionTableProps.interface";
import "./ExtractionTable.css";

export const EmptyResults: React.FC = () => (
  <div className="text-center" data-testid="emptyResults">
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

export const ExtractionTable: React.FC<ExtractionTableProps> = ({ extractionData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(extractionData.length / itemsPerPage);

  const handleChangePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = extractionData.filter((_, index) => {
    const page = Math.floor(index / itemsPerPage) + 1;
    return page === currentPage;
  });

  return (
    <>
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item data-testid="extractionPaginator" className="paginationItem" key={index} active={index + 1 === currentPage} onClick={() => handleChangePage(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      <Table striped bordered hover data-testid="extractionTable">
        <thead data-testid="extractionTableHeading">
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Page Number</th>
            <th>Score</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((result: ExtractionResultProps) => (
            <tr data-testid="extractionResult">
              <td>{result.key}</td>
              <td>{result.value}</td>
              <td>{result.locations.pageNumber}</td>
              <td>{result.score}</td>
              <td>{result.source}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
