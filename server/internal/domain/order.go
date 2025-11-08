package domain

import "github.com/jackc/pgx/v5/pgtype"

type IOrder interface {
	GetID() int32
	GetUserEmail() string
	GetTotalPrice() pgtype.Numeric
	GetStatus() string
	GetShippingAddress() string
	GetPhone() string
	GetPaymentMethod() string
	GetOrderDate() pgtype.Date
	GetCreatedAt() pgtype.Timestamp
	GetUpdatedAt() pgtype.Timestamp
	GetOrderItemID() pgtype.Int4
	GetOrderItemQuantity() pgtype.Int4
	GetOrderItemPrice() pgtype.Numeric
	GetProductID() pgtype.Int4
	GetProductName() pgtype.Text
	GetProductDescription() pgtype.Text
	GetProductPrice() pgtype.Numeric
	GetProductStock() pgtype.Int4
	GetProductBuyturn() pgtype.Int4
	GetProductImageUrl() pgtype.Text
	GetBrandID() pgtype.Int4
	GetBrandName() pgtype.Text
	GetBrandImageUrl() pgtype.Text
	GetCategoryID() pgtype.Int4
	GetCategoryName() pgtype.Text
	GetCategoryImageUrl() pgtype.Text
}
