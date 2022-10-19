import { Client } from '@elastic/elasticsearch';
import { IChannel } from 'newsproject_types';


const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200';


//FOR CHANNELS
export const CHANNEL_INDEX = 'channels';
//FOR MATERIALS
export const MATERIAL_INDEX = 'materials';

export interface ISearchResult {
    data: IChannel[],
    total: {
        value: number;
        relation: string;
    }
}

export interface ISearchResultIndex {
    index: typeof CHANNEL_INDEX | typeof MATERIAL_INDEX,
    result: ISearchResult
}

export const Elastic = new Client({
    node: elasticUrl
})


//create indexes if not exists
Elastic.indices.exists({ index: CHANNEL_INDEX })
    .then((isExists) => {
        if (!isExists) {
            return Elastic.indices.create({ index: CHANNEL_INDEX });
        }

    }).catch(() => {
        return null;
    });


Elastic.indices.exists({ index: MATERIAL_INDEX })
    .then((isExists) => {
        if (!isExists) {
            return Elastic.indices.create({ index: MATERIAL_INDEX });
        }
    }).catch(() => {
        return null;
    });

//create indexes if not exists end