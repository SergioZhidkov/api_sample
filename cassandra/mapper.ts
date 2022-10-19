import cassandra from 'cassandra-driver';
import { client } from './client';

import { AppConfigModel } from './models/appConfig';
import { UserChannelsSubscriptionsModel } from './models/userChannelsSubscriptions';
import { ChannelsModel } from './models/channels';

const Mapper = cassandra.mapping.Mapper;

export const dbMap = new Mapper(client, {
    models: {
        'AppConfigModel': AppConfigModel,
        'UserChannelsSubscriptionsModel': UserChannelsSubscriptionsModel,
        'ChannelsModel': ChannelsModel
    }
});

interface IdbAppConfigMapper extends cassandra.mapping.ModelMapper<any> {
    updateVal?: (doc: any, executionOptions?: string | cassandra.mapping.MappingExecutionOptions) => Promise<cassandra.mapping.Result<any>>
}

export const dbAppConfigMapper: IdbAppConfigMapper = dbMap.forModel('AppConfigModel');
export const dbChannelsMapper = dbMap.forModel('ChannelsModel');
export const dbUserChannelsSubscriptionsMapper = dbMap.forModel('UserChannelsSubscriptionsModel');
