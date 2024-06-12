import axios from "axios";
import { BaseService } from "./base.service";
import { Comment } from "../interfaces/comment/comment.interface";
import { DynamoEditProps } from "../interfaces/dynamoEditProps.interface";
import { CommentEditProps } from "../interfaces/comment/commentEditProps.interface";

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

  public async deleteComment(token: string, caseId: string, commentId: string) {
    try {
      return await axios.delete(`${this.baseUrl}/comments/${caseId}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("error");
      console.error(error);
    }
  }

  public async addComment(token: string, commentInfo: Comment, caseId: string) {
    try {
      return await axios.post(`${this.baseUrl}/comments/${caseId}`, commentInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("error");
      console.error(error);
    }
  }

  public async editComment(token: string, commentEdits: CommentEditProps, caseId: string, timestamp: string) {
    let data: DynamoEditProps = {
      props: [],
    };
    for (const [key, value] of Object.entries(commentEdits)) {
      data.props.push({ key, value });
    }
    console.log(data);
    try {
      return await axios.put(`${this.baseUrl}/comments/${caseId}/${timestamp}`, data, {
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
