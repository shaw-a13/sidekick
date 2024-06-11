import axios from "axios";
import { BaseService } from "./base.service";
import { History } from "../interfaces/history/history.interface";

export class HistoryService extends BaseService {
  public async getAllHistory(token: string, caseId: string) {
    try {
      return await axios.get<History[]>(`${this.baseUrl}/history/${caseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("error");
      console.error(error);
    }
  }

  public async addHistory(token: string, caseId: string, historyInfo: History) {
    try {
      return await axios.post(`${this.baseUrl}/history/${caseId}`, historyInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("error");
      console.error(error);
    }
  }
}
