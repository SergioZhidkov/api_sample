module.exports = {
    fields: {
        user_id: "uuid",
        infinite_scroll: "boolean",
        search_in_author: "boolean",
        search_in_material: "boolean",
        show_to_top: "boolean",
        theme: "text",
        lang: "text"
    },

    key: ['user_id'],
    table_name: "app_config",
}