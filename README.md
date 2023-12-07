# Market Maker Service for Arcane Finance on Aleo

The Market Maker Service is a specialized solution designed to integrate with the Arcane Finance router on the Aleo network. It is engineered to respond to exchange rate queries for token swaps, providing both quotes and signatures to validate transactions. This Dockerized service operates with only outbound WebSocket connections, ensuring a streamlined and secure operation.

## Features

- Node.js Application: Manages request handling, price retrieval, and response generation.
- Rust Application: Solely responsible for the secure signing of transaction data.

## Prerequisites

To run this service, ensure you have the following installed on your machine:

- Docker: For building and running the containerized applications.
- Git (optional): For cloning the repository if you choose to do so.

## Installation

### Clone the Repository (Optional):

```bash
git clone https://github.com/arcane-finance-defi/rfq-market-maker.git
cd rfq-market-maker
```

### Set Up Environment Variables:

Copy the provided `.env.example` file to `.env`.

Fill in the required environment variables:

- `ROUTER_WS_HOST`: The WebSocket host for Arcane Finance router.
- `AUTH_TOKEN`: Authentication token for the WebSocket connection to Arcane Finance router.
- `MAKER_ADDRESS`: The address of the maker.
- `MAKER_PK`: The private key of the maker.
- `SIGN_HOST` (optional): Host for the Rust signature service (defaults to `http://localhost:8000`).
- `EXPIRE_BLOCK_NUMBER` (optional): Block number at which the order expires (default 100).

### Build and Run the Docker Container:

Execute the `run.sh` script:

```bash
./run.sh
```

### Docker Configuration:

The provided Dockerfile facilitates the setup of both Node.js and Rust environments in a multi-stage build process, ensuring an optimized and clean Docker image.

## Supervisord

The service uses supervisord for process management within the Docker container, ensuring both applications remain active and functional. The configuration is defined in `supervisord.conf`, directing logs to the container's standard output and error streams for easy monitoring.

### Usage

Once the Docker container is running, the service will automatically connect to the specified WebSocket host and listen for incoming requests. It will process these requests using the Node.js application and use the Rust application for signing the data.
