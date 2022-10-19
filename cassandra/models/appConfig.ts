import cassandra, { errors } from 'cassandra-driver';
import { dbAppConfigMapper } from '../mapper';
const UnderscoreCqlToCamelCaseMappings = cassandra.mapping.UnderscoreCqlToCamelCaseMappings;

export interface IBan {
    reason: string,
    duration: Date
}

export interface IAppConfigModel {
    userId: cassandra.types.Uuid,
    infiniteScroll: boolean,
    searchInAuthor: boolean,
    searchInMaterial: boolean,
    showToTop: boolean,
    theme: string,
    lang: string,
}

export const AppConfigModel: cassandra.mapping.ModelOptions = {
    tables: ['app_config'],
    mappings: new UnderscoreCqlToCamelCaseMappings(),
    columns: {
        'user_id': "userId",
        'infinite_scroll': 'infiniteScroll',
        'search_in_author': 'searchInAuthor',
        'search_in_material': 'searchInMaterial',
        'show_to_top': 'showToTop'
    }
}