import express from 'express';
import * as userIsAuthorizedController from '#controllers/user/user-is-authorized-controller';

const router = express.Router();

router.get('/', userIsAuthorizedController.rootGet);

export { router as userIsAuthorizedRouter };
