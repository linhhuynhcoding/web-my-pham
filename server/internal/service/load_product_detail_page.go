package service

import (
	"context"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/utils/format"
	"go.uber.org/zap"
)

// LoadProductDetailPage handles the request to retrieve details for a specific product.
// It also fetches other products from the same category and the same brand.
//
// Request:
//   - product_id: The ID of the product to retrieve.
//
// Response:
//   - product: The detailed information of the requested product.
//   - other_same_category_products: A list of products from the same category as the requested product.
//   - other_same_brand_products: A list of products from the same brand as the requested product.

// query
// name: GetProductByID: one

// name: GetProductByCategoryIDBasic: many
// limit, order by buyturn (desc)

// name: GetProductByBrandID: many
// limit, order by buyturn (desc)

func (s *Service) LoadProductDetailPage(ctx context.Context, req *api.LoadProductDetailPageRequest) (*api.LoadProductDetailPageResponse, error) {
	logger := s.logger.With(zap.String("func", "LoadProductDetailPage"))
	logger.Info("LoadProductDetailPage", zap.Any("req", req))

	product, err := s.store.GetProductByID(ctx, req.ProductId)
	if err != nil {
		logger.Error("failed to get product", zap.Error(err))
		return nil, err
	}
	productPrice, err := product.Price.Float64Value()
	if err != nil {
		logger.Error("failed to get product price", zap.Error(err))
	}

	productBrands, err := s.store.GetProductByBrandID(ctx, repository.GetProductByBrandIDParams{
		BrandID: product.BrandID,
		Limit:   5,
		Offset:  0,
	})
	if err != nil {
		logger.Error("failed to get product brands", zap.Error(err))
	}

	productCategories, err := s.store.GetProductByCateID(ctx, repository.GetProductByCateIDParams{
		CategoryID: product.CategoryID,
		Limit:      5,
		Offset:     0,
	})
	if err != nil {
		logger.Error("failed to get product categories", zap.Error(err))
	}

	ortherProductBrands := make([]*api.Product, 0, len(productBrands))
	for _, productBrand := range productBrands {
		ortherProductBrands = append(ortherProductBrands, s.products2ProductsApi(productBrand))
	}
	ortherProductCategories := make([]*api.Product, 0, len(productCategories))
	for _, productCategory := range productCategories {
		ortherProductCategories = append(ortherProductCategories, &api.Product{
			Id:       productCategory.ID,
			Name:     productCategory.Name,
			ImageUrl: productCategory.ImageUrl,
			Price:    productPrice.Float64,
		})
	}

	return &api.LoadProductDetailPageResponse{
		Product: &api.Product{
			Id:          product.ID,
			Name:        product.Name,
			Description: product.Description.String,
			Price:       productPrice.Float64,
			Category: &api.Category{
				Id:       product.CategoryID,
				Name:     product.CategoryName.String,
				ImageUrl: product.CategoryImageUrl.String,
			},
			Brand: &api.Brand{
				Id:       product.BrandID,
				Name:     product.BrandName.String,
				ImageUrl: product.ImageUrl,
			},
			Stock:     product.Stock,
			BuyTurn:   product.Buyturn,
			ImageUrl:  product.ImageUrl,
			CreatedAt: format.PgToPbTimestamp(product.CreatedAt),
			UpdatedAt: format.PgToPbTimestamp(product.UpdatedAt),
		},
		OtherSameCategoryProducts: nil,
		OtherSameBrandProducts:    nil,
	}, nil
}
