DB_URL=postgresql://root:secret@localhost:9999/lifi?sslmode=disable
POSTGRES_CONTAINER=lifi-postgres
PROTOC       = protoc
PROTO_DIR    = api
OUT_DIR      = api

# Lấy danh sách proto, bỏ qua google/api
PROTO_FILES := $(shell find $(PROTO_DIR) -name "*.proto" ! -path "$(PROTO_DIR)/google/*" ! -path "$(PROTO_DIR)/protoc-gen-openapiv2/*")

proto:
	@mkdir -p $(OUT_DIR)
	$(PROTOC) \
		--proto_path=$(PROTO_DIR) \
		--go_out=$(OUT_DIR) --go_opt=paths=source_relative \
		--go-grpc_out=$(OUT_DIR) --go-grpc_opt=paths=source_relative \
		--grpc-gateway_out=$(OUT_DIR) --grpc-gateway_opt=paths=source_relative \
		--validate_out="lang=go:$(OUT_DIR)" \
		$(PROTO_FILES)

doc:
	$(PROTOC) --doc_out=../docs \
  	--doc_opt=html,api.html \
  	-I=proto --proto_path=$(PROTO_DIR) $(PROTO_DIR)/*.proto

network:
	docker network create jss-network

postgres:
	docker run --name postgres --network jss-network -p 9999:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:14-alpine

createdb:
	docker exec -it $(POSTGRES_CONTAINER) createdb --username=root --owner=root lifi

dropdb:
	docker exec -it $(POSTGRES_CONTAINER) dropdb lifi

migrate-up:
	migrate -path sql/migration -database "$(DB_URL)" -verbose up

new_migration:
	migrate create -ext sql -dir sql/migration -seq $(name)

update:
	go mod tidy
	go mod vendor

# update-rpc:
# 	go get github.com/linhhuynhcoding/jss-microservices/rpc@main

run:
	go run ./cmd server

# update-pkg:
# 	go get github.com/linhhuynhcoding/jss-microservices/$(p)@$(v)
# 	make update
	
.PHOYE: network postgres createdb dropdb migrate-up new_migration update