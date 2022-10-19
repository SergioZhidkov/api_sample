
import { Request, Response, NextFunction } from 'express';

import { IJWTAccessToken } from 'newsproject_types';

export interface RequestWithAccessToken extends Request {
    accessToken?: IJWTAccessToken,
    userAgent: string,
    realIp: string,
}

import * as jwt from "jsonwebtoken";

export const withAccessToken = (req: RequestWithAccessToken, res: Response, next: NextFunction) => {

    let authorization = req.headers.authorization && req.headers.authorization.split(' ');

    req.realIp = req.headers['x-real-ip'] as string || req.ip;
    req.userAgent = req.headers['user-agent'];

    if (authorization) {
        if (authorization[0] !== 'JWT') return res.status(400).json({ message: 'Authorization token provided but token has invalid type.' })

        let accessToken = authorization[1]

        if (!accessToken) return res.status(400).json({ message: 'Authorization token provided without accessToken.' })

        try {
            const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

            req.accessToken = payload as IJWTAccessToken;

        } catch (e) {

            if (e instanceof jwt.TokenExpiredError) {
                
                //console.log('Access token expired in middleware.');
                return res.status(401).json({ message: "Access token expired." })
            }

            if (e instanceof jwt.JsonWebTokenError) {
               
                //console.log('Invalid access token.');
                return res.status(403).send({ message: "Invalid access token." })
            }

            return res.status(400).json({ message: e.message })
        }
    } 

    next();
}

export const accessTokenRequired = (req: RequestWithAccessToken, res: Response, next: NextFunction) => {

    if (req.accessToken) {
        next();
    } else {
        return res.status(401).send('No access token provided.');
    }

}
