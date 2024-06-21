import express from "express";
import UserRouter from "./routes/UserRoutes";
import PostRouter from "./routes/PostRoutes";
import { config } from 'dotenv';
import CommentRouter from "./routes/CommentRoutes"; 
config();

const port = 3000;

const app = express();
app.use(express.json());

app.use(UserRouter);
app.use(PostRouter);
app.use(CommentRouter);

app.listen(port, function () {
  console.log("Servidor rodando na porta= " + port);
});