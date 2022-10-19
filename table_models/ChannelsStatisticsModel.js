module.exports = {
    fields: {
        channel_id: "text",
        year: 'int',
        month: "int",
        day: "int",
        views_count: {
            type: "counter",
            default: 0
        },
        material_count: {
            type: "counter",
            default: 0
        },
        subscribes_count: {
            type: "counter",
            default: 0
        },
        unsubscribes_count: {
            type: "counter",
            default: 0
        }
    },
    clustering_order: { "year": "desc", "month": "desc", "day": "desc" },
    key: [['channel_id'], 'year', "month", "day"],
    table_name: "channels_statistics",
}