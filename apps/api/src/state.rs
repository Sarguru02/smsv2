use deadpool_diesel::postgres::Pool;

use crate::auth::Keys;

#[derive(Clone)]
pub struct AppState {
    pub pool: Pool,
    pub keys: Keys,
}
