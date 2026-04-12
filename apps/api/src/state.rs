use deadpool_diesel::postgres::Pool;

#[derive(Clone)]
pub struct AppState {
    pub pool: Pool,
    pub salt_rounds: u32,
}
