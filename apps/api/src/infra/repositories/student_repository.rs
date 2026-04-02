use chrono::{DateTime, Utc};
use diesel::prelude::{AsChangeset, Queryable};
use diesel::{ExpressionMethods, PgTextExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use diesel::{Selectable, prelude::Insertable};
use serde::{Deserialize, Serialize};

use crate::domain::models::student::StudentModel;
use crate::infra::db::schema::student;
use crate::infra::errors::{InfraError, adapt_infra_error};
use crate::infra::repositories::Pagination;

// struct representing Student schema
#[derive(Serialize, Queryable, Selectable)]
#[diesel(table_name=student)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct StudentDB {
    pub id: i64,
    pub roll_no: String,
    pub name: String,
    pub class: String,
    pub section: String,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}

#[derive(Deserialize, Insertable)]
#[diesel(table_name=student)]
pub struct NewStudentDB {
    pub roll_no: String,
    pub name: String,
    pub class: String,
    pub section: String,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}

#[derive(AsChangeset)]
#[diesel(table_name=student)]
pub struct UpdateStudent {
    pub roll_no: Option<String>,
    pub name: Option<String>,
    pub class: Option<String>,
    pub section: Option<String>,
}

#[derive(Deserialize, Clone)]
pub struct StudentFilter {
    pub class: Option<String>,
    pub section: Option<String>,
    pub name: Option<String>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

pub struct ListStudent {
    pub students: Vec<StudentModel>,
    pub pagination: Pagination,
}

impl StudentFilter {
    pub fn apply<'a>(
        self,
        mut query: student::BoxedQuery<'a, diesel::pg::Pg>,
    ) -> student::BoxedQuery<'a, diesel::pg::Pg> {
        if let Some(class) = self.class {
            query = query.filter(student::class.eq(class));
        }

        if let Some(section) = self.section {
            query = query.filter(student::section.eq(section));
        }

        if let Some(name) = self.name {
            query = query.filter(student::name.ilike(format!("%{}%", name)));
        }
        query
    }

    pub fn pagination<'a>(
        self,
        mut query: student::BoxedQuery<'a, diesel::pg::Pg>,
    ) -> student::BoxedQuery<'a, diesel::pg::Pg> {
        let page_no = self.page.unwrap_or(1);
        let page_size = self.limit.unwrap_or(10);
        let offset = (page_no - 1) * page_size;
        query = query.limit(page_size).offset(offset);
        query
    }
}

pub async fn insert(
    pool: &deadpool_diesel::postgres::Pool,
    new_student: NewStudentDB,
) -> Result<StudentModel, InfraError> {
    let conn = pool.get().await.map_err(adapt_infra_error)?;
    let res = conn
        .interact(|conn| {
            diesel::insert_into(student::table)
                .values(new_student)
                .returning(StudentDB::as_returning())
                .get_result(conn)
        })
        .await
        .map_err(adapt_infra_error)?
        .map_err(adapt_infra_error)?;

    Ok(to_domain(res))
}

pub async fn get(
    pool: &deadpool_diesel::postgres::Pool,
    id: i64,
) -> Result<StudentModel, InfraError> {
    let conn = pool.get().await.map_err(adapt_infra_error)?;
    let res = conn
        .interact(move |conn| {
            student::table
                .filter(student::id.eq(id))
                .select(StudentDB::as_select())
                .get_result(conn)
        })
        .await
        .map_err(adapt_infra_error)?
        .map_err(adapt_infra_error)?;
    Ok(to_domain(res))
}

pub async fn get_with_roll_no(
    pool: &deadpool_diesel::postgres::Pool,
    roll: String,
) -> Result<StudentModel, InfraError> {
    let conn = pool.get().await.map_err(adapt_infra_error)?;
    let res = conn
        .interact(move |conn| {
            student::table
                .filter(student::roll_no.eq(roll))
                .select(StudentDB::as_select())
                .get_result(conn)
        })
        .await
        .map_err(adapt_infra_error)?
        .map_err(adapt_infra_error)?;
    Ok(to_domain(res))
}

pub async fn get_with_filter(
    pool: &deadpool_diesel::postgres::Pool,
    filter: StudentFilter,
) -> Result<ListStudent, InfraError> {
    let conn = pool.get().await.map_err(adapt_infra_error)?;
    let filter_clone = filter.clone();
    let (total, students) = conn
        .interact(move |conn| {
            let mut count_query = student::table.into_boxed::<diesel::pg::Pg>();
            count_query = filter.clone().apply(count_query);
            let total = count_query.count().get_result::<i64>(conn)?;

            let mut data_query = student::table.into_boxed::<diesel::pg::Pg>();
            data_query = filter.clone().apply(data_query);
            data_query = filter.pagination(data_query);
            let students = data_query
                .select(StudentDB::as_select())
                .load::<StudentDB>(conn)?;
            Ok::<_, diesel::result::Error>((total, students))
        })
        .await
        .map_err(adapt_infra_error)?
        .map_err(adapt_infra_error)?;
    let limit = filter_clone.limit.unwrap_or(10);
    let pagination = Pagination {
        page: filter_clone.page.unwrap_or(1),
        limit,
        total,
        total_pages: total / limit,
    };
    Ok(ListStudent {
        students: students.into_iter().map(to_domain).collect(),
        pagination,
    })
}

pub async fn update(
    pool: &deadpool_diesel::postgres::Pool,
    student_id: i64,
    student_updates: UpdateStudent,
) -> Result<StudentModel, InfraError> {
    let conn = pool.get().await.map_err(adapt_infra_error)?;
    let res = conn
        .interact(move |conn| {
            diesel::update(student::table.find(student_id))
                .set((student_updates, student::last_updated.eq(Utc::now())))
                .returning(StudentDB::as_returning())
                .get_result(conn)
        })
        .await
        .map_err(adapt_infra_error)?
        .map_err(adapt_infra_error)?;
    Ok(to_domain(res))
}

pub async fn delete(
    pool: &deadpool_diesel::postgres::Pool,
    student_id: i64,
) -> Result<String, InfraError> {
    let conn = pool.get().await.map_err(adapt_infra_error)?;
    conn.interact(move |conn| diesel::delete(student::table.find(student_id)).execute(conn))
        .await
        .map_err(adapt_infra_error)?
        .map_err(adapt_infra_error)?;
    Ok("Student deleted".to_string())
}

fn to_domain(student_db: StudentDB) -> StudentModel {
    StudentModel {
        id: student_db.id,
        roll_no: student_db.roll_no,
        name: student_db.name,
        class: student_db.class,
        section: student_db.section,
        created_at: student_db.created_at,
        last_updated: student_db.last_updated,
    }
}
