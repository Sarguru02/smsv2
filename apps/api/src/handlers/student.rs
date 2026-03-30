mod create_student;
mod delete_student;
mod get_student;
mod update_student;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::domain::models::student::StudentModel;
use crate::infra::repositories::Pagination;

pub use create_student::create_student;
pub use delete_student::delete_student;
pub use get_student::get_by_roll_no;
pub use get_student::get_student;
pub use get_student::list_students;
pub use update_student::update_student;

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
    students: Vec<StudentResponse>,
    pagination: Pagination,
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
