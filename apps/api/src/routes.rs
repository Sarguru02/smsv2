use axum::routing::get;
use axum::{Router, http::StatusCode, response::IntoResponse};

use crate::middleware::apply_middlewares;
use crate::state::AppState;

use crate::handlers::student_handler::router as student_router;
use crate::handlers::teacher_handler::router as teacher_router;

pub fn get_app(state: AppState) -> Router {
    let router = Router::new()
        .route("/", get(root))
        .nest("/student", student_router(state.clone()))
        .nest("/teacher", teacher_router(state.clone()))
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
