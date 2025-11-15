-- name: CreateOrder :one
insert into
    orders(
        user_email,
        total_price,
        status,
        shipping_address,
        shipping_fee,
        phone,
        payment_method,
        order_date,
        notes
    )
values (
        @user_email,
        @total_price,
        'pending',
        @shipping_address,
        @shipping_fee,
        @phone,
        @payment_method,
        @order_date,
        @notes
    )
returning
    *;

-- name: CreateOrderItem :one
insert into
    order_items (
        order_id,
        product_id,
        quantity,
        price
    )
values (
        @order_id::int,
        @product_id::int,
        @quantity::int,
        @price
    )
returning
    *;

-- name: GetOrderDetail :one
select o.*, u.name as user_name
from orders o
left join users u on u.email = o.user_email
where
    o.id = @order_id;

-- name: GetOrderItems :many
select
    oi.*,
    p.id as product_id,
    p.name as product_name,
    p.description as product_description,
    p.price as product_price,
    p.image_url as product_image_url
from order_items oi
    left join products p on p.id = oi.product_id
where
    oi.order_id = @order_id;

-- name: ListOrders :many
SELECT
    o.*,
    count(*) OVER() AS total
FROM orders o
WHERE
    (sqlc.narg('user_email')::text IS NULL OR o.user_email = sqlc.narg('user_email')::text)
    AND (sqlc.narg('order_id')::int IS NULL OR o.id = sqlc.narg('order_id')::int)
    AND (@start_date::timestamp IS NULL OR o.order_date >= @start_date)
    AND (@end_date::timestamp IS NULL OR o.order_date <= @end_date)
    AND (sqlc.narg('min_total_amount')::numeric IS NULL OR o.total_price >= sqlc.narg('min_total_amount')::numeric)
    AND (sqlc.narg('max_total_amount')::numeric IS NULL OR o.total_price <= sqlc.narg('max_total_amount')::numeric)
    AND (sqlc.narg('status')::text IS NULL OR lower(o.status) = lower(sqlc.narg('status'))::text)
ORDER BY
    CASE WHEN sqlc.arg('order_by')::text = 'order_date_asc' THEN o.order_date END ASC,
    CASE WHEN sqlc.arg('order_by')::text = 'order_date_desc' THEN o.order_date END DESC,
    CASE WHEN sqlc.arg('order_by')::text = 'total_amount_asc' THEN o.total_price END ASC,
    CASE WHEN sqlc.arg('order_by')::text = 'total_amount_desc' THEN o.total_price END DESC,
    o.id ASC
LIMIT $1 OFFSET $2;
-- name: CountOrders :one
SELECT count(DISTINCT o.id)
FROM
    orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
WHERE (
        @user_email::text IS NULL
        OR o.user_email = @user_email
    )
    AND (
        @product_id::int IS NULL
        OR oi.product_id = @product_id
    )
    AND (
        sqlc.narg ('brand_ids')::int[] IS NULL
        OR p.brand_id = ANY (
            sqlc.narg ('brand_ids')::int[]
        )
    )
    AND (
        @start_date::timestamp IS NULL
        OR o.order_date >= @start_date
    )
    AND (
        @end_date::timestamp IS NULL
        OR o.order_date <= @end_date
    )
    AND (
        sqlc.narg ('min_total_amount')::numeric IS NULL
        OR o.total_price >= sqlc.narg ('min_total_amount')::numeric
    )
    AND (
        sqlc.narg ('max_total_amount')::numeric IS NULL
        OR o.total_price <= sqlc.narg ('max_total_amount')::numeric
    );

-- name: UpdateOrderStatus :one
UPDATE orders SET status = @status WHERE id = @id RETURNING *;