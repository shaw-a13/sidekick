import axios from 'axios';

export class CaseService {
    private readonly baseUrl: string

    constructor() {
        this.baseUrl = 'https://0lsi10z5ki.execute-api.eu-west-1.amazonaws.com/prod'
    }
    public async getAllCases(token: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/cases`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
          } catch (error) {
            console.log('error')
            console.error(error);
          }
    }

}