-- name: GetCategories :many
select * from categories;

-- name: CreateCategory :one
INSERT INTO categories (
  name,
  image_url
) VALUES (
  $1, $2
) RETURNING *;

-- name: ListCategories :many
SELECT * FROM categories
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: CountCategories :one
SELECT count(*) FROM categories;

-- name: UpdateCategory :one
UPDATE categories SET name = $2, image_url = $3 WHERE id = $1 RETURNING *;

-- name: DeleteCategory :exec
DELETE FROM categories WHERE id = $1;
