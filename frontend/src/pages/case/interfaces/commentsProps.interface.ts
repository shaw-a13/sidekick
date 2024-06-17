import { Comment } from "../../../interfaces/comment/comment.interface";
import { CommentService } from "../../../services/comment.service";
import { HistoryService } from "../../../services/history.service";

export interface CommentsProps {
  comments: Comment[];
  caseId: string;
  user: any;
  commentService: CommentService;
  historyService: HistoryService;
  accessToken: string;
}
