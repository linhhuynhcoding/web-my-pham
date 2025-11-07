-- name: GetProductByID :one
select 
    p.*, 
    b.id as brand_id,
    b.name as brand_name, 
    b.image_url as brand_image_url,
    c.name as category_name, 
    c.id as category_id,
    c.image_url as category_image_url
from products p
left join brands b on b.id = p.brand_id
left join categories c on c.id = p.category_id
where p.id = $1;

-- name: GetProductByCategoryIDBasic :many
select 
    p.*, 
    b.id as brand_id,
    b.name as brand_name, 
    b.image_url as brand_image_url,
    c.name as category_name, 
    c.id as category_id,
    c.image_url as category_image_url
from products p
left join brands b on brands.id = p.brand_id
left join categories c on categories.id = p.category_id
where p.category_id = $1
order by buyturn desc
limit $1 offset $2;

-- name: GetProductByBrandID :many
select 
    p.*, 
    b.id as brand_id,
    b.name as brand_name, 
    b.image_url as brand_image_url,
    c.name as category_name, 
    c.id as category_id,
    c.image_url as category_image_url
from products p
left join brands b on p.brand_id = b.id
left join categories c on c.id = p.category_id
where p.brand_id = $1 
order by p.buyturn desc
limit $2 offset $3;
