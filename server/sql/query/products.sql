-- name: UpdateProductStock :exec
update products set stock = stock - @quantity::int, buyturn = buyturn + @quantity::int where id = $1;

-- name: CreateProduct :one
insert into products(
    name,
    description,
    price,
    image_url,
    stock,
    brand_id,
    category_id,
    buyturn
) values (
    @name,
    @description,
    @price,
    @image_url,
    @stock,
    @brand_id,
    @category_id,
    0
) returning *;

-- name: UpdateProduct :exec
update products 
set 
    name = case when sqlc.narg('name')::text is not null then sqlc.narg('name') else name end,  
    description = case when sqlc.narg('description')::text is not null then sqlc.narg('description') else description end,
    price = case when sqlc.narg('price')::numeric is not null then sqlc.narg('price') else price end,
    image_url = case when sqlc.narg('image_url')::text is not null then sqlc.narg('image_url') else image_url end,
    stock = case when sqlc.narg('stock')::int is not null then sqlc.narg('stock') else stock end,
    brand_id = case when sqlc.narg('brand_id')::int is not null then sqlc.narg('brand_id') else brand_id end,
    category_id = case when sqlc.narg('category_id')::int is not null then sqlc.narg('category_id') else category_id end,
    buyturn = case when sqlc.narg('buyturn')::int is not null then sqlc.narg('buyturn') else buyturn end
WHERE id = $1;

-- insert into products(
--     id,
--     name,
--     description,
--     price,
--     image_url,
--     stock,
--     brand_id,
--     category_id,
--     buyturn
-- ) values (
--     sqlc.arg('id'),
--     sqlc.narg('name'),
--     sqlc.narg('description'),
--     sqlc.narg('price'),
--     sqlc.narg('image_url'),
--     sqlc.narg('stock'),
--     sqlc.narg('brand_id'),
--     sqlc.narg('category_id'),
--     sqlc.narg('buyturn')
-- )
-- on conflict (id) do update
-- set
--     name = COALESCE(EXCLUDED.name, products.name),
--     description = COALESCE(EXCLUDED.description, products.description),
--     price = COALESCE(EXCLUDED.price, products.price),
--     image_url = COALESCE(EXCLUDED.image_url, products.image_url),
--     stock = COALESCE(EXCLUDED.stock, products.stock),
--     brand_id = COALESCE(EXCLUDED.brand_id, products.brand_id),
--     category_id = COALESCE(EXCLUDED.category_id, products.category_id),
--     buyturn = COALESCE(EXCLUDED.buyturn, products.buyturn);

-- name: DeleteProduct :exec
delete from products where id = $1;


-- name: ListProducts :many
SELECT
    p.*,
    b.name as brand_name,
    b.image_url as brand_image_url,
    c.name as category_name,
    c.image_url as category_image_url,
    count(*) OVER() AS total_records
FROM
    products p
JOIN
    brands b ON p.brand_id = b.id
JOIN
    categories c ON p.category_id = c.id
WHERE
    (sqlc.narg('keyword')::text IS NULL OR p.name ILIKE '%' || sqlc.narg('keyword')::text || '%')
    AND (sqlc.narg('min_price')::float IS NULL OR p.price >= sqlc.narg('min_price')::float)
    AND (sqlc.narg('max_price')::float IS NULL OR p.price <= sqlc.narg('max_price')::float)
    AND (
        sqlc.narg('brand_ids')::int[] IS NULL 
        OR cardinality(sqlc.narg('brand_ids')::int[]) = 0 
        OR p.brand_id = ANY(sqlc.narg('brand_ids')::int[])
    )
    AND (
        sqlc.narg('category_ids')::int[] IS NULL 
        OR cardinality(sqlc.narg('category_ids')::int[]) = 0 
        OR p.category_id = ANY(sqlc.narg('category_ids')::int[])
    )
ORDER BY
    CASE WHEN sqlc.arg('order_by')::text = 'price_asc' THEN p.price END ASC,
    CASE WHEN sqlc.arg('order_by')::text = 'price_desc' THEN p.price END DESC,
    CASE WHEN sqlc.arg('order_by')::text = 'best_seller' THEN p.buyturn END DESC,
    p.id ASC
LIMIT $1
OFFSET $2;

-- name: GetProductDetail :one
SELECT
    p.*,
    b.name as brand_name,
    b.image_url as brand_image_url,
    c.name as category_name,
    c.image_url as category_image_url
FROM
    products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE
    p.id = $1;


-- name: GetProductByCateID :many
SELECT p.*
FROM products p
WHERE p.category_id = $1 limit $2 offset $3;

