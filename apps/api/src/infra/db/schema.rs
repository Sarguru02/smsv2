// @generated automatically by Diesel CLI.

diesel::table! {
    student (id) {
        id -> Int8,
        roll_no -> Text,
        name -> Text,
        class -> Text,
        section -> Text,
        created_at -> Timestamptz,
        last_updated -> Timestamptz,
    }
}

diesel::table! {
    users (id) {
        id -> Int8,
        username -> Text,
        password -> Text,
        role -> Text,
        created_at -> Timestamptz,
        last_updated -> Timestamptz,
    }
}

diesel::allow_tables_to_appear_in_same_query!(student, users,);
