import React from "react";
import { Col } from "react-bootstrap";
import { CaseInfo as CaseInfoComponent } from "./caseInfo.component";
import { ClientInfo } from "./clientInfo.component";
import { CaseInfoPaginatorProps } from "../interfaces/caseInfoPaginatorProps.interface";

export const CaseInfoPaginator: React.FC<CaseInfoPaginatorProps> = ({ caseInfo, user, caseService, clientService, accessToken, clientInfo }) => {
  return (
    <Col sm={5}>
      {/* <CaseInfoComponent caseInfo={caseInfo} user={user} caseService={caseService} clientService={clientService} accessToken={accessToken} id={caseInfo.sk} /> */}
      {/* <Col className="mt-3">{clientInfo && <ClientInfo clientInfo={clientInfo} caseService={caseService} clientService={clientService} accessToken={accessToken} caseId={caseInfo.sk} />}</Col> */}
    </Col>
  );
};
