import { Request, Response } from "express";
import UserDataBaseService from "../services/UserDataBaseService";
import { generateHash } from "../utils/BcryptUtils";
import jwt, { JwtPayload } from 'jsonwebtoken';
require('dotenv').config();
const jwttoken = process.env.jwt_Token_Validation;

interface DecodedToken extends JwtPayload {
  userId: string;
}
class UserController {
  constructor() { }

  async listUsers(req: Request, res: Response) {
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

        const users = await UserDataBaseService.listDBUsers();
        return res.status(200).json({ status: 200, users: users });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ status: 401, error: error });
    }
  }

  async createUser(req: Request, res: Response) {
    const body = req.body;

    if (!body.email || !body.name || !body.password) {
      return res.status(401).json({ status: 401, error: 'Faltam parâmetros' });
    }

    const hashPassword = await generateHash(body.password);

    if (!hashPassword) {
      return res.status(401).json({ status: 401, error: 'Erro ao criptografar a senha ...' });
    }

    try {
      const newuser = await UserDataBaseService.insertDBUser({
        name: body.name,
        email: body.email,
        password: hashPassword as string
      });
      return res.status(200).json({ status: 200, newuser: newuser });

    } catch (error) {
      return res.status(401).json({ status: 401, error: error });
    }
  }

  async updateUser(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ status: 401, error: 'Faltou ID' });
    }

    const { name, email } = req.body;
    console.log(req.body)
    if (!email || !name) {
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
        const updatedUser = await UserDataBaseService.updateDBUser(
          {
            name: name,
            email: email,
          },
          parseInt(id)
        );
        return res.status(200).json({ status: 200, updatedUser: updatedUser });
      });
    } catch (error) {
      return res.status(401).json({ status: 401, error: error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ status: 401, error: 'Faltou ID' });
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
        const response = await UserDataBaseService.deleteDBUser(parseInt(id));
        if (response) {
          return res.status(200).json({ status: 200, message: "Usuário deletado com sucesso" });
        }

      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ status: 401, error: error });
    }
  }
}

export default new UserController();