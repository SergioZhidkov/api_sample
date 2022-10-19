import cassandra from 'cassandra-driver';


export const client = new cassandra.Client({
    contactPoints: ['31.31.202.98'],
    localDataCenter: 'datacenter1',
    keyspace: 'newsproject'
})