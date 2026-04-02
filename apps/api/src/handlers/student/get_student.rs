use axum::Json;
use axum::extract::{Query, State};

use crate::domain::models::student::StudentError;
use crate::handlers::student::types::{ListStudentResponse, StudentResponse, to_response};
use crate::infra::errors::InfraError;
use crate::infra::repositories::student_repository::{
    StudentFilter, get, get_with_filter, get_with_roll_no,
};
use crate::state::AppState;
use crate::utils::custom_extractors::path_extractor::PathExtractor;

pub async fn get_student(
    State(state): State<AppState>,
    PathExtractor(student_id): PathExtractor<i64>,
) -> Result<Json<StudentResponse>, StudentError> {
    let fetched_student = get(&state.pool, student_id)
        .await
        .map_err(|err| match err {
            InfraError::NotFound => StudentError::NotFound(student_id),
            InfraError::InternalServerError => StudentError::InternalServerError,
        })?;
    Ok(Json(to_response(fetched_student)))
}

pub async fn list_students(
    State(state): State<AppState>,
    Query(params): Query<StudentFilter>,
) -> Result<Json<ListStudentResponse>, StudentError> {
    let res = get_with_filter(&state.pool, params)
        .await
        .map_err(|_| StudentError::InternalServerError)?;
    Ok(Json(ListStudentResponse {
        students: res.students.into_iter().map(to_response).collect(),
        pagination: res.pagination,
    }))
}

pub async fn get_by_roll_no(
    State(state): State<AppState>,
    PathExtractor(roll_no): PathExtractor<String>,
) -> Result<Json<StudentResponse>, StudentError> {
    let fetched_student = get_with_roll_no(&state.pool, roll_no.clone())
        .await
        .map_err(|err| match err {
            InfraError::NotFound => StudentError::RollNoNotFound(roll_no),
            InfraError::InternalServerError => StudentError::InternalServerError,
        })?;
    Ok(Json(to_response(fetched_student)))
}
