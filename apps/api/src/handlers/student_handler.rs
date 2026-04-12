mod create_student;
mod delete_student;
mod get_student;
mod update_student;

pub mod types;

use axum::Router;
use axum::routing::delete;
use axum::routing::get;
use axum::routing::post;
use axum::routing::put;

use create_student::create_student;
use delete_student::delete_student;
use get_student::get_by_class;
use get_student::get_by_class_section;
use get_student::get_by_roll_no;
use get_student::get_student;
use get_student::list_students;
use update_student::update_student;

use crate::state::AppState;

pub fn router(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_student))
        .route("/", get(list_students))
        .route("/", put(update_student))
        .route("/{id}", delete(delete_student))
        .route("/{id}", get(get_student))
        .route("/rollNo/{rollNo}", get(get_by_roll_no))
        .route("/class/{class}/{section}", get(get_by_class_section))
        .route("/class/{class}", get(get_by_class))
        .with_state(state)
}
