package service

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/utils/format"
	"go.uber.org/zap"
)

func (s *Service) ListProduct(ctx context.Context, req *api.ListProductRequest) (*api.ListProductResponse, error) {
	logger := s.logger.With(zap.String("func", "ListProduct"))
	logger.Info("ListProduct", zap.Any("req", req))

	limit, offset := s.buildLimitOffset(req.GetPagination())

	arg := repository.ListProductsParams{
		Limit:  limit,
		Offset: offset,
	}

	if req.Filter != nil {
		if req.Filter.Keyword != "" {
			arg.Keyword = format.StringToPgText(req.Filter.Keyword)
		}
		if len(req.Filter.BrandIds) > 0 {
			arg.BrandIds = req.Filter.BrandIds
		}
		if len(req.Filter.CategoryIds) > 0 {
			arg.CategoryIds = req.Filter.CategoryIds
		}
		if req.Filter.PriceRange != nil && req.Filter.PriceRange.Min > 0 && req.Filter.PriceRange.Max > 0 {
			arg.MinPrice = pgtype.Float8{Float64: req.Filter.PriceRange.Min, Valid: true}
			arg.MaxPrice = pgtype.Float8{Float64: req.Filter.PriceRange.Max, Valid: true}
		}
	}

	switch req.OrderBy {
	case api.ProductOrderBy_PRICE_ASC:
		arg.OrderBy = "price_asc"
	case api.ProductOrderBy_PRICE_DESC:
		arg.OrderBy = "price_desc"
	case api.ProductOrderBy_BEST_SELLER:
		arg.OrderBy = "best_seller"
	}

	dbProducts, err := s.store.ListProducts(ctx, arg)
	if err != nil {
		logger.Error("s.store.ListProducts failed", zap.Error(err))
		return nil, err
	}
	logger.Info("ListProduct", zap.Any("arg", arg), zap.Any("dbProducts", dbProducts))

	var products []*api.Product
	for _, p := range dbProducts {
		products = append(products, &api.Product{
			Id:          p.ID,
			Name:        p.Name,
			Description: p.Description.String,
			Price:       format.NumericToFloat64(p.Price),
			Category: &api.Category{
				Id:       p.CategoryID,
				Name:     p.CategoryName,
				ImageUrl: p.CategoryImageUrl.String,
			},
			Brand: &api.Brand{
				Id:       p.BrandID,
				Name:     p.BrandName.String,
				ImageUrl: p.BrandImageUrl.String,
			},
			Stock:     p.Stock,
			BuyTurn:   p.Buyturn,
			ImageUrl:  p.ImageUrl,
			CreatedAt: format.PgToPbTimestamp(p.CreatedAt),
			UpdatedAt: format.PgToPbTimestamp(p.UpdatedAt),
		})
	}
	total := 0
	if len(dbProducts) > 0 && dbProducts[0].TotalRecords != nil {
		total = int(*dbProducts[0].TotalRecords)
	}
	logger.Info("ListProduct", zap.Any("products", products), zap.Any("total", total))

	return &api.ListProductResponse{
		Products:   products,
		Pagination: s.buildPagination(req.GetPagination(), int32(total)),
	}, nil
}
