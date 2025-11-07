package service

type ServiceRole string

var (
	UserRole  ServiceRole = "USER"
	AdminRole ServiceRole = "ADMIN"
)

type OrderBy string

var (
	OrderByPriceDesc OrderBy = "price_desc"
	OrderByPriceAsc  OrderBy = "price_asc"
	OrderByBuyTurn   OrderBy = "buyturn"
)
