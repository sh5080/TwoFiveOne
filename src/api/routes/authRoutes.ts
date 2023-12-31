import { Router } from "express";
import * as authController from "../../controllers/authController";
import { validateRequestBody } from "../middlewares/validateRequest";
import { isLoggedIn, validateToken } from "../middlewares/jwt";

const router = Router();

/** 회원가입 */
router.post(
  "/signup",
  validateRequestBody([
    "username",
    "nickname",
    "password",
    "passwordConfirm",
    "email",
  ]),
  authController.signup
);
/** [회원가입] 아이디 중복검사 */
router.get("/check/username", authController.getUsername);

/** [회원가입] 닉네임 중복검사 */
router.get("/check/nickname", authController.getNickname);

/** [인증] 로그인 */
router.post(
  "/login",
  validateRequestBody(["username", "password"]),
  authController.login
);

/** [인증] 로그아웃 */
router.delete("/logout", authController.logout);

/** [사용자] 아이디 찾기 */
router.get("/Id/:email", authController.findUsernameByEmail);

/** [사용자] 비밀번호 재설정 */
router.post(
  "/Pw/:email",
  validateRequestBody(["username"]),
  authController.resetPasswordByEmail
);

/**[인증] 로그인 유지시 jwt조회 */
router.get("/isAuth", isLoggedIn);

/**[인증] 세션 조회 */
router.get("/getSessionData", isLoggedIn, authController.getSessionData);
export default router;
