import express from 'express';
import * as accountAuthController from '#controllers/user/user-auth-controller';

const router = express.Router();

router.get('/', accountAuthController.rootGet);

router.get('/login-signup', accountAuthController.loginSignupGet);

router.get('/login', accountAuthController.loginGet);

router.post('/login', accountAuthController.loginPost);

router.get('/signup', accountAuthController.signupGet);

router.post('/signup', accountAuthController.signupPost);

router.post('/user', accountAuthController.userPost);

router.get('/user/:username', accountAuthController.userGet);

router.get('/check-user/:username', accountAuthController.checkUserGet);

export { router as userAuthRouter };
