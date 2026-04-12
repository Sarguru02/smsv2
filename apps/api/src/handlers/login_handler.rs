use axum::{Json, extract::State};
use jsonwebtoken::{Header, encode};
use serde::{Deserialize, Serialize};

use crate::{
    auth::{AuthError, JwtPayload},
    state::AppState,
    utils::custom_extractors::json_extractor::JsonExtractor,
};

#[derive(Debug, Serialize)]
pub struct AuthBody {
    access_token: String,
    token_type: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    username: String,
    password: String,
}

impl AuthBody {
    pub fn new(access_token: String) -> Self {
        Self {
            access_token,
            token_type: "Bearer".to_string(),
        }
    }
}

pub async fn login(
    State(state): State<AppState>,
    JsonExtractor(login_request): JsonExtractor<LoginRequest>,
) -> Result<Json<AuthBody>, AuthError> {
    // validate request
    if login_request.username.is_empty() || login_request.password.is_empty() {
        return Err(AuthError::MissingCredentials);
    }

    // authorize user
    if login_request.username != "Sarguru" || login_request.password != "pass@123" {
        return Err(AuthError::WrongCredentials);
    }
    let jwt = JwtPayload {
        sub: login_request.username.to_owned(),
        exp: 2000000000,
    };
    let token = encode(&Header::default(), &jwt, &state.keys.encoding)
        .map_err(|_| AuthError::TokenCreation)?;

    Ok(Json(AuthBody::new(token)))
}
