import middlewares from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';

import profileRoutes from './profile';

const router = Router();

router.use('/user', middlewares.session(), (req, res) => res.json(req.user || {}));

router.use('/data', (_, res) =>
  res.json({
    message: 'Hello Blocklet!',
  }),
);

router.use('/profile', profileRoutes);

export default router;
