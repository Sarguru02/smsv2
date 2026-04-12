use std::env;

use dotenvy::dotenv;
use tokio::sync::OnceCell;

#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
}

#[derive(Debug)]
struct DatabaseConfig {
    url: String,
}

#[derive(Debug)]
pub struct Config {
    server: ServerConfig,
    db: DatabaseConfig,
    salt_rounds: u32,
}

impl Config {
    pub fn db_url(&self) -> &str {
        &self.db.url
    }

    pub fn server_host(&self) -> &str {
        &self.server.host
    }

    pub fn server_port(&self) -> u16 {
        self.server.port
    }

    pub fn salt_rounds(&self) -> u32 {
        self.salt_rounds
    }
}

pub static CONFIG: OnceCell<Config> = OnceCell::const_new();

async fn init_config() -> Config {
    dotenv().ok();

    let server_config = ServerConfig {
        host: env::var("HOST").unwrap_or_else(|_| String::from("127.0.0.1")),
        port: env::var("PORT")
            .unwrap_or_else(|_| String::from("8000"))
            .parse::<u16>()
            .unwrap(),
    };

    let db_config = DatabaseConfig {
        url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
    };

    let salt_rounds = env::var("SALT_ROUNDS")
        .unwrap_or_else(|_| {
            tracing::warn!("No value set for SALT_ROUNDS");
            "12".to_string()
        })
        .parse::<u32>()
        .unwrap();
    Config {
        server: server_config,
        db: db_config,
        salt_rounds,
    }
}

pub async fn config() -> &'static Config {
    CONFIG.get_or_init(init_config).await
}
