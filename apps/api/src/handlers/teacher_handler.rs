mod create_teacher;

mod types;

use axum::Router;
use axum::routing::post;
use create_teacher::create_teacher;

use crate::state::AppState;

pub fn router(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_teacher))
        .with_state(state)
}
