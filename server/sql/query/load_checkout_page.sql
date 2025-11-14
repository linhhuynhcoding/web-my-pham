-- name: FetchProductToCheckout :many
SELECT
    ci.id,
    ci.quantity,
    p.id as product_id,
    p.name as product_name,
    p.image_url as product_image_url,
    p.price as product_price
FROM
    cart_items ci
    JOIN products p ON ci.product_id = p.id
WHERE
    ci.id = ANY(@_items::int[]);
