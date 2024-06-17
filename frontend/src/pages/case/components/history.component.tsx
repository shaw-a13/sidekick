import React, { useState } from "react";
import { Card, Col, Pagination, Row } from "react-bootstrap";
import { HistoryProps } from "../interfaces/historyProps.interface";

export const History: React.FC<HistoryProps> = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handleChangePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = history
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
    .filter((_, index) => {
      const page = Math.floor(index / itemsPerPage) + 1;
      return page === currentPage;
    });

  return (
    <Card>
      <Card.Body>
        <Card.Title>History</Card.Title>
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item className="paginationItem" key={index} active={index + 1 === currentPage} onClick={() => handleChangePage(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
        {paginatedData.map((history) => {
          return (
            <div>
              <hr />
              <Row>
                <Col>
                  <Card.Subtitle className="mb-2 text-muted">{history.action}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">{history.name}</Card.Subtitle>
                </Col>
                <Col>
                  <Card.Subtitle className="mb-2">{history.timestamp}</Card.Subtitle>
                </Col>
              </Row>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};
