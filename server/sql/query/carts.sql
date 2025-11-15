-- name: CreateUserCart :exec
insert into carts (user_id) values ($1);

-- name: GetCartItem :one 
select * from cart_items where id = $1;
