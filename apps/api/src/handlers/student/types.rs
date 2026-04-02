use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::{domain::models::student::StudentModel, infra::repositories::Pagination};

#[derive(Debug, Deserialize)]
pub struct CreateStudentRequest {
    pub name: String,
    pub roll_no: String,
    pub class: String,
    pub section: String,
}

#[derive(Deserialize)]
pub struct UpdateStudentRequest {
    pub id: i64,
    pub roll_no: Option<String>,
    pub class: Option<String>,
    pub section: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct StudentResponse {
    id: i64,
    roll_no: String,
    name: String,
    class: String,
    section: String,
    created_at: DateTime<Utc>,
    last_updated: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ListStudentResponse {
    pub students: Vec<StudentResponse>,
    pub pagination: Pagination,
}

pub fn to_response(student_model: StudentModel) -> StudentResponse {
    StudentResponse {
        id: student_model.id,
        roll_no: student_model.roll_no,
        class: student_model.class,
        section: student_model.section,
        name: student_model.name,
        created_at: student_model.created_at,
        last_updated: student_model.last_updated,
    }
}
