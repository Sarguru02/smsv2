use deadpool_diesel::InteractError;
use std::fmt;

#[derive(Debug)]
pub enum InfraError {
    InternalServerError(Option<String>),
    NotFound,
}

pub fn adapt_infra_error<T: Error>(error: T) -> InfraError {
    error.as_infra_error()
}

impl fmt::Display for InfraError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            InfraError::NotFound => write!(f, "Not found"),
            InfraError::InternalServerError(err) => {
                let message = match err {
                    Some(err_msg) => format!("Internal server error occurred: {}", err_msg),
                    None => format!("Internal Server Error!"),
                };
                write!(f, "{message}")
            }
        }
    }
}

pub trait Error {
    fn as_infra_error(&self) -> InfraError;
}

impl Error for diesel::result::Error {
    fn as_infra_error(&self) -> InfraError {
        match self {
            diesel::result::Error::NotFound => InfraError::NotFound,
            _ => InfraError::InternalServerError(None),
        }
    }
}

impl Error for deadpool_diesel::PoolError {
    fn as_infra_error(&self) -> InfraError {
        InfraError::InternalServerError(None)
    }
}

impl Error for InteractError {
    fn as_infra_error(&self) -> InfraError {
        InfraError::InternalServerError(None)
    }
}
