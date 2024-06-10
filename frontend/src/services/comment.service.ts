import axios from "axios";
import { BaseService } from "./base.service";
import { Comment } from "../interfaces/comment/comment.interface";

export class CommentService extends BaseService {
  public async getAllComments(token: string, caseId: string) {
    try {
      return await axios.get<Comment[]>(`${this.baseUrl}/comments/${caseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("error");
      console.error(error);
    }
  }

  // public async getSingleComment(token: string, CommentId: string) {
  //     try {
  //         return await axios.get<Comment>(`${this.baseUrl}/Comments/${CommentId}`, {
  //             headers: {
  //                 'Authorization': `Bearer ${token}`
  //             }
  //         });
  //     } catch (error) {
  //         console.log('error')
  //         console.error(error);
  //     }
  // }

  // public async deleteComment(token: string, CommentId: string) {
  //     try {
  //         return await axios.delete(`${this.baseUrl}/Comments/${CommentId}`, {
  //             headers: {
  //                 'Authorization': `Bearer ${token}`
  //             }
  //         });
  //     } catch (error) {
  //         console.log('error')
  //         console.error(error);
  //     }
  // }

  // public async addComment(token: string, CommentInfo: Comment) {
  //     try {
  //         return await axios.post(`${this.baseUrl}/Comments`, CommentInfo, {
  //             headers: {
  //                 'Authorization': `Bearer ${token}`
  //             }
  //         });
  //     } catch (error) {
  //         console.log('error')
  //         console.error(error);
  //     }
  // }

  // public async editComment(token: string, CommentEdits: CommentEditProps, CommentId: string) {
  //     let data: DynamoEditProps = {
  //         props: []
  //     }
  //     for (const [key, value] of Object.entries(CommentEdits)) {
  //         data.props.push({key, value})
  //     }

  //     console.log(data)
  //     try {
  //         return await axios.put(`${this.baseUrl}/Comments/${CommentId}`, data, {
  //             headers: {
  //                 'Authorization': `Bearer ${token}`
  //             }
  //         });
  //     } catch (error) {
  //         console.log('error')
  //         console.error(error);
  //     }
  // }
}
