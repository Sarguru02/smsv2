use std::sync::atomic::Ordering;

use axum::{Router, body::Body, extract::MatchedPath};
use tower_http::trace::{DefaultOnResponse, TraceLayer};
use tracing::{Level, info_span};

use crate::LOG_COUNTER;

pub fn apply_middlewares(app: Router) -> Router {
    app.layer(
        TraceLayer::new_for_http()
            .make_span_with(|req: &axum::http::Request<Body>| {
                let m_no = LOG_COUNTER.fetch_add(1, Ordering::Relaxed);
                let matched_path = req
                    .extensions()
                    .get::<MatchedPath>()
                    .map(|p| p.as_str())
                    .unwrap_or("unknown");
                info_span!("http_request",
                        message_no = m_no,
                        method = %req.method(),
                        route = matched_path)
            })
            .on_response(DefaultOnResponse::new().level(Level::INFO)),
    )
    .layer(fastrace_axum::FastraceLayer::default())
}
