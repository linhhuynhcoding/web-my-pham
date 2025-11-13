-- name: GetCartByUserId :many
SELECT
    ci.id AS cart_item_id,
    ci.quantity,
    ci.subtotal,
    p.id AS product_id,
    p.name AS product_name,
    p.price AS product_price,
    p.image_url AS product_image_url,
    (SELECT SUM(subtotal)::int FROM cart_items WHERE cart_id = c.id) AS total_price
FROM
    carts c
JOIN
    cart_items ci ON c.id = ci.cart_id
JOIN
    products p ON ci.product_id = p.id
WHERE
    c.user_id = $1;

-- name: UpdateCartItem :one
UPDATE cart_items
SET
    quantity = @quantity::int,
    subtotal = (SELECT price FROM products WHERE products.id = cart_items.product_id) * @quantity::int
WHERE
    cart_items.id = @ID
RETURNING *;

-- name: DeleteCartItem :exec
DELETE FROM cart_items
WHERE id = $1;

-- name: IsCartItemOwner :one
SELECT EXISTS (
    SELECT 1
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    WHERE ci.id = @cart_item_id AND c.user_id = @user_id
);

-- name: AddCartItem :one
WITH user_cart AS (
    SELECT carts.id FROM carts WHERE user_id = @user_id
),
product_price AS (
    SELECT price FROM products WHERE id = @product_id
)
INSERT INTO cart_items (cart_id, product_id, quantity, subtotal)
SELECT 
    (SELECT user_cart.id FROM user_cart),
    @product_id,
    @quantity::int,
    (SELECT price FROM product_price) * @quantity::int
ON CONFLICT (cart_id, product_id) DO UPDATE
SET
    quantity = cart_items.quantity + EXCLUDED.quantity,
    subtotal = cart_items.subtotal + EXCLUDED.subtotal
RETURNING *;
