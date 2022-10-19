import express, { Express } from 'express';
require('dotenv').config();


const models = require('express-cassandra');
import cassandra from 'cassandra-driver';
import { withAccessToken } from './middleware/accessToken';
import getLocale from './middleware/locale';



import channelsRoutes from './routes/channel'

import cookieParser from 'cookie-parser';
import cors from 'cors';



const allowedOrigins = ['https://ellpo.ru', 'https://www.ellpo.ru', 'https://admin.ellpo.ru', 'https://api.ellpo.ru', 'https://signin.ellpo.ru'];

const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true
}


const App: Express = module.exports = express();

//middlewares
App.use(cookieParser());
App.use(express.json());
App.use(express.urlencoded({
    extended: true
}));

App.use(cors(corsOptions));
App.use(getLocale);
App.use(withAccessToken);


//routes 
//for example channels 
App.use('/channels', channelsRoutes)

export default App;