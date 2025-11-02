FROM golang:1.24-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main ./cmd

FROM alpine:3.18

WORKDIR /app
RUN apk add --no-cache bash curl busybox-suid

COPY --from=builder /app/main .
COPY config.yaml ./config.yaml
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 8080

# Nhận ARG từ docker-compose
ARG APP_ENV
RUN echo "Building in $APP_ENV mode"


# Lưu ý: không chạy server mặc định nữa
ENTRYPOINT ["/app/main"]
