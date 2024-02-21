import axios from 'axios';

export interface CaseRecord {
    customerName: string;
    SK: string;
    Status: string;
}

export class CaseService {
    private readonly baseUrl: string

    constructor() {
        this.baseUrl = 'https://0lsi10z5ki.execute-api.eu-west-1.amazonaws.com/prod'
    }
    public async getAllCases(token: string) {
        try {
            return await axios.get<CaseRecord[]>(`${this.baseUrl}/cases`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
          } catch (error) {
            console.log('error')
            console.error(error);
          }
    }

}