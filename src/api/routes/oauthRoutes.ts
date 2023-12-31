import { Router } from "express";
import * as oauthController from "../../controllers/oauthController";

const router = Router();

// /** [인증] 카카오 콜백 */
router.get("/kakao/callback", oauthController.kakaoCallback);

// /** [인증] 구글 콜백 */
router.get("/google/callback", oauthController.googleCallback);

export default router;
