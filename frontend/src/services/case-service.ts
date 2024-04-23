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
        this.baseUrl = 'https://oo4zjrnf7c.execute-api.eu-west-1.amazonaws.com/prod'
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

    // public async addCase(token: string, caseInfo: CaseRecord) {
    //     const data = {
    //         caseId: uuidv4(),
    //         firstName: clientInfo.firstName,
    //         lastName: clientInfo.lastName,
    //         addressLine1: clientInfo.addressLine1,
    //         addressLine2: clientInfo.addressLine2,
    //         postcode: clientInfo.postcode,
    //         county: clientInfo.county,
    //         city: clientInfo.city,
    //         phoneNumber: clientInfo.phoneNumber,
    //         email: clientInfo.email
    //     }

    //     try {
    //         return await axios.post(`${this.baseUrl}/cases`, data, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             },
    //         });
    //     } catch (error) {
    //         console.log('error')
    //         console.error(error);
    //     }
    // }

}