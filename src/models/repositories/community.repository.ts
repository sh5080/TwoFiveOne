import * as Type from "../../types/type";
import { CommunityEntity } from "../entities/community.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
import { BacktrackRepository } from "./backtrack.repository";
import { AuthRepository } from "./auth.repository";
import { In } from "typeorm";

export const CommunityRepository = AppDataSource.getRepository(
  CommunityEntity
).extend({
  async createCommunity(
    userId: number,
    title: string,
    description: string,
    createdAt: string
  ) {
    try {
      const userData = this.create({
        userId,
        title,
        description,
        createdAt,
      });

      await this.save(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  },

  async getOneCommunity(id: number) {
    try {
      const community = await this.findOne({ where: { id } });

      return community;
    } catch (error) {
      throw error;
    }
  },

  async getCommunity() {
    try {
      const allCommunities = await this.find({});

      return allCommunities;
    } catch (error) {
      throw error;
    }
  },
  //   async getMyPosts(ids: number[]) {
  //     try {
  //       // const posts = await this.find({
  //       //   where: { backtrackId: In(ids) },
  //       // });
  //       const posts = await this.createQueryBuilder("post")
  //         .innerJoinAndSelect("post.backtrack", "backtrack")
  //         .where("post.backtrackId IN (:...ids)", { ids })
  //         .getMany();

  //       return posts;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },

  //   async deletePostById(id: number) {
  //     try {
  //       const postData = await this.findOne({ where: { id } });

  //       if (!postData) {
  //         throw `Post ${id} not found`;
  //       }

  //       const userData = await this.remove(postData);

  //       return userData;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },

  //   // 좋아요 추가
  //   async addLikeToPost(username: string, id: number) {
  //     const connect = AppDataSource.createQueryRunner();
  //     await connect.connect();
  //     await connect.startTransaction();
  //     try {
  //       const user = await AuthRepository.findOne({
  //         where: { username },
  //       });
  //       const post = await CommunityRepository.findOne({
  //         where: { id },
  //       });
  //       if (!user || !post) {
  //         throw new AppError(
  //           CommonError.RESOURCE_NOT_FOUND,
  //           "사용자 또는 게시물을 찾을 수 없습니다.",
  //           404
  //         );
  //       }

  //       if (!user.likedPosts) {
  //         user.likedPosts = [];
  //       }

  //       if (!post.likedUsers) {
  //         post.likedUsers = [];
  //       }

  //       const alreadyLiked = user.likedPosts.includes(post.id);
  //       if (!alreadyLiked) {
  //         user.likedPosts.push(post.id);
  //         post.likedUsers.push(user.id);

  //         await AuthRepository.save(user);
  //         await CommunityRepository.save(post);
  //         return post;
  //       } else return null;
  //     } catch (error) {
  //       await connect.rollbackTransaction();
  //       await connect.release();
  //       throw error;
  //     }
  //   },

  //   // 좋아요 취소
  //   async removeLikeFromPost(username: string, id: number) {
  //     const connect = AppDataSource.createQueryRunner();
  //     await connect.connect();
  //     await connect.startTransaction();
  //     try {
  //       const user = await AuthRepository.findOne({
  //         where: { username },
  //       });
  //       const post = await CommunityRepository.findOne({
  //         where: { id },
  //       });

  //       if (!user || !post) {
  //         throw new AppError(
  //           CommonError.RESOURCE_NOT_FOUND,
  //           "사용자 또는 게시물을 찾을 수 없습니다.",
  //           404
  //         );
  //       }
  //       const alreadyLiked = user.likedPosts.includes(post.id);
  //       if (alreadyLiked) {
  //         user.likedPosts = user.likedPosts.filter(
  //           (likedPost) => likedPost !== post.id
  //         );
  //         post.likedUsers = post.likedUsers.filter(
  //           (likedUser) => likedUser !== user.id
  //         );
  //         await AuthRepository.save(user);
  //         await CommunityRepository.save(post);
  //         return post;
  //       } else return null;
  //     } catch (error) {
  //       await connect.rollbackTransaction();
  //       await connect.release();
  //       throw error;
  //     }
  //   },
});
