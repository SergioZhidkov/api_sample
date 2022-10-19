import cassandra from 'cassandra-driver';
import { IImage, IContentBan } from 'newsproject_types'
const UnderscoreCqlToCamelCaseMappings = cassandra.mapping.UnderscoreCqlToCamelCaseMappings;

export interface IUserChannelsSubscriptionsModel {
    userId: cassandra.types.Uuid,
    subscribedAt: Date,
    channelId: string,
    ownerId?: cassandra.types.Uuid,
    createdAt: Date,
    updatedAt?: Date,
    title: string,
    website?: string,
    theme: string,
    avatar: IImage,
    description?: string,
    contactEmail: string,
    banner?: IImage,
    watermark?: IImage,
    ban?: IContentBan
}


export const UserChannelsSubscriptionsModel: cassandra.mapping.ModelOptions = {
    tables: ['user_channels_subscriptions'],
    mappings: new UnderscoreCqlToCamelCaseMappings(),
    columns: {
        'user_id': 'userId',
        'subscribed_at': 'subscribedAt',
        'channel_id': 'channelId',
        'owner_id': "ownerId",
        'created_at': "createdAt",
        'updated_at': "updatedAt",
        'status_code': "statusCode",
        'contact_email': "contactEmail"
    }
}

