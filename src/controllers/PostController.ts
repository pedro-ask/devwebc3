import { Request, Response } from "express";
import PostService from "../services/PostService";
import jwt, { JwtPayload } from 'jsonwebtoken';
require('dotenv').config();
const jwttoken = process.env.jwt_Token_Validation;

interface DecodedToken extends JwtPayload {
    userId: string;
}

class PostController {
    constructor() { }

    async insertPost(req: Request, res: Response) {
        const body = req.body;

        if (!body.post.title || !body.post.content) {
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

                const newPost = await PostService.insertPost({
                    title: body.post.title,
                    content: body.post.content,
                    author: {
                        connect: { id: userId },
                    },
                    published: false,
                });

                return res.status(200).json({ status: 200, newPost: newPost });
            });
        } catch (error) {
            return res.status(401).json({ status: 401, error: error });
        }
    }
    async getAllPost(req: Request, res: Response) {

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

                const posts = await PostService.getPosts();

                return res.status(200).json({ status: 200, posts: posts });
            });
        } catch (error) {
            return res.status(401).json({ status: 401, error: error });
        }
    }

    async getPostbyUserId(req: Request, res: Response) {
        const id = req.params.id;
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

                const posts = await PostService.getPostsByUserId(parseInt(id));

                return res.status(200).json({ status: 200, posts: posts });
            });
        } catch (error) {
            return res.status(401).json({ status: 401, error: error });
        }
    }
    async updatePost(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.status(401).json({ status: 401, error: "Faltou ID" });
        }

        const body = req.body;

        if (!body.content || !body.title) {
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
                const updatedPost = await PostService.updatePost(
                    {
                        content: body.content,
                        title: body.title,
                    },
                    parseInt(id)
                );

                return res.status(200).json({ status: 200, updatedPost: updatedPost });
            });
        }
        catch (error) {
            return res.status(401).json({ status: 401, error: error });
        }
    }
    async deletePost(req: Request, res: Response) {
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
                const response = await PostService.deletePost(parseInt(id));
                if (response) {
                    return res.status(200).json({ status: 200, message: "Post deletado com sucesso" });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ status: 401, error: error });
        }
    }
}

export default new PostController();