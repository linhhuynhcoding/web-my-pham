-- name: GetProductByCategoryID :many
WITH res AS (
  SELECT
    p.*,
    b.name AS brand_name,
    b.image_url AS brand_image_url,
    c.name AS category_name,
    c.image_url AS category_image_url
  FROM products p
  LEFT JOIN brands b ON b.id = p.brand_id
  LEFT JOIN categories c ON c.id = p.category_id
  WHERE
    (
      sqlc.narg('price_min')::decimal(10,2) IS NULL
      OR sqlc.narg('price_max')::decimal(10,2) IS NULL
      OR p.price BETWEEN sqlc.narg('price_min')::decimal(10,2)
                    AND sqlc.narg('price_max')::decimal(10,2)
    )
    AND p.category_id = sqlc.arg('category_id')
    AND p.stock > 0
    AND (
      sqlc.narg('brand_id')::int[] IS NULL
      OR array_length(sqlc.narg('brand_id')::int[], 1) = 0
      OR p.brand_id = ANY(sqlc.narg('brand_id')::int[])
    )
)
SELECT
  *,
  COUNT(*) OVER() AS total
FROM res
ORDER BY
  CASE sqlc.arg('sort_by')
    WHEN 'price_asc'  THEN res.price
  END ASC,
  CASE sqlc.arg('sort_by')
    WHEN 'price_desc' THEN res.price
  END DESC,
  CASE sqlc.arg('sort_by')
    WHEN 'buyturn'    THEN res.buyturn
  END DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');
