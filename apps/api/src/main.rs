// Define needed modules
mod config;
mod domain;
mod errors;
mod handlers;
mod infra;
mod middleware;
mod routes;
mod state;
mod utils;

use std::net::SocketAddr;
use std::sync::atomic::AtomicU64;

use deadpool_diesel::postgres::Pool;
use deadpool_diesel::{Manager, Runtime};
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};
use fastrace::collector::{Config, ConsoleReporter};
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use crate::config::config;
use crate::errors::{AppError, internal_error};
use crate::routes::get_app;
use crate::state::AppState;

static LOG_COUNTER: AtomicU64 = AtomicU64::new(1);
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations/");

#[tokio::main]
async fn main() {
    init_tracing();

    let app_config = config().await;

    let manager = Manager::new(app_config.db_url().to_string(), Runtime::Tokio1);
    let pool = Pool::builder(manager)
        .build()
        .expect("Failed to create connection pool");

    if let Err(err) = run_migrations(&pool).await {
        tracing::error!("Failed to run migrations!!!:{:?}", err);
        return;
    }

    let state = AppState {
        pool,
        salt_rounds: app_config.salt_rounds(),
    };

    let host = app_config.server_host();
    let port = app_config.server_port();
    let address = format!("{}:{}", host, port);
    let socket_addr: SocketAddr = address.parse().expect("Unable to parse the socket address");

    tracing::info!("Listening on http://{}", address);
    let listener = tokio::net::TcpListener::bind(socket_addr)
        .await
        .expect("Failed to bind server");

    let app = get_app(state);

    axum::serve(listener, app)
        .await
        .expect("Server failed to run");

    fastrace::flush();
}

fn init_tracing() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(fastrace_tracing::FastraceCompatLayer::new())
        .init();

    fastrace::set_reporter(ConsoleReporter, Config::default());
}

async fn run_migrations(pool: &Pool) -> Result<(), AppError> {
    let conn = pool.get().await.map_err(internal_error)?;
    conn.interact(|conn_inner| conn_inner.run_pending_migrations(MIGRATIONS).map(|_| ()))
        .await
        .map_err(internal_error)?
        .map_err(internal_error)?;
    Ok(())
}
