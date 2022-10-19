import { IChannel } from 'newsproject_types';
import { IChannelModel } from '../cassandra/models/channels';
import { IUserChannelsSubscriptionsModel } from '../cassandra/models/userChannelsSubscriptions';
import { dbChannelsMapper, dbUserChannelsSubscriptionsMapper, dbMap } from '../cassandra/mapper';
import { types } from 'cassandra-driver';
import { Elastic, CHANNEL_INDEX } from '../elastic/client';



interface Res {
    statusCode: number,
    message: string
}

export class Channel {
    private _data: IChannelModel;

    constructor(channel: IChannelModel) {
        this._data = channel;
    }


    save = () => {
        let _data = this._data;
        let _ownerId = this._data.ownerId;

        return new Promise<IChannelModel>(function (resolve, reject) {
            try {
                Channel.getFromDbById(_data.channelId).then((_channel) => {

                    if (_channel.ownerId.toString() !== _ownerId.toString()) {
                        reject({
                            statusCode: 403,
                            message: "Not owner. Rejected."
                        })
                    }

                    _data.updatedAt = new Date();

                    Elastic.update({
                        index: CHANNEL_INDEX,
                        id: _data.channelId,
                        doc: _data,
                        doc_as_upsert: true
                    }).catch((_) => {

                        reject({
                            statusCode: 400,
                            message: "Error while updating search channel."
                        })

                    })

                    dbChannelsMapper.update(_data)
                        .then(() => {
                            resolve(_data)
                        }).catch(() => {
                            reject({
                                statusCode: 400,
                                message: "Error while updating channel."
                            })

                        });

                }).catch(() => {
                    Elastic.index({
                        index: CHANNEL_INDEX,
                        document: _data
                    });

                    dbChannelsMapper.insert(_data);

                    resolve(_data);
                })



            } catch (e) {
                reject({
                    statusCode: 400,
                    message: "Error while operating channel."
                })

            }

        })

    }

    setOwnerId = (ownerId: string) => {
        this._data.ownerId = types.Uuid.fromString(ownerId);
        return this;
    }

    setCreatedAt(date: Date) {
        this._data.createdAt = date;
        return this;
    }


    setUpdatedAt(date: Date) {
        this._data.updatedAt = date;
        return this;
    }


    setSubscribeStatus(status: boolean) {
        this._data.isSubscribed = status;
        return this;
    }


    setContactEmail(email: string) {
        this._data.contactEmail = email;
        return this;
    }

    static toModel = (channel: IChannel): IChannelModel => {
        return {
            channelId: channel.id,
            ownerId: channel.ownerId ? types.Uuid.fromString(channel.ownerId) : undefined,
            createdAt: channel.createdAt ? channel.createdAt : new Date(),
            title: channel.title,
            website: channel.website,
            theme: channel.theme,
            avatar: channel.avatar,
            description: channel.description,
            contactEmail: channel.contactEmail,
            banner: channel.banner,
            watermark: channel.watermark,
            ban: channel.ban
        }
    }

    getData = (): IChannel => {
        return {
            id: this._data.channelId,
            ownerId: this._data.ownerId.toString(),
            createdAt: this._data.createdAt ? this._data.createdAt : new Date(),
            title: this._data.title,
            website: this._data.website,
            theme: this._data.theme,
            avatar: this._data.avatar,
            description: this._data.description,
            contactEmail: this._data.contactEmail,
            banner: this._data.banner,
            watermark: this._data.watermark,
            ban: this._data.ban,
            isSubscribed: this._data.isSubscribed
        }
    }

    static getFromDbById = (channelId: string): Promise<IChannelModel> => {

        return new Promise<IChannelModel>(async function (resolve, reject) {

            let _channel: IChannelModel = await (await dbChannelsMapper.find({ channelId })).first();

            if (!_channel) reject({
                statusCode: 404,
                message: "Channel not found."
            })

            resolve(_channel);
        })
    }


    static delete = (id: string, userid: string) => {

        return new Promise<Res>(async function (resolve, reject) {

            let _channel: IChannelModel = await Channel.getFromDbById(id);

            if (!_channel) reject({
                statusCode: 404,
                message: "Channel not found. Rejected."
            })

            if (_channel.ownerId.toString() !== userid) reject({
                statusCode: 403,
                message: "Not owner. Rejected."
            })

            await dbChannelsMapper.remove(_channel).then(() => {
                resolve({
                    statusCode: 200,
                    message: 'Successfully deleted.'
                })

            }).catch(() => {

                reject({
                    statusCode: 400,
                    message: "Error while deleting channel."
                })

            })

        })

    }

    static getSubscribeStatus = async (channelId: string, userid: string): Promise<boolean> => {
        let _result = false;

        await dbUserChannelsSubscriptionsMapper.find({ userId: userid, channelId }).then((x) => {
            if (x.first()) {
                _result = true;
            }
        })

        return _result;
    }


    static subscribe = (channelId: string, userid: string) => {

        return new Promise<IChannel>(async function (resolve, reject) {
            let _channel: IChannelModel = await Channel.getFromDbById(channelId)

            if (!_channel) reject({
                statusCode: 404,
                message: "Channel not found. Rejected."
            })


            let subscribeData: IUserChannelsSubscriptionsModel = {
                ...{
                    userId: types.Uuid.fromString(userid),
                    subscribedAt: new Date()
                },
                ..._channel
            }

            const queries = [
                dbUserChannelsSubscriptionsMapper.batching.insert(subscribeData, { ifNotExists: true })
            ];

            return await dbMap.batch(queries).then(() => {
                resolve(new Channel(_channel).getData());
            }).catch(() => {
                reject({
                    statusCode: 404,
                    message: "Cannot subscribe. Try later."
                })
            })

        });

    }

    static unsubscribe = (id: string, userid: string) => {

        return new Promise<Res>(async function (resolve, reject) {
            let _channel: IChannelModel = await Channel.getFromDbById(id)

            if (!_channel) reject({
                statusCode: 404,
                message: "Channel not found. Rejected."
            })

            let subscribeData: IUserChannelsSubscriptionsModel = {
                ...{
                    userId: types.Uuid.fromString(userid),
                    subscribedAt: new Date()
                },
                ..._channel
            }

            const queries = [
                dbUserChannelsSubscriptionsMapper.batching.remove(subscribeData)
            ];

            return await dbMap.batch(queries).then(() => {
                resolve({
                    statusCode: 200,
                    message: "Sucsessfully unsubscribed."
                })
            }).catch(() => {
                reject({
                    statusCode: 404,
                    message: "Cannot unsubscribe. Try later."
                })
            })

        });

    }

}