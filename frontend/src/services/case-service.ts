import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../pages/upload/interfaces/client';

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

    public async addClient(token: string, clientInfo: Client) {
        const formData = new FormData();

        formData.append("clientId", uuidv4());
        formData.append("firstName", clientInfo.firstName);
        formData.append("lastName", clientInfo.lastName);
        formData.append("addressLine1", clientInfo.addressLine1);
        formData.append("addressLine2   ", clientInfo.addressLine2);
        formData.append("postcode", clientInfo.postcode);
        formData.append("county", clientInfo.county);
        formData.append("city", clientInfo.city);
        formData.append("phoneNumber", clientInfo.phoneNumber);
        formData.append("email", clientInfo.email);

        try {
            return await axios.post(`${this.baseUrl}/cases`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

}