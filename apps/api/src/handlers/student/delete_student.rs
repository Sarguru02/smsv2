use axum::extract::State;

use crate::domain::models::student::StudentError;
use crate::infra::repositories::student_repository::delete;
use crate::state::AppState;
use crate::utils::custom_extractors::path_extractor::PathExtractor;

pub async fn delete_student(
    State(state): State<AppState>,
    PathExtractor(student_id): PathExtractor<i64>,
) -> Result<String, StudentError> {
    let res = delete(&state.pool, student_id)
        .await
        .map_err(|_| StudentError::NotFound(student_id))?;
    Ok(res)
}
