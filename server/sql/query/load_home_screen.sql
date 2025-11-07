-- name: GetBestSellerProducts :many
-- order by buyturn
-- stock > 0
-- limit $1
select 
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
where p.stock > 0
order by p.buyturn desc
limit $1;
