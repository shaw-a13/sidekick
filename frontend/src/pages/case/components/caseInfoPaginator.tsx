import React, { useState } from "react";
import { Col, Pagination } from "react-bootstrap";
import { CaseInfo as CaseInfoComponent } from "./caseInfo.component";
import { ClientInfo } from "./clientInfo.component";
import { CaseInfoPaginatorProps } from "../interfaces/caseInfoPaginatorProps.interface";

export const CaseInfoPaginator: React.FC<CaseInfoPaginatorProps> = ({ caseInfo, user, caseService, clientService, historyService, accessToken, clientInfo }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;

  const pages = [
    {
      name: "Case Information",
      component: <CaseInfoComponent caseInfo={caseInfo} user={user} caseService={caseService} clientService={clientService} accessToken={accessToken} id={caseInfo.SK} />,
    },
    {
      name: "Client Information",
      component: <ClientInfo clientInfo={clientInfo} caseService={caseService} clientService={clientService} historyService={historyService} accessToken={accessToken} caseId={caseInfo.SK} assignee={caseInfo.assignee} user={user} />,
    },
  ];

  const handleChangePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="mt-3">
      <Pagination>
        {pages.map((page, index) => (
          <Pagination.Item className="paginationItem" key={index} active={index === currentPage} onClick={() => handleChangePage(index)}>
            {page.name}
          </Pagination.Item>
        ))}
      </Pagination>
      {pages[currentPage].component}
    </div>
  );
};
