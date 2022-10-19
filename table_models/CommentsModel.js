module.exports = {
    fields: {
        discussion_id: "uuid",
        id: "timeuuid",
        created_by: "uuid",
        created_at: {
            type: "timestamp",
            default: { "$db_function": "toTimestamp(now())" }
        },
        parent_id: "timeuuid",
        content: "blob",
        is_deleted: "boolean",
        prev_content: "blob",
        like_count: "bigint",
        dislike_count: "bigint"
    },

    clustering_order: { "id": "desc" },
    key: [['discussion_id'], 'id'],
    table_name: "comments",
}
