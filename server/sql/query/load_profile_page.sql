-- name: GetOrderHistoryByUserID :many
-- - group by user_id
-- - user_id = $1
-- - limit, offset
-- - order by 
select * from orders o
left join order_items oi on oi.order_id = o.id
left join products p on p.id = oi.product_id
left join brands b on b.id = p.brand_id
left join categories c on c.id = p.category_id
where o.user_id = $1
order by o.order_date desc
limit $2 offset $3;
