import express from 'express';
import * as userController from '#controllers/user/user-controller';

const router = express.Router();

router.get('/', userController.rootGet);

export { router as userRouter };
