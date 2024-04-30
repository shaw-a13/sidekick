import axios from 'axios';
import { BaseService } from './base.service';
import { Case } from '../interfaces/case/case.interface';
import { DynamoEditProps } from '../interfaces/dynamoEditProps.interface';

export class CaseService extends BaseService{

    public async getAllCases(token: string) {
        try {
            return await axios.get<Case[]>(`${this.baseUrl}/cases`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

    public async getSingleCase(token: string, caseId: string) {
        try {
            return await axios.get<Case>(`${this.baseUrl}/cases/${caseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

    public async deleteCase(token: string, caseId: string) {
        try {
            return await axios.delete(`${this.baseUrl}/cases/${caseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

    public async addCase(token: string, caseInfo: Case) {
        const data: Case = {
            SK: caseInfo.SK,
            customerName: caseInfo.customerName,
            status: caseInfo.status,
            description: caseInfo.description,
            nature: caseInfo.nature,
            date: caseInfo.date
        }

        try {
            return await axios.post(`${this.baseUrl}/cases`, caseInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

    public async editCase(token: string, caseEdits: CaseEditProps) {
        let data: DynamoEditProps = {
            props: []
        }
        for (const [key, value] of Object.entries(caseEdits)) {
            data.props.push({key, value})
        }

        console.log(data)
        try {
            return await axios.put(`${this.baseUrl}/cases`, data, {
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