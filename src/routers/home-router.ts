import express from 'express';
import * as homeController from '#controllers/home-controller';

const router = express.Router();

router.get('/', homeController.rootGet);

export { router as homeRouter };
