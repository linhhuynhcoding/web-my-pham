-- name: GetOrderHistoryByUserEmail :many
-- - group by user_id
-- - user_id = $1
-- - limit, offset
-- - order by 
select
    o.*,
    count (*) over () as total
from orders o
where o.user_email = $1
order by o.order_date desc
limit $2 offset $3;

-- name: GetOrderDetailByID :many
select 
    o.*,
    p.id as product_id,
    p.name as product_name,
    p.description as product_description,
    p.price as product_price,
    p.image_url as product_image_url,
    b.id as brand_id,
    b.name as brand_name,
    b.image_url as brand_image_url,
    c.name as category_name,
    c.id as category_id,
    c.image_url as category_image_url
from order_items o
left join products p on p.id = oi.product_id
left join brands b on b.id = p.brand_id
left join categories c on c.id = p.category_id
where o.order_id = any(sqlc.arg('order_id')::int[]);
