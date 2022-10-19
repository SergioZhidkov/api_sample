module.exports = {
    fields: {
        user_id: 'uuid',
        subscribed_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
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
        ban: {
            type: 'frozen',
            typeDef: '<db_content_ban_type>'
        }
    },
    //clustering_order: { "subscribed_at": "desc" },
    key: [['user_id'], 'channel_id', 'owner_id'],
    //indexes: ['channel_id'],
    table_name: "user_channels_subscriptions",
}