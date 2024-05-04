import axios from 'axios';
import { Client } from '../interfaces/client/client.interface';
import { BaseService } from './base.service';
import { ClientEditProps } from '../interfaces/client/clientEditProps.interface';
import { DynamoEditProps } from '../interfaces/dynamoEditProps.interface';

export class ClientService extends BaseService {

    public async getAllClients(token: string) {
        try {
            return await axios.get<Client[]>(`${this.baseUrl}/clients`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

    public async getSingleClient(token: string, clientId: string) {
        try {
            return await axios.get<Client>(`${this.baseUrl}/clients/${clientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

    public async deleteClient(token: string, clientId: string) {
        try {
            return await axios.delete(`${this.baseUrl}/clients/${clientId}`, {
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
        // const data = {
        //     firstName: clientInfo.firstName,
        //     lastName: clientInfo.lastName,
        //     addressLine1: clientInfo.addressLine1,
        //     addressLine2: clientInfo.addressLine2,
        //     postcode: clientInfo.postcode,
        //     county: clientInfo.county,
        //     city: clientInfo.city,
        //     phoneNumber: clientInfo.phoneNumber,
        //     email: clientInfo.email
        // }

        console.log(clientInfo)

        try {
            return await axios.post(`${this.baseUrl}/clients`, clientInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

    public async editClient(token: string, clientEdits: ClientEditProps, clientId: string) {
        let data: DynamoEditProps = {
            props: []
        }
        for (const [key, value] of Object.entries(clientEdits)) {
            data.props.push({key, value})
        }

        console.log(data)
        try {
            return await axios.put(`${this.baseUrl}/clients/${clientId}`, data, {
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