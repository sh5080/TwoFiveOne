import { NextFunction, Request, Response } from "express";
import * as postService from "../services/postService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import path from "path";
import { compressImage } from "../config/compressImage";
import config from "../config";
import * as fs from "node:fs/promises";
const IMG_PATH = config.server.IMG_PATH;
/** 게시글 생성 */
export const createPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description } = req.body;
    const userId = req.user!.userId;
    const { backtrackId } = req.query;
    console.log("여기: ", description, backtrackId);
    if (description.length > 200 || !description) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "소개는 200자 이내로 작성 가능합니다.",
        400
      );
    }
    let imgNames: string = "";
    console.log("req.file: ", req.file);
    if (req.file) {
      const file = req.file as Express.Multer.File;
      const inputPath = path.join(__dirname, "../../public", file.filename);
      const compressedPath = path.join(
        __dirname,
        "../../public/compressed",
        file.filename
      );
      const fixedWidth = 600;
      const fixedHeight = (3 / 4) * fixedWidth;

      await compressImage(inputPath, compressedPath, fixedWidth, fixedHeight);

      const compressedFilename = path.basename(compressedPath);
      const encodedFilename = encodeURIComponent(compressedFilename);

      imgNames = `${IMG_PATH}/${encodedFilename}`;

      await fs.unlink(inputPath);
    }

    const postData = await postService.createPost(
      backtrackId,
      userId,
      description,
      imgNames
    );
    console.log(postData);
    res
      .status(201)
      .json({ message: "게시글 생성이 완료되었습니다.", postData });
  } catch (error) {
    next(error);
  }
};

/** 게시글 전체 조회 */
export const getPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page;
    const sortBy = req.query.sortBy; // 정렬 방식 받아오기

    let postData;

    if (sortBy === "oldest") {
      postData = await postService.getOldestPosts(parseInt(page));
    } else if (sortBy === "likes") {
      postData = await postService.getPostsByLikes(parseInt(page));
    } else {
      postData = await postService.getLatestPosts(parseInt(page));
    }

    if (postData.paginatedPosts.length < 1) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "조회된 게시글이 없습니다.",
        400
      );
    }
    res.json({ message: "게시글 조회 완료되었습니다.", postData });
  } catch (error) {
    next(error);
  }
};

/** 게시글 특정 조회 */
export const getOnePost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const postData = await postService.getOnePost(parseInt(id));

    res.json({ postData });
  } catch (error) {
    next(error);
  }
};

/** 게시글 삭제 */
export const deletePost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { backtrackId } = req.query;

    const deletedData = await postService.deletePost(backtrackId, userId);

    res.json({ message: "게시글 생성이 완료되었습니다.", deletedData });
  } catch (error) {
    next(error);
  }
};
export const addLikeToPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.body;

    const result = await postService.addLikeToPost(userId, postId);

    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const removeLikeFromPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;
    const likesCount = await postService.removeLikeFromPost(
      userId,
      parseInt(postId)
    );

    return res.status(200).json({ likesCount });
  } catch (error) {
    next(error);
  }
};
