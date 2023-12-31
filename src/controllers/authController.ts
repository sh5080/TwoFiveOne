import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import { getSessionFromRedis, saveSessionToRedis } from "../config/redis";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, nickname, password, passwordConfirm, email } = req.body;

    const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (!idRegex.test(username)) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "아이디는 영문과 숫자만 포함하여 사용할 수 있습니다.",
        400
      );
    }

    if (username.length < 6 || username.length > 20) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "아이디는 6자 이상 20자 이내로 설정해야 합니다.",
        400
      );
    }

    if (password !== passwordConfirm) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "동일한 비밀번호를 입력해주세요.",
        400
      );
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,20}$/;
    if (!passwordRegex.test(password)) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 10자 이상 20자 이내여야 합니다.",
        400
      );
    }
    if (!email.includes("@") || !email.includes(".")) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "이메일 형식에 맞추어 입력해주세요.",
        400
      );
    }

    const newUser = await authService.signupUser({
      username,
      nickname,
      email,
      password,
    });

    const newUserData = {
      username: newUser.username,
      nickname: newUser.nickname,
      email: newUser.email,
    };

    res.status(201).json({ message: "회원가입에 성공했습니다.", newUserData });
  } catch (error) {
    next(error);
  }
};

/** 아이디 중복검사 */
export const getUsername = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.query;
    await authService.getUsername(username);
    const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (!idRegex.test(username)) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "아이디는 영문과 숫자만 포함하여 사용할 수 있습니다.",
        400
      );
    }
    if (username.length < 6 || username.length > 20) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "아이디는 6자 이상 20자 이내로 설정해야 합니다.",
        400
      );
    }

    res.status(200).json({ message: "사용 가능한 아이디입니다." });
  } catch (error) {
    next(error);
  }
};

/**닉네임 중복검사 */

export const getNickname = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nickname } = req.query;
    await authService.getNickname(nickname);

    if (nickname.length < 2 || nickname.length > 15) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "닉네임은 2자 이상 15자 이내로 설정해야 합니다.",
        400
      );
    }
    res.status(200).json({ message: "사용 가능한 닉네임입니다." });
  } catch (error) {
    next(error);
  }
};

/** 로그인 */
export const login = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const token = await authService.loginUser(username!, password!);
    const refresh = token.refreshToken;
    const user = await authService.getUserByUsername(username);
    if (!user) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "사용자 정보를 찾지 못했습니다.",
        400
      );
    }

    const userData = await authService.getUser(user.id);
    const maxAge = 3600000; //1시간
    await saveSessionToRedis(
      userData!.id,
      "ORIGIN",
      userData!.nickname,
      refresh,
      maxAge
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: maxAge,
      })
      .status(200)
      .json({
        message: "로그인 성공",
      });
  } catch (error) {
    next(error);
  }
};

export const getSessionData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      next();
      return;
    }

    const sessionData = await getSessionFromRedis(userId);
    const nickname = sessionData.nickname;
    const role = req.user?.role;

    const userDataForStateUser = { nickname, role };
    res.status(200).json(userDataForStateUser);
  } catch (error) {
    console.error("세션 데이터 조회 에러:", error);
    next(error);
  }
};

/** 로그아웃 */
export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "로그아웃 되었습니다." });
  } catch (error) {
    next(error);
  }
};
/** 아이디 찾기 */
export const findUsernameByEmail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const username = await authService.findUsernameByEmail(email);

    res.status(200).json({ message: `회원님의 아이디는 ${username}입니다.` });
  } catch (error) {
    next(error);
  }
};
/** 비밀번호 찾기 */
export const resetPasswordByEmail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const { username } = req.body;

    await authService.resetPasswordByEmail(username, email);
    res
      .status(200)
      .json({ message: "이메일로 임시 비밀번호가 전송되었습니다." });
  } catch (error) {
    next(error);
  }
};
