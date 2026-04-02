use axum::{Json, http::StatusCode, response::IntoResponse};
use chrono::{DateTime, Utc};
use serde_json::json;

use crate::infra::errors::InfraError;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StudentModel {
    pub id: i64,
    pub name: String,
    pub roll_no: String,
    pub class: String,
    pub section: String,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}

// Errors linked to this domain
pub enum StudentError {
    InternalServerError,
    NotFound(i64),
    InfraError(InfraError),
    RollNoNotFound(String),
}

impl IntoResponse for StudentError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(id) => (
                StatusCode::NOT_FOUND,
                format!("Student with id {} has not been found", id),
            ),
            Self::InfraError(db_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Internal server error: {}", db_error),
            ),
            Self::RollNoNotFound(roll_no) => (
                StatusCode::NOT_FOUND,
                format!("Student with roll no. {} has not been found", roll_no),
            ),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Internal server error"),
            ),
        };
        (
            status,
            Json(
                json!({"resource": "StudentModel", "message": err_msg, "happened_at": Utc::now() }),
            ),
        )
            .into_response()
    }
}
