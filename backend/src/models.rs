use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct FormData {
    pub nome: String,
    pub sobrenome: String,
    pub email: String,
    pub cep: String,
    pub cidade: String,
    pub bairro: String,
    pub rua: String,
    pub numero: String,
}

#[derive(Serialize)]
pub struct ResponseData {
    pub mensagem: String,
}