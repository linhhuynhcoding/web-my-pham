-- ALTER TABLE "user_addresses" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("brand_id") REFERENCES "brands" ("id");

INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES
('Admin User', 'admin@example.com', 'hashed_password_admin', 'admin', NOW(), NOW()),
('Regular User', 'user@example.com', 'hashed_password_user', 'user', NOW(), NOW());

-- INSERT INTO user_addresses (user_id, address_line1, address_line2, city, state, postal_code, country, is_default, created_at, updated_at) VALUES
-- (1, '123 Admin St', NULL, 'Admin City', 'AS', '12345', 'USA', TRUE, NOW(), NOW()),
-- (2, '456 User Ave', 'Apt 101', 'User Town', 'UT', '67890', 'USA', TRUE, NOW(), NOW());

INSERT INTO categories (name, image_url, created_at) VALUES
('Skincare', 'http://example.com/skincare.jpg', NOW()),
('Makeup', 'http://example.com/makeup.jpg', NOW()),
('Haircare', 'http://example.com/haircare.jpg', NOW());

INSERT INTO brands (name, image_url) VALUES
('Brand A', 'http://example.com/brand_a.jpg'),
('Brand B', 'http://example.com/brand_b.jpg'),
('Brand C', 'http://example.com/brand_c.jpg');

INSERT INTO products (name, description, price, category_id, stock, buyturn, image_url, brand_id, created_at, updated_at) VALUES
('Product 1', 'Description for Product 1', 25.00, 1, 100, 10, 'http://example.com/product1.jpg', 1, NOW(), NOW()),
('Product 2', 'Description for Product 2', 50.50, 2, 50, 5, 'http://example.com/product2.jpg', 2, NOW(), NOW());
