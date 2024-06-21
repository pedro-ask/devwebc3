import { Request, Response } from "express";
import CommentService from "../services/CommentService";
import jwt, { JwtPayload } from 'jsonwebtoken';
require('dotenv').config();
const jwttoken = process.env.jwt_Token_Validation;

interface DecodedToken extends JwtPayload {
    userId: string;
}

class CommentController {
    constructor() { }

    async insertComment(req: Request, res: Response) {
        const body = req.body;
        console.log(body)
        if (!body.content || !body.postId) {
            return res.status(401).json({ status: 401, error: 'Faltam parâmetros' });
        }

        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ status: 401, error: 'Token não foi fornecido' });
            }

            if (!jwttoken) {
                return res.status(500).json({ status: 500, error: 'Chave secreta não foi definida' });
            }

            jwt.verify(token, jwttoken, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ status: 401, error: 'Token inválido' });
                }

                const decoded = decodedToken as DecodedToken;

                const userId = parseInt(decoded.userId, 10);

                const newComment = await CommentService.insertComment({
                    content: body.content,
                    author: {
                        connect: { id: userId },
                    },
                    post: {
                        connect: { id: body.postId }
                    }
                });

                return res.status(200).json({ status: 200, newComment: newComment });
            });
        } catch (error) {
            return res.status(401).json({ status: 401, error: error });
        }
    }
    async getAllComment(req: Request, res: Response) {

        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ status: 401, error: 'Token não foi fornecido' });
            }

            if (!jwttoken) {
                return res.status(500).json({ status: 500, error: 'Chave secreta não foi definida' });
            }

            jwt.verify(token, jwttoken, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ status: 401, error: 'Token inválido' });
                }

                const comments = await CommentService.getComments();

                return res.status(200).json({ status: 200, comments: comments });
            });
        } catch (error) {
            return res.status(401).json({ status: 401, error: error });
        }
    }

    async getCommentbyUserId(req: Request, res: Response) {
        const id = req.params.id;

        if (!id) {
            return res.status(401).json({ status: 401, error: "Faltou ID" });
        }
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ status: 401, error: 'Token não foi fornecido' });
            }

            if (!jwttoken) {
                return res.status(500).json({ status: 500, error: 'Chave secreta não foi definida' });
            }

            jwt.verify(token, jwttoken, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ status: 401, error: 'Token inválido' });
                }

                const comments = await CommentService.getCommentsByUserId(parseInt(id));

                return res.status(200).json({ status: 200, comments: comments });
            });
        } catch (error) {
            return res.status(401).json({ status: 401, error: error });
        }
    }
    async updateComment(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.status(401).json({ status: 401, error: "Faltou ID" });
        }

        const body = req.body;

        if (!body.content) {
            return res.status(401).json({ status: 401, error: "Faltam parâmetros" });
        }

        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ status: 401, error: 'Token não foi fornecido' });
            }

            if (!jwttoken) {
                return res.status(500).json({ status: 500, error: 'Chave secreta não foi definida' });
            }

            jwt.verify(token, jwttoken, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ status: 401, error: 'Token inválido' });
                }
                const updatedComment = await CommentService.updateComment(
                    {
                        content: body.content
                    },
                    parseInt(id)
                );
                return res.status(200).json({ status: 200, updatedUser: updatedComment });
            });
        }
        catch (error) {
            return res.status(401).json({ status: 401, error: error });
        }
    }
    async deleteComment(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.status(401).json({ status: 401, error: "Faltou ID" });
        }

        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ status: 401, error: 'Token não foi fornecido' });
            }

            if (!jwttoken) {
                return res.status(500).json({ status: 500, error: 'Chave secreta não foi definida' });
            }

            jwt.verify(token, jwttoken, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ status: 401, error: 'Token inválido' });
                }
                const response = await CommentService.deleteComment(parseInt(id));
                if (response) {
                    return res.status(200).json({ status: 200, message: "Comentário deletado com sucesso" });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ status: 401, error: error });
        }
    }
}

export default new CommentController();