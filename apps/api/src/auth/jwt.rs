use std::fmt::Display;

use axum::http::request::Parts;
use axum::{RequestPartsExt, extract::FromRequestParts};
use axum_extra::TypedHeader;
use axum_extra::headers::{Authorization, authorization::Bearer};
use jsonwebtoken::{DecodingKey, EncodingKey, Validation, decode};
use serde::{Deserialize, Serialize};
use tracing::info;

use crate::auth::errors::AuthError;
use crate::state::AppState;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JwtPayload {
    pub sub: String, // subject
    pub exp: usize,  // expiry in bytes
}

#[derive(Clone)]
pub struct Keys {
    pub encoding: EncodingKey,
    pub decoding: DecodingKey,
}

impl Keys {
    pub fn new(secret: &[u8]) -> Self {
        Self {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}

impl FromRequestParts<AppState> for JwtPayload {
    type Rejection = AuthError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|_| AuthError::InvalidToken)?;
        info!("decoding user data from the token {}", bearer.token());
        // Decode the user data
        let token_data =
            decode::<JwtPayload>(bearer.token(), &state.keys.decoding, &Validation::default())
                .map_err(|err| {
                    tracing::error!("Error occurred when decoding data: {err}");
                    AuthError::InvalidToken
                })?;

        Ok(token_data.claims)
    }
}

impl Display for JwtPayload {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Username: {}", self.sub)
    }
}
