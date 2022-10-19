import { Router, Response } from 'express';


import { accessTokenRequired, RequestWithAccessToken } from '../middleware/accessToken';

import { IChannel, ISession } from 'newsproject_types';
import { dbChannelsMapper, dbUserChannelsSubscriptionsMapper } from '../cassandra/mapper';

import signinAxiosInstance from '../libs/signinAxios';
import { IChannelModel } from '../cassandra/models/channels';
import { Channel } from '../classes/Channel';
const channelsRoutes = Router();

channelsRoutes
    //get all user's channels list
    .get('/my', [accessTokenRequired], (req: RequestWithAccessToken, res: Response) => {
        let channels: IChannel[] = [];

        let limit = req.query.limit ? Number(req.query.limit) : 10;
        let pageState = req.query.pagestate ? req.query.pagestate : null;

        dbChannelsMapper.find({ ownerId: req.accessToken.userid }, { fields: ['createdAt', 'avatar', 'channelId', 'theme', 'title', 'statusCode', 'description', 'ownerId', 'banner'] }, {
            fetchSize: limit,
            pageState: Number(pageState)
        }).then((x: any) => {

            x.forEach((row: IChannelModel) => {
                channels.push(new Channel(row).getData());
            })

            return res.status(200).json({
                result: channels,
                pageState: x.pageState
            })

        }).catch(() => {

            return res.status(400).json({ message: 'Error while getting channel`s list.' })
        })
    })

    //get all channels subscribed
    .get('/subscribed', [accessTokenRequired], (req: RequestWithAccessToken, res: Response) => {
        let channels: IChannel[] = [];

        let limit = req.query.limit ? Number(req.query.limit) : 10;
        let pageState = req.query.pagestate ? req.query.pagestate : null;

        dbUserChannelsSubscriptionsMapper.find({ userId: req.accessToken.userid }, {}, {
            fetchSize: limit,
            pageState: Number(pageState)
        }).then((x: any) => {

            x.forEach((row: IChannelModel) => {
                channels.push(new Channel(row).getData());
            })

            return res.status(200).json({
                result: channels,
                pageState: x.pageState
            })

        }).catch(() => {
            return res.status(400).json({ message: 'Error while getting channel`s list.' })
        })
    })


    .get('/checkByAddress', (req: RequestWithAccessToken, res: Response) => {
        let id = req.query.val;

        dbChannelsMapper.find({ channelId: id }).then((x) => {
            if (x.first()) {
                return res.status(200).json({ found: true })
            } else {
                return res.status(200).json({ found: false })
            }
        }).catch((error) => {
            return res.status(400).json(error)
        })
    })


    .post('/', [accessTokenRequired], async (req: RequestWithAccessToken, res: Response) => {

        let _channel = new Channel(Channel.toModel(req.body.data))
            .setOwnerId(req.accessToken.userid)
            .setCreatedAt(new Date())

        await signinAxiosInstance.get<ISession>('/auth/user', {
            headers: {
                'authorization': req.headers.authorization
            }
        }).then((session) => {
            _channel.setContactEmail(session.data.user.email)
        }).catch(() => {
            return res.status(400).json({ message: 'Cannot get user`s contact email.' })
        })

        _channel.save()
            .then(() => {
                return res.status(200).json(_channel.getData())
            }).catch(() => {
                return res.status(400).json({ message: 'Error while creating new channel.' })
            })


    })
    .put('/', [accessTokenRequired], async (req: RequestWithAccessToken, res: Response) => {

        let _channel = new Channel(Channel.toModel(req.body.data))
            .setOwnerId(req.accessToken.userid)

        _channel.save()
            .then(() => {
                return res.status(200).json(_channel.getData())
            }).catch((err) => {
                return res.status(err.statusCode).json({ message: err.message })
            })

    })

    .get('/:id', (req: RequestWithAccessToken, res: Response) => {
        let { id } = req.params;

        //let onlyOwner = req.query.onlyOwner;


        Channel.getFromDbById(id).then(async (channel) => {

            let _channel = new Channel(channel)
            if (req.accessToken) {
                _channel.setSubscribeStatus(await Channel.getSubscribeStatus(channel.channelId, req.accessToken.userid))
            } else {
                _channel.setSubscribeStatus(false)
            }

            return res.status(200).json(_channel.getData())
        }).catch(() => {
            return res.status(400).json({ message: 'Error while getting channel.' })
        })
    })

    .delete('/:id', [accessTokenRequired], async (req: RequestWithAccessToken, res: Response) => {
        let { id } = req.params

        await Channel.delete(id, req.accessToken.userid).then((x) => {
            return res.status(x.statusCode).json({ message: x.message })
        }).catch(() => {
            return res.status(400).json({ message: 'Error while deleting channel.' })
        })

    })

    .post('/:id/subscribe', [accessTokenRequired], async (req: RequestWithAccessToken, res: Response) => {
        let { id } = req.params;

        await Channel.subscribe(id, req.accessToken.userid).then((channel) => {
            return res.status(200).json(channel)
        }).catch(() => {
            return res.status(400).json({ message: 'Error while subscribing channel.' })
        })
    })

    .post('/:id/unsubscribe', [accessTokenRequired], async (req: RequestWithAccessToken, res: Response) => {
        let { id } = req.params;

        await Channel.unsubscribe(id, req.accessToken.userid).then((x) => {
            return res.status(x.statusCode).json({ message: x.message })
        }).catch(() => {
            return res.status(400).json({ message: 'Error while subscribing channel.' })
        })
    })


export default channelsRoutes;