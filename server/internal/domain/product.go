package domain

import "github.com/jackc/pgx/v5/pgtype"

type IProduct interface {
	GetID() int32
	GetName() string
	GetDescription() pgtype.Text
	GetPrice() pgtype.Numeric
	GetCategoryID() int32
	GetCategoryName() pgtype.Text 
	GetCategoryImageUrl() pgtype.Text 
	GetBrandID() int32
	GetBrandName() pgtype.Text 
	GetBrandImageUrl() pgtype.Text 
	GetStock() int32
	GetBuyturn() int32
	GetImageUrl() string
	GetCreatedAt() pgtype.Timestamp
	GetUpdatedAt() pgtype.Timestamp
}
