import express from 'express';
import * as adminPanelController from '#controllers/admin/admin-panel-controller';

const router = express.Router();

const nums = new Array(10);
for (let i = 0; i < nums.length; i += 1) {
  nums[i] = i + 1;
}

router.get('/', adminPanelController.rootGet);

export { router as adminPanelRouter };
