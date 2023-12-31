import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import config from "../config";
import * as Type from "../types/type";
import { AppError, CommonError } from "../types/AppError";
import { AuthRepository } from "../models/repositories/auth.repository";
import { PostRepository } from "../models/repositories/post.repository";
import * as nodemailer from "../config/nodemailer";
import { AppDataSource } from "../loaders/dbLoader";
const { saltRounds } = config.bcrypt;
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

/**
 * 사용자 회원가입
 */

export const signupUser = async (user: Type.User) => {
  try {
    const hashedPassword = await bcrypt.hash(String(user.password), saltRounds);

    const newUser = await AuthRepository.createUser({
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      password: hashedPassword,
    });

    return newUser;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      console.error(error);
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원가입에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 회원가입시 아이디 중복검사
 */

export const getUsername = async (username: string): Promise<boolean> => {
  try {
    const existingUser = await AuthRepository.checkDuplicateUsername(username);
    if (existingUser) {
      throw new AppError(
        CommonError.DUPLICATE_ENTRY,
        "이미 사용중인 아이디입니다.",
        400
      );
    }
    return existingUser;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "아이디 중복검사에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 회원가입시 아이디 중복검사
 */

export const getNickname = async (nickname: string) => {
  try {
    const existingUser = await AuthRepository.findUser(
      undefined,
      undefined,
      nickname
    );
    if (existingUser) {
      throw new AppError(
        CommonError.DUPLICATE_ENTRY,
        "이미 사용중인 닉네임입니다.",
        400
      );
    }
    return existingUser;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "닉네임 중복검사에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 사용자 로그인
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await AuthRepository.login(username);

    if (!user) {
      throw new AppError(
        CommonError.AUTHENTICATION_ERROR,
        "없는 사용자이거나 비밀번호가 일치하지 않습니다.",
        401
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      String(user.password)
    );
    if (!isPasswordMatch) {
      throw new AppError(
        CommonError.AUTHENTICATION_ERROR,
        "없는 사용자이거나 비밀번호가 일치하지 않습니다.",
        401
      );
    }
    if (user.activated === 0 && isPasswordMatch) {
      throw new AppError(
        CommonError.UNAUTHORIZED_ACCESS,
        "탈퇴한 회원입니다.",
        400
      );
    }

    const accessToken: string = jwt.sign(
      { userId: user.id, role: user.role },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }
    );

    const refreshToken: string = jwt.sign(
      { userId: user.id, role: user.role },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }
    );
    const tokenData = { accessToken: accessToken, refreshToken: refreshToken };
    return tokenData;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      console.error(error);
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "로그인에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 사용자 정보 조회
 */
export const getUser = async (id?: number) => {
  try {
    const user = await AuthRepository.findUser(id);
    if (user !== null) {
      const { ...userData } = user;
      return userData;
    }
    return null;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원정보 조회에 실패했습니다.",
        500
      );
    }
  }
};

export const getUserByUsername = async (username: string) => {
  const userData = await AuthRepository.findUserByUsername(username);
  return userData;
};

/**
 * 사용자 아이디찾기
 */
export const findUsernameByEmail = async (email: string) => {
  try {
    const user = await AuthRepository.findUser(undefined, email);

    if (!user) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "없는 이메일입니다.",
        404
      );
    }
    const username = user.username;
    return username;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원정보 찾기에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 사용자 비밀번호 재설정 및 트랜잭션 후 이메일전송
 */

export const resetPasswordByEmail = async (username: string, email: string) => {
  const queryRunner = AppDataSource.createQueryRunner();
  let user: Type.User | null = null;
  let newTemporaryPassword: string = "";
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userData = await AuthRepository.findUserByUsername(username);
    user = await AuthRepository.findUser(userData?.id, email);

    // 새로운 임시 비밀번호 생성
    newTemporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(newTemporaryPassword, 10);
    user!.password = hashedPassword;

    await AuthRepository.save(user!);
    await queryRunner.commitTransaction();
    return newTemporaryPassword;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원정보 찾기에 실패했습니다.",
        500
      );
    }
  } finally {
    try {
      await queryRunner.release();
      if (user) {
        nodemailer.sendPasswordResetEmail(user.email, newTemporaryPassword);
      }
    } catch (error) {
      throw error;
    }
  }
};

/**
 * 임시 비밀번호 생성
 */
function generateTemporaryPassword(length: number = 10): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let temporaryPassword = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    temporaryPassword += charset[randomIndex];
  }

  return temporaryPassword;
}

export const getUsersByLikes = async (page: number, pageSize: number) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let allUsers = await AuthRepository.find();

    allUsers = allUsers.sort((a, b) => {
      const aLikes = a.totalLikes || 0;
      const bLikes = b.totalLikes || 0;
      return bLikes - aLikes;
    });

    const totalItemsCount = allUsers.length;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);

    for (const user of paginatedUsers) {
      const userPosts = await PostRepository.find({
        where: { backtrack: { userId: user.id } },
        relations: ["backtrack"],
      });

      let mostLikedPost;
      let maxLikes = 0;
      for (const post of userPosts) {
        const likes = post.likedUsers ? post.likedUsers.length : 0;
        if (likes > maxLikes) {
          maxLikes = likes;
          mostLikedPost = post;
        }
      }

      user.mostLikedPost = mostLikedPost?.backtrack.title;
    }
    return { paginatedUsers, totalItemsCount };
  } catch (error) {
    throw error;
  }
};
