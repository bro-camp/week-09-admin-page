import express from 'express';
import * as adminAuthController from '#controllers/admin/admin-auth-controller';
import { redirectFromAdminSignupIfNotDevelopment } from '#middlewares/redirections/admin-redirection-middleware';

const router = express.Router();

router.get('/login', adminAuthController.loginGet);

router.post('/login', adminAuthController.loginPost);

router.get(
  '/signup',
  redirectFromAdminSignupIfNotDevelopment,
  adminAuthController.signupGet,
);

router.post(
  '/signup',
  redirectFromAdminSignupIfNotDevelopment,
  adminAuthController.signupPost,
);

export { router as adminAuthRouter };
