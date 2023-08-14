import bcrypt from "bcrypt";
import * as authModel from "../models/authModel";
import jwt from "jsonwebtoken";
import config from "../config";
import * as Type from "../types/type";
import { AppError, CommonError } from "../types/AppError";
import { AuthRepository } from "../models/repositories/auth.repository";
import * as nodemailer from "../config/nodeMailer";
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
      email: user.email,
      password: hashedPassword,
    });
    console.log(newUser);
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
 * 사용자 로그인
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<object> => {
  try {
    const user = await AuthRepository.login(username, password);

    if (!user) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "없는 사용자 입니다.",
        404
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
      { username: user.username, role: user.role },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }
    );

    const refreshToken: string = jwt.sign(
      { username: user.username, role: user.role },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
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
export const getUser = async (username?: string) => {
  try {
    const user = await authModel.getUserByUsername(username);

    if (!user) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "로그인 후 이용가능합니다.",
        404
      );
    }
    const { password, ...userData } = user;

    return userData;
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

/**
 * 사용자 아이디찾기 및 비밀번호 리셋
 */
export const findUsernameByEmail = async (email: string) => {
  try {
    const user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "사용자를 찾을 수 없습니다.",
        404
      );
    }
    const username = user.username;
    console.log(username);
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
 * 사용자 비밀번호 초기화
 */
export const resetPasswordByEmail = async (email: string) => {
  try {
    const user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "사용자를 찾을 수 없습니다.",
        404
      );
    }

    // 새로운 임시 비밀번호 생성
    const newTemporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(newTemporaryPassword, 10);
    user.password = hashedPassword;
    await AuthRepository.save(user);
    nodemailer.sendPasswordResetEmail(user.email, newTemporaryPassword);
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
 * 임시 비밀번호 생성
 */
function generateTemporaryPassword(): string {
  // 임시 비밀번호 생성 로직 구현 (예: 랜덤 문자열 생성)
  return "temporaryPassword123";
}

/**
 * 비밀번호 재설정 이메일 전송
 */

/**
 * 사용자 정보 업데이트
 */
export const updateUser = async (
  username: string,
  updateData: Partial<Type.User>
) => {
  try {
    const existingUser = await authModel.getUserByUsername(username);

    if (!existingUser) {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "사용자 정보를 찾을 수 없습니다.",
        404
      );
    }

    if (!updateData.email && !updateData.password) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "새로운 이메일 또는 비밀번호를 입력해주세요.",
        400
      );
    }

    if (updateData.email && updateData.password) {
      const isSamePassword = await bcrypt.compare(
        updateData.password,
        existingUser.password ?? ""
      );
      if (isSamePassword && updateData.email === existingUser.email) {
        throw new AppError(
          CommonError.INVALID_INPUT,
          "새로운 이메일 또는 비밀번호를 입력해주세요.",
          400
        );
      }

      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await authModel.updateUserByUsername(
      username,
      updateData
    );

    if (!updatedUser) {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "사용자 정보 수정에 실패했습니다.",
        500
      );
    }
    const { password, ...userInfo } = updatedUser;
    return userInfo;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원정보 수정에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 사용자 삭제
 */
export const deleteUser = async (username: string) => {
  try {
    const deletedUser = await authModel.deleteUserByUsername(username);
    return deletedUser;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원탈퇴에 실패했습니다.",
        500
      );
    }
  }
};
