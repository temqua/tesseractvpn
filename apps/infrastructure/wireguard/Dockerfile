FROM golang:1.25-alpine AS builder
WORKDIR /src
COPY go.mod ./
COPY base/ ./base/
COPY wireguard/api.go wireguard/
COPY wireguard/scripts/ wireguard/scripts/

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o api ./wireguard


FROM debian:latest

WORKDIR /server

RUN apt-get update && apt-get install -yqq qrencode

COPY --from=builder /src/api /server/api
COPY --from=builder /src/wireguard/scripts /server/scripts

EXPOSE 8091

CMD ["/server/api"]