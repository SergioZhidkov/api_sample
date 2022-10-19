import cassandra, { errors } from 'cassandra-driver';
import { IImage, IContentBan } from 'newsproject_types'

//statusCodes
const UnderscoreCqlToCamelCaseMappings = cassandra.mapping.UnderscoreCqlToCamelCaseMappings;

export interface IChannelModel {
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
    ban?: IContentBan,
    isSubscribed?: boolean
}


export const ChannelsModel: cassandra.mapping.ModelOptions = {
    tables: ['channels', 'owner_channels'],
    mappings: new UnderscoreCqlToCamelCaseMappings(),
    columns: {
        'channel_id': 'channelId',
        'owner_id': "ownerId",
        'created_at': "createdAt",
        'updated_at': "updatedAt",
        'status_code': "statusCode",
        'contact_email': "contactEmail"
    }
}
