package service

import (
	"context"
	"database/sql"
	"errors"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"go.uber.org/zap"
)

// load product by categories page
// request:
// 1. category_id
// 2. filter
//	- price range
//	- brand
// 3. order by
// 	- price (desc, asc)
// 	- best seller
// 4. pagination
// resposne:
// 1. Product products
// 2. Pagination

// name: GetProductByCategoryID :mamy
// - categoryID = $1
// - price = [$2, $3]
// - limit, offset
// - order by
// 		1. price (desc, asc)
// 		2. buyturn (desc)

func (s *Service) LoadProductsByCategory(ctx context.Context, req *api.LoadProductsByCategoryRequest) (*api.LoadProductsByCategoryResponse, error) {
	logger := s.logger.With(zap.String("func", "LoadProductsByCategory"))
	logger.Info("LoadProductsByCategory", zap.Any("req", req))

	limit, offset := s.buildLimitOffset(req.Pagination)
	getProductParams := repository.GetProductByCategoryIDParams{
		CategoryID: req.CategoryId,
		Limit:      limit,
		Offset:     offset,
		SortBy:     string(req.OrderBy),
	}
	if req.Filter.PriceRange != nil {
		getProductParams.PriceMax = req.Filter.PriceRange.Max
		getProductParams.PriceMin = req.Filter.PriceRange.Min
	}
	if len(req.Filter.BrandIds) > 0 {
		getProductParams.BrandID = req.Filter.BrandIds
	}

	products, err := s.store.GetProductByCategoryID(ctx, getProductParams)
	if err != nil {
		logger.Error("failed to get products", zap.Error(err))
		return nil, err
	}

	brands, err := s.store.GetBrands(ctx)
	if err != nil && errors.Is(err, sql.ErrNoRows) {
		logger.Error("failed to get brands", zap.Error(err))
	}

	return &api.LoadProductsByCategoryResponse{
		Products:   s.mapProductDb2Api(products),
		Pagination: s.buildPagination(req.Pagination, int32(len(products))),
		Brands:     s.brands2BrandsApi(brands),
	}, nil
}

func (s *Service) mapProductDb2Api(products []repository.GetProductByCategoryIDRow) []*api.Product {
	productResp := []*api.Product{}
	for _, product := range products {
		productResp = append(productResp, s.products2ProductsApi(product))
	}
	return productResp
}
