use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::domain::models::user::{Role, UserModel};

#[derive(Debug, Deserialize)]
pub struct CreateTeacherRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct TeacherResponse {
    pub id: i64,
    pub username: String,
    pub role: Role,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}

pub fn to_response(teacher: UserModel) -> TeacherResponse {
    TeacherResponse {
        username: teacher.username,
        id: teacher.id,
        created_at: teacher.created_at,
        last_updated: teacher.last_updated,
        role: teacher.role,
    }
}
