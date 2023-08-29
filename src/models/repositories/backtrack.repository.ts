import * as Type from "../../types/type";
import { BacktrackEntity } from "../entities/backtrack.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";

export const AuthRepository = AppDataSource.getRepository(
  BacktrackEntity
).extend({
  async findBacktrack(username: string, backtrack: string) {
    try {
      if (!username) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "사용자 정보를 찾을 수 없습니다.",
          404
        );
      }

      const backtrackData = await this.findOne({
        where: { username, backtrack },
      });

      return backtrackData; // You might want to return the found data
    } catch (error) {
      throw error;
    }
  },
});