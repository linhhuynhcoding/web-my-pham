-- name: GetBrands :many
select * from brands;

-- name: CreateBrand :one
INSERT INTO brands (
  name,
  image_url
) VALUES (
  $1, $2
) RETURNING *;

-- name: ListBrands :many
SELECT * FROM brands
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: CountBrands :one
SELECT count(*) FROM brands;

-- name: UpdateBrand :one
UPDATE brands SET name = $2, image_url = $3 WHERE id = $1 RETURNING *;

-- name: DeleteBrand :exec
DELETE FROM brands WHERE id = $1;
