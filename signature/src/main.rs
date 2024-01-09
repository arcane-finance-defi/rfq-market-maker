#[macro_use]
extern crate rocket;

use aleo_rust::{Identifier, Literal, Plaintext, PrivateKey, Signature, Testnet3};
use once_cell::sync::OnceCell;
use rand::prelude::*;
use rand_chacha::ChaCha20Rng;
use rand_core::CryptoRngCore;
use rocket::http::{ContentType, Status};
use rocket::serde::{json::Json, Deserialize, Serialize};
use snarkvm_circuit::IndexMap;
use snarkvm_console_types::address::{TestRng, ToFields};
use snarkvm_console_types::{Address, Field, U128, U32, U64};
use std::env;
use std::str::FromStr;

fn sign(quote: &Json<Quote<'_>>) -> Signature<Testnet3> {
    let mut rng = ChaCha20Rng::from_entropy();
    let maker_private_key = env::var("MAKER_PK").unwrap();
    let private_key = PrivateKey::<Testnet3>::from_str(maker_private_key.as_str()).unwrap();
    // Create a value to be signed.
    let value = Plaintext::<Testnet3>::Struct(
        IndexMap::from_iter(
            vec![
                (
                    Identifier::from_str("amount_in").unwrap(),
                    Plaintext::<Testnet3>::Literal(
                        Literal::U128(U128::new(quote.amount_in)),
                        OnceCell::new(),
                    ),
                ),
                (
                    Identifier::from_str("amount_out").unwrap(),
                    Plaintext::<Testnet3>::Literal(
                        Literal::U128(U128::new(quote.amount_out)),
                        OnceCell::new(),
                    ),
                ),
                (
                    Identifier::from_str("token_in").unwrap(),
                    Plaintext::<Testnet3>::Literal(
                        Literal::U64(U64::new(quote.token_in)),
                        OnceCell::new(),
                    ),
                ),
                (
                    Identifier::from_str("token_out").unwrap(),
                    Plaintext::<Testnet3>::Literal(
                        Literal::U64(U64::new(quote.token_out)),
                        OnceCell::new(),
                    ),
                ),
                (
                    Identifier::from_str("maker_address").unwrap(),
                    Plaintext::<Testnet3>::Literal(
                        Literal::Address(
                            Address::<Testnet3>::from_str(quote.maker_address).unwrap(),
                        ),
                        OnceCell::new(),
                    ),
                ),
                (
                    Identifier::from_str("nonce").unwrap(),
                    Plaintext::<Testnet3>::Literal(
                        Literal::Field(Field::<Testnet3>::from_str(quote.nonce).unwrap()),
                        OnceCell::new(),
                    ),
                ),
                (
                    Identifier::from_str("valid_until").unwrap(),
                    Plaintext::<Testnet3>::Literal(
                        Literal::U32(U32::new(quote.valid_until)),
                        OnceCell::new(),
                    ),
                ),
            ]
            .into_iter(),
        ),
        OnceCell::new(),
    );

    // Transform the value into a message (a sequence of fields).
    let message = value.to_fields().unwrap();

    // Produce a signature.
    let signature = Signature::<Testnet3>::sign(&private_key, &message, &mut rng).unwrap();
    println!("signature {:}", signature);

    // Verify the signature.
    let address = Address::try_from(&private_key).unwrap();
    println!("address {:}", address);
    assert!(signature.verify(&address, &message));

    return signature;
}

#[derive(Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
struct Quote<'r> {
    amount_in: u128,
    amount_out: u128,
    token_in: u64,
    token_out: u64,
    maker_address: &'r str,
    nonce: &'r str,
    valid_until: u32,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct QuoteSignature {
    quote_signature: String,
}

//   curl 127.0.0.1:8000/sign -d '{
//     "amount_in": 123,
//     "amount_out": 456,
//     "token_in": 789,
//     "token_out": 1,
//     "maker_address": "aleo10eq9ur0r30884paxqmm85gy0e97ay264skpaqsnm0ye2glp5yvgswmrlqv",
//     "nonce": "123field",
//     "valid_until": 888
// }'

#[post("/sign", data = "<quote>")]
fn sign_handler(quote: Json<Quote<'_>>) -> Json<QuoteSignature> {
    println!("quote {:?}", quote);
    let quote_signature = sign(&quote);
    Json(QuoteSignature {
        quote_signature: format!("{}", quote_signature),
    })
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![sign_handler])
}
