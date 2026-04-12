use axum::routing::{get, post};
use axum::{Router, http::StatusCode, response::IntoResponse};

use crate::auth::{AuthError, JwtPayload};
use crate::handlers::login_handler::login;
use crate::middleware::apply_middlewares;
use crate::state::AppState;

use crate::handlers::student::router as student_router;

pub fn get_app(state: AppState) -> Router {
    let router = Router::new()
        .route("/", get(root))
        .route("/login", post(login))
        .route("/protected", get(protected_route))
        .nest("/student", student_router(state.clone()))
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

async fn protected_route(jwt_payload: JwtPayload) -> Result<String, AuthError> {
    Ok(format!(
        "You are in the protected route, your data: {}",
        jwt_payload
    ))
}
