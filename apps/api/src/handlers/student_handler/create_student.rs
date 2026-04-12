use axum::Json;
use axum::extract::State;
use chrono::Utc;

use crate::domain::models::student::StudentError;
use crate::handlers::student_handler::types::{CreateStudentRequest, StudentResponse, to_response};
use crate::infra::repositories::student_repository::{self, NewStudentDB};
use crate::state::AppState;
use crate::utils::custom_extractors::json_extractor::JsonExtractor;

pub async fn create_student(
    State(state): State<AppState>,
    JsonExtractor(student_req): JsonExtractor<CreateStudentRequest>,
) -> Result<Json<StudentResponse>, StudentError> {
    let current_time = Utc::now();
    let new_student_db = NewStudentDB {
        roll_no: student_req.roll_no,
        class: student_req.class,
        name: student_req.name,
        section: student_req.section,
        created_at: current_time,
        last_updated: current_time,
    };
    let created_student = student_repository::insert(&state.pool, new_student_db)
        .await
        .map_err(StudentError::InfraError)?;
    Ok(Json(to_response(created_student)))
}
