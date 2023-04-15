import express from 'express';
import * as adminLogoutController from '#controllers/admin/admin-logout-controller';

const router = express.Router();

router.post('/', adminLogoutController.rootPost);

export { router as adminLogoutRouter };
