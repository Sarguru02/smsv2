use axum::Json;
use axum::extract::State;

use crate::domain::models::student::StudentError;
use crate::handlers::student_handler::types::{StudentResponse, UpdateStudentRequest, to_response};
use crate::infra::errors::InfraError;
use crate::infra::repositories::student_repository::{UpdateStudent, update};
use crate::state::AppState;
use crate::utils::custom_extractors::json_extractor::JsonExtractor;

pub async fn update_student(
    State(state): State<AppState>,
    JsonExtractor(student_updates): JsonExtractor<UpdateStudentRequest>,
) -> Result<Json<StudentResponse>, StudentError> {
    let update_student_db = UpdateStudent {
        roll_no: student_updates.roll_no,
        name: student_updates.name,
        class: student_updates.class,
        section: student_updates.section,
    };
    let updated_student = update(&state.pool, student_updates.id, update_student_db)
        .await
        .map_err(|err| match err {
            InfraError::NotFound => StudentError::NotFound(student_updates.id),
            InfraError::InternalServerError(_) => StudentError::InternalServerError,
        })?;
    Ok(Json(to_response(updated_student)))
}
