mod models;
mod handlers;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{AsyncSmtpTransport, Tokio1Executor};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;
use std::time::Duration;

pub struct AppState {
    pub mailer: AsyncSmtpTransport<Tokio1Executor>,
    pub remetente: String,
    pub db_pool: PgPool,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let email_user = env::var("EMAIL_USER").expect("EMAIL_USER não definido");
    let email_pass = env::var("EMAIL_PASS").expect("EMAIL_PASS não definido");
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL não definido");

    let mut db_pool = None;
    for i in 1..=5 {
        match PgPoolOptions::new()
            .max_connections(5)
            .connect(&database_url)
            .await
        {
            Ok(pool) => {
                db_pool = Some(pool);
                break;
            }
            Err(e) => {
                if i == 5 {
                    panic!("Falha definitiva ao conectar ao banco de dados: {:?}", e);
                }
                println!("Aguardando banco de dados iniciar... Tentativa {}/5", i);
                tokio::time::sleep(Duration::from_secs(2)).await;
            }
        }
    }
    let db_pool = db_pool.unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS orcamentos (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            sobrenome VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            cep VARCHAR(20) NOT NULL,
            cidade VARCHAR(100) NOT NULL,
            bairro VARCHAR(100) NOT NULL,
            rua VARCHAR(255) NOT NULL,
            numero VARCHAR(50) NOT NULL,
            quantidade_pares VARCHAR(50) NOT NULL,
            data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        "#,
    )
    .execute(&db_pool)
    .await
    .expect("Erro ao criar tabela orcamentos");

    let creds = Credentials::new(email_user.clone(), email_pass);
    let mailer: AsyncSmtpTransport<Tokio1Executor> =
        AsyncSmtpTransport::<Tokio1Executor>::relay("smtp.gmail.com")
            .expect("Não foi possível configurar o relay SMTP")
            .credentials(creds)
            .build();

    let app_state = web::Data::new(AppState {
        mailer,
        remetente: email_user,
        db_pool,
    });

    println!("Servidor rodando em http://0.0.0.0:8000");

    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .app_data(app_state.clone())
            .route("/api/orcamento", web::post().to(handlers::handle_orcamento))
    })
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}