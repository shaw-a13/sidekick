export enum CaseStatus {
  OPEN = "OPEN",
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  CLOSED = "CLOSED",
}

export const CaseStatusStyles = {
  [CaseStatus.OPEN]: { style: "primary" },
  [CaseStatus.ACTIVE]: { style: "success" },
  [CaseStatus.PENDING]: { style: "warning" },
  [CaseStatus.CLOSED]: { style: "danger" },
};
