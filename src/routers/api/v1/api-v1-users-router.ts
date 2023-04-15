import express from 'express';
import * as apiV1UsersController from '#controllers/api/v1/api-v1-users-controller';

const router = express.Router();

router.get('/', apiV1UsersController.usersGet);

router.get('/search', apiV1UsersController.usersSearchGet);

router.post('/one', apiV1UsersController.usersOnePost);

router.delete('/one', apiV1UsersController.usersOneDelete);

router.patch('/one', apiV1UsersController.usersOnePatch);

export { router as apiV1UsersRouter };
