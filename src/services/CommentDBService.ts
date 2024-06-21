import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class CommentDBService {
  async listDBComments() {
    try {
      return await prisma.comment.findMany();
    } catch (error) {
      console.error('Error listing comments:', error);
      throw error;
    }
  }

  async insertDBComment(comment: Prisma.CommentCreateInput) {
    try {
      return await prisma.comment.create({ data: comment });
    } catch (error) {
      console.error('Error inserting comment:', error);
      throw error;
    }
  }

  async updateDBComment(comment: Prisma.CommentUpdateInput, id: number) {
    try {
      return await prisma.comment.update({
        data: comment,
        where: { id }
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  async deleteDBComment(id: number) {
    try {
      await prisma.comment.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

export default new CommentDBService();