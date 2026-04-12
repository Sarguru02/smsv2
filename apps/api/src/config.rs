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
    jwt_secret: String,
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

    pub fn jwt_signing_key(&self) -> &str {
        &self.jwt_secret
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

    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| {
        let default_key = "jwt_secret_for_smsv2";
        tracing::info!("Using default JWT_SECRET: {}", default_key);
        default_key.to_string()
    });

    Config {
        server: server_config,
        db: db_config,
        jwt_secret: jwt_secret,
    }
}

pub async fn config() -> &'static Config {
    CONFIG.get_or_init(init_config).await
}
