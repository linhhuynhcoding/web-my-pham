-- name: GetProductByCategoryID :many
with res as ( select 
    p.*, 
    brands.id as brand_id,
    brands.name as brand_name, 
    brands.image_url as brand_image_url,
    categories.name as category_name, 
    categories.id as category_id,
    categories.image_url as category_image_url
from products p
left join brands on brands.id = p.brand_id
left join categories on categories.id = p.category_id       
-- - categoryID = $1
-- - price = [$2, $3]
-- - limit, offset
-- - order by 
		-- 1. price (desc, asc)
		-- 2. buyturn (desc)
where (
    (
        sqlc.narg('price_min') is null
        or sqlc.narg('price_max') is null
        or (p.price between sqlc.arg('price_min') and sqlc.arg('price_max'))
    )
    and p.category_id = sqlc.arg('category_id')
    and p.stock > 0
    and (
        array_length(sqlc.arg('brand_id'), 1) = 0
        or p.brand_id = any(sqlc.arg('brand_id'))
    )
)
order by 
    case when sqlc.arg('sort_by') = 'price_asc' then p.price end asc,
    case when sqlc.arg('sort_by') = 'price_desc' then p.price end desc,
    case when sqlc.arg('sort_by') = 'buyturn' then p.buyturn end desc )
select *, count(*) over() as total from res
limit $1 offset $2;
