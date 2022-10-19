import cassandra, { errors } from 'cassandra-driver';

const UnderscoreCqlToCamelCaseMappings = cassandra.mapping.UnderscoreCqlToCamelCaseMappings;

export interface IChannelStatisticsModel {
    channelId: string,
    year: number,
    month: number,
    day: number,
    viewsCount: bigint,
    materialCount: bigint,
    subscribesCount: bigint,
    unsubscribesCount: bigint
}

export const ChannelsStatisticsModel: cassandra.mapping.ModelOptions = {
    tables: ['channels_statistics'],
    mappings: new UnderscoreCqlToCamelCaseMappings(),
    columns: {
        'channel_id': 'channelId',
        'views_count': 'viewsCount',
        'material_count': 'materialCount',
        'subscribes_count': 'subscribesCount',
        'unsubscribes_count': 'unsubscribesCount'
    }
}

