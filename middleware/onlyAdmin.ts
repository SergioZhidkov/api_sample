
import { Response, NextFunction } from 'express';
import { RequestWithAccessToken } from './accessToken';


const onlyAdmin = async (req: RequestWithAccessToken, res: Response, next: NextFunction) => {
	//TODO
    next();

}

export default onlyAdmin;