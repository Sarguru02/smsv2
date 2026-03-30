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
