-- name: GetAllUsers :many
select 
    id,
    name,
    email,
    created_at,
    updated_at,
    count(*) over () as total
from users where lower(role) = 'user'
limit $1 offset $2;

-- name: GetUserByName :one
select * from users where name = @name;

-- name: GetUserByEmail :one
select * from users where email = @email;

-- name: UpsertUSer :one
insert into users (name, email, password, role)
values ($1, $2, $3, $4)
on conflict (email) do update
set name = $1, email = $2, password = $3, role = $4
returning *;

-- name: IsUserExist :exec
select exists(select 1 from users where email = $1);
