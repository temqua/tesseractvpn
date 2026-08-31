FROM golang:1.25-alpine AS builder
WORKDIR /src
COPY go.mod ./
COPY base/ ./base/
COPY openvpn/api.go openvpn/
COPY openvpn/scripts/ openvpn/scripts/

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o api ./openvpn


FROM debian:latest

WORKDIR /server

RUN apt-get update && apt-get install -yqq openvpn

COPY --from=builder /src/api /server/api
COPY --from=builder /src/openvpn/scripts /server/scripts

EXPOSE 8092

CMD ["/server/api"]