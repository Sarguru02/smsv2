use axum::{Json, http::StatusCode, response::IntoResponse};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::infra::errors::InfraError;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UserModel {
    pub id: i64,
    pub username: String,
    pub password: String,
    pub role: Role,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}

#[derive(Debug, Eq, PartialEq, Clone, Deserialize, Serialize)]
pub enum Role {
    STUDENT,
    TEACHER,
    ADMIN,
}

// Errors linked to this domain
pub enum UserError {
    InternalServerError(String),
    NotFound(i64),
    InfraError(InfraError),
}

impl IntoResponse for UserError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(id) => (
                StatusCode::NOT_FOUND,
                format!("User with id {} has not been found", id),
            ),
            Self::InfraError(db_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Internal server error: {}", db_error),
            ),
            Self::InternalServerError(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Internal server error: {}", msg),
            ),
        };
        (
            status,
            Json(json!({"resource": "UserModel", "message": err_msg, "happened_at": Utc::now() })),
        )
            .into_response()
    }
}
