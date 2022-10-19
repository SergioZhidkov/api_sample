module.exports = {
    fields: {
        channel_id: "text",
        owner_id: "uuid",
        created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        updated_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        title: "text",
        website: "text",
        contact_email: "text",
        theme: "text",
        avatar: {
            type: 'frozen',
            typeDef: '<db_image_type>'
        },
        description: "text",
        banner: {
            type: 'frozen',
            typeDef: '<db_image_type>'
        },
        watermark: {
            type: 'frozen',
            typeDef: '<db_image_type>'
        },
        status_code: "int",
        ban: {
            type: 'frozen',
            typeDef: '<db_content_ban_type>'
        }
    },

    clustering_order: { "created_at": "desc" },
    key: [['owner_id'], 'channel_id', 'theme', 'created_at'],
    table_name: "owner_channels",
}