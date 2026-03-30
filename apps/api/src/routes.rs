use axum::routing::{delete, get, post, put};
use axum::{Router, http::StatusCode, response::IntoResponse};

use crate::handlers::student::{
    create_student, delete_student, get_by_roll_no, get_student, list_students, update_student,
};
use crate::middleware::apply_middlewares;
use crate::state::AppState;

pub fn get_app(state: AppState) -> Router {
    let router = Router::new()
        .route("/", get(root))
        .nest("/student", student_routes(state.clone()))
        .fallback(handler_404)
        .with_state(state);

    apply_middlewares(router)
}

async fn handler_404() -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        "The Requested resource was not found",
    )
}

async fn root() -> &'static str {
    "OK"
}

pub fn student_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_student))
        .route("/", get(list_students))
        .route("/", put(update_student))
        .route("/{id}", delete(delete_student))
        .route("/{id}", get(get_student))
        .route("/rollNo/{rollNo}", get(get_by_roll_no))
        .with_state(state)
}
