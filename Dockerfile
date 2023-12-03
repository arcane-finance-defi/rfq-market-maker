# Node.js application build stage
FROM  --platform=linux/amd64 node:20 as nodebuilder
WORKDIR /app
COPY ws-client/ .
RUN npm i

# Rust application build stage
FROM --platform=linux/amd64 rust:latest as rustbuilder
WORKDIR /usr/src/signature
COPY signature/ .
RUN cargo build --release

# Final image build stage
FROM  --platform=linux/amd64 node:20 
RUN apt-get update && apt-get install -y supervisor

# Copy builds into the final image
COPY --from=nodebuilder /app /usr/src/ws-client
COPY --from=rustbuilder /usr/src/signature/target/release/aleo-sign /usr/src/signature/


COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# # Expose port and start supervisord
# EXPOSE 3000
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
