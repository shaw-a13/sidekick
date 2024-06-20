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
      status: "CLOSED",
      description: "Description 2",
      nature: "Nature 2",
      date: "2021-09-02",
      assignee: "Assignee 2",
    },
  ];
};
