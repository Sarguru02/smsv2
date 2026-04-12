use axum::Json;
use axum::extract::State;
use chrono::Utc;

use crate::domain::models::user::{Role, UserError};
use crate::handlers::teacher_handler::types::{CreateTeacherRequest, TeacherResponse, to_response};
use crate::infra::repositories::users_repository::{self, NewUsersDB};
use crate::state::AppState;
use crate::utils::custom_extractors::json_extractor::JsonExtractor;

pub async fn create_teacher(
    State(state): State<AppState>,
    JsonExtractor(create_req): JsonExtractor<CreateTeacherRequest>,
) -> Result<Json<TeacherResponse>, UserError> {
    let current_time = Utc::now();
    let role = serde_json::to_string(&Role::TEACHER)
        .map_err(|err| UserError::InternalServerError(err.to_string()))?;
    let hashed_password = bcrypt::hash(create_req.password, state.salt_rounds)
        .map_err(|err| UserError::InternalServerError(err.to_string()))?;
    let new_user_db = NewUsersDB {
        username: create_req.username,
        password: hashed_password,
        created_at: current_time,
        last_updated: current_time,
        role,
    };

    let created_teacher = users_repository::insert(&state.pool, new_user_db)
        .await
        .map_err(UserError::InfraError)?;
    Ok(Json(to_response(created_teacher)))
}
