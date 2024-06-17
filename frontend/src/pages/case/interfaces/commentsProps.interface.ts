import { Comment } from "../../../interfaces/comment/comment.interface";
import { CommentService } from "../../../services/comment.service";

export interface CommentsProps {
  comments: Comment[];
  caseId: string;
  userId: string;
  commentService: CommentService;
  accessToken: string;
}
