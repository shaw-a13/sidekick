import axios from "axios";
import { BaseService } from "./base.service";
import { DocumentResultResponse } from "../interfaces/document/documentResultResponse.interface";

interface PresignedUrlResponse {
    presignedUrl: string;
}


export class DocumentService extends BaseService {

    public async getPresignedUrl(token: string, caseId: string) {
        try {
            return await axios.get<PresignedUrlResponse>(`${this.baseUrl}/upload/${caseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
        } catch (error) {
            console.log('error')
            console.error(error);
        }
    }

    public async uploadDocument(presignedUrl: string, document: any) {
        try {
            await axios.put(presignedUrl, document, {
                headers: {
                  "Content-Type": "application/pdf",
                },
            });
            
        } catch (error) {
            console.log('error')
            console.error(error)
        }

    }

    public async getDocuments(token: string, caseId: string) {
        try {
            return await axios.get<DocumentResultResponse>(`${this.baseUrl}/download/${caseId}`, {
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