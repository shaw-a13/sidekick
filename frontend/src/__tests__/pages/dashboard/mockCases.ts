import { Case } from "../../../interfaces/case/case.interface";

export const getMockCases = (): Case[] => {
  return [
    {
      SK: "123",
      clientId: "Client 1",
      clientName: "John Doe",
      status: "OPEN",
      description: "Description 1",
      nature: "Nature 1",
      date: "2021-09-01",
      assignee: "Assignee 1",
    },
    {
      SK: "124",
      clientId: "Client 2",
      clientName: "Jane Doe",
      status: "ACTIVE",
      description: "Description 2",
      nature: "Nature 2",
      date: "2021-09-02",
      assignee: "Assignee 2",
    },
    {
      SK: "125",
      clientId: "Client 3",
      clientName: "John Smith",
      status: "PENDING",
      description: "Description 3",
      nature: "Nature 3",
      date: "2021-09-03",
      assignee: "Assignee 3",
    },
    { SK: "126", clientId: "Client 4", clientName: "Jane Smith", status: "CLOSED", description: "Description 4", nature: "Nature 4", date: "2021-09-04", assignee: "Assignee 4" },
  ];
};
