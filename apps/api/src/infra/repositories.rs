use serde::{Deserialize, Serialize};

pub mod student_repository;

#[derive(Debug, Deserialize, Serialize)]
pub struct Pagination {
    page: i64,
    limit: i64,
    total: i64,
    total_pages: i64,
}
