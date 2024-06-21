import { Router } from "express";
import PostController from "../controllers/PostController";

const PostRouter = Router();

PostRouter.get("/api/post/get", PostController.listPosts);

PostRouter.post("/api/post/post", PostController.createPost);

PostRouter.patch("/api/post/upadate/:id", PostController.updatePost);

PostRouter.delete("/api/post/delete/:id", PostController.deletePost);

export default PostRouter;