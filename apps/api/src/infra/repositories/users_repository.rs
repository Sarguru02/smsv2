use chrono::{DateTime, Utc};
use diesel::prelude::Queryable;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use diesel::{Selectable, prelude::Insertable};
use serde::{Deserialize, Serialize};

use crate::domain::models::user::{Role, UserModel};
use crate::infra::db::schema::users;
use crate::infra::errors::{InfraError, adapt_infra_error};

// struct representing Student schema
#[derive(Serialize, Queryable, Selectable)]
#[diesel(table_name=users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct UsersDB {
    pub id: i64,
    pub username: String,
    pub password: String,
    pub role: String,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}

#[derive(Deserialize, Insertable)]
#[diesel(table_name=users)]
pub struct NewUsersDB {
    pub username: String,
    pub password: String,
    pub role: String,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}

impl TryFrom<UsersDB> for UserModel {
    type Error = InfraError;

    fn try_from(row: UsersDB) -> Result<Self, Self::Error> {
        let role: Role = serde_json::from_str(&row.role)
            .map_err(|err| InfraError::InternalServerError(Some(err.to_string())))?;
        Ok(UserModel {
            id: row.id,
            username: row.username,
            password: row.password,
            role,
            created_at: row.created_at,
            last_updated: row.last_updated,
        })
    }
}

pub async fn insert(
    pool: &deadpool_diesel::postgres::Pool,
    new_user: NewUsersDB,
) -> Result<UserModel, InfraError> {
    let conn = pool.get().await.map_err(adapt_infra_error)?;
    let res = conn
        .interact(|conn| {
            diesel::insert_into(users::table)
                .values(new_user)
                .returning(UsersDB::as_returning())
                .get_result(conn)
        })
        .await
        .map_err(adapt_infra_error)?
        .map_err(adapt_infra_error)?;
    UserModel::try_from(res)
}

pub async fn get_by_username(
    pool: &deadpool_diesel::postgres::Pool,
    username: String,
) -> Result<UserModel, InfraError> {
    let conn = pool.get().await.map_err(adapt_infra_error)?;
    let res = conn
        .interact(move |conn| {
            users::table
                .filter(users::username.eq(username))
                .select(UsersDB::as_select())
                .get_result(conn)
        })
        .await
        .map_err(adapt_infra_error)?
        .map_err(adapt_infra_error)?;
    UserModel::try_from(res)
}
