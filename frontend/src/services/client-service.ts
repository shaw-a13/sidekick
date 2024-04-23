import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../pages/upload/interfaces/client';

export class ClientService {
    private readonly baseUrl: string

    constructor() {
        this.baseUrl = 'https://oo4zjrnf7c.execute-api.eu-west-1.amazonaws.com/prod/'
    }

    public async addClient(token: string, clientInfo: Client) {
        const data = {
            clientId: uuidv4(),
            firstName: clientInfo.firstName,
            lastName: clientInfo.lastName,
            addressLine1: clientInfo.addressLine1,
            addressLine2: clientInfo.addressLine2,
            postcode: clientInfo.postcode,
            county: clientInfo.county,
            city: clientInfo.city,
            phoneNumber: clientInfo.phoneNumber,
            email: clientInfo.email
        }

        try {
            return await axios.post(`${this.baseUrl}/clients`, data, {
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