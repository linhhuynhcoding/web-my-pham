-- name: CreateUserCart :exec
insert into carts (user_id) values ($1);
