use actix_web::{web, HttpResponse, Responder};
use lettre::message::Mailbox;
use lettre::{Address, AsyncTransport, Message};
use crate::models::{FormData, ResponseData};
use crate::AppState;

pub async fn handle_orcamento(
    form: web::Json<FormData>,
    state: web::Data<AppState>,
) -> impl Responder {
    let insert_result = sqlx::query(
        "INSERT INTO orcamentos (nome, sobrenome, email, cep, cidade, bairro, rua, numero) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
    )
    .bind(&form.nome)
    .bind(&form.sobrenome)
    .bind(&form.email)
    .bind(&form.cep)
    .bind(&form.cidade)
    .bind(&form.bairro)
    .bind(&form.rua)
    .bind(&form.numero)
    .execute(&state.db_pool)
    .await;

    if let Err(e) = insert_result {
        eprintln!("Database Error: {:?}", e);
        return HttpResponse::InternalServerError().json(ResponseData {
            mensagem: "Erro ao processar sua solicitação no banco de dados.".to_string(),
        });
    }

    let email_body = format!(
        "Nova Solicitação de Orçamento:\n\nNome: {} {}\nE-mail: {}\nCEP: {}\nCidade: {}\nBairro: {}\nRua: {}\nNúmero: {}",
        form.nome, form.sobrenome, form.email, form.cep, form.cidade, form.bairro, form.rua, form.numero
    );

    let client_address: Address = match form.email.parse() {
        Ok(addr) => addr,
        Err(_) => {
            return HttpResponse::BadRequest().json(ResponseData {
                mensagem: "E-mail inválido fornecido.".to_string(),
            })
        }
    };
    
    let client_mailbox = Mailbox::new(
        Some(format!("{} {}", form.nome, form.sobrenome)),
        client_address,
    );

    let admin_address: Address = match state.remetente.parse() {
        Ok(addr) => addr,
        Err(e) => {
            eprintln!("Falha ao ler EMAIL_USER. Valor recebido: '{}'. Erro: {:?}", state.remetente, e);
            return HttpResponse::InternalServerError().json(ResponseData {
                mensagem: "Erro interno na configuração de e-mail do servidor.".to_string(),
            })
        }
    };

    let from_mailbox = Mailbox::new(
        Some(format!("{} {} (via Formulário)", form.nome, form.sobrenome)),
        admin_address.clone(),
    );

    let to_mailbox = Mailbox::new(
        Some("Sneaker Laundry".to_string()),
        admin_address,
    );
    
    let email = match Message::builder()
        .from(from_mailbox)
        .reply_to(client_mailbox)
        .to(to_mailbox)
        .subject(format!("Nova Solicitação de Orçamento - {} {}", form.nome, form.sobrenome))
        .body(email_body)
    {
        Ok(msg) => msg,
        Err(e) => {
            eprintln!("Erro ao construir a mensagem de email: {:?}", e);
            return HttpResponse::InternalServerError().json(ResponseData {
                mensagem: "Erro ao montar o e-mail.".to_string(),
            })
        }
    };

    match state.mailer.send(email).await {
        Ok(_) => HttpResponse::Ok().json(ResponseData {
            mensagem: "Solicitação enviada e registrada com sucesso!".to_string(),
        }),
        Err(e) => {
            eprintln!("SMTP Error: {e:?}");
            HttpResponse::InternalServerError().json(ResponseData {
                mensagem: "Erro ao enviar o e-mail, mas sua solicitação foi registrada.".to_string(),
            })
        }
    }
}