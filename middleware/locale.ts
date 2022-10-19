
import { Response, NextFunction } from 'express';
import { RequestWithAccessToken } from './accessToken';


const getLocale = async (req: RequestWithAccessToken, res: Response, next: NextFunction) => {

    //TODO
    console.log(req.headers['accept-language'])

    next();
}

export default getLocale;