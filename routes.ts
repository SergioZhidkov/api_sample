import { Router, Request, Response } from 'express';

import { Elastic, CHANNEL_INDEX } from './elastic/client'

const indexRoutes = Router();

indexRoutes.
    get('/', async (req: Request, res: Response) => {


		return res.status(200).send('/');


    });

export default indexRoutes;