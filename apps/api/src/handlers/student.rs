mod create_student;
mod delete_student;
mod get_student;
mod update_student;

pub mod types;

pub use create_student::create_student;
pub use delete_student::delete_student;
pub use get_student::get_by_roll_no;
pub use get_student::get_student;
pub use get_student::list_students;
pub use update_student::update_student;
