import express from 'express';
import * as userLogoutController from '#controllers/user/user-logout-controller';

const router = express.Router();

router.post('/', userLogoutController.rootPost);

export { router as userLogoutRouter };
