FROM golang:1.23-alpine as builder

WORKDIR /app

RUN apk add --no-cache \
    git \
    postgresql-client

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest && \
    CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o payment-ms .

FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/payment-ms .
COPY --from=builder /go/bin/migrate /usr/local/bin/migrate
COPY --from=builder /app/migration ./migration

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

RUN apk add --no-cache \
    postgresql-client \
    tzdata

ENTRYPOINT ["./entrypoint.sh"]