import { Router } from "express";
import CommentController from "../controllers/CommentController";

const CommentRouter = Router();

CommentRouter.get("/api/comment/get", CommentController.listComments);

CommentRouter.post("/api/comment/post", CommentController.createComment);

CommentRouter.patch("/api/comment/upadate/:id", CommentController.updateComment);

CommentRouter.delete("/api/comment/delete/:id", CommentController.deleteComment);


export default CommentRouter;