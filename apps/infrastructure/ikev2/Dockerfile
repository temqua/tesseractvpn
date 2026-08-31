FROM golang:1.25-alpine AS builder
WORKDIR /src
COPY go.mod ./
COPY base/ ./base/
COPY ikev2/api.go ikev2/
COPY ikev2/scripts/ ikev2/scripts/

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o api ./ikev2


# --- Stage 2: Final image with IPsec server ---
FROM debian:latest
WORKDIR /server

RUN apt-get update && apt-get -yqq install libnss3-tools libnss3-dev ppp zip unzip jq coreutils uuid-runtime

COPY --from=builder /src/api /server/api
COPY --from=builder /src/ikev2/scripts /server/scripts

EXPOSE 8090

CMD ["/server/api"]