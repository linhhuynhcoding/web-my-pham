package service

import (
	"context"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/utils/format"
	"go.uber.org/zap"
)

// load home screen
// resposne:
// 1. Bestseller products
// 2. Topsearch products
// 3. Categories
// 4. Brands

// name: GetBestSellerProducts: many
// - order by buyturn
// - stock > 0
// - limit $1

// name: GetCategories :many

// name: GetBrands :many

var (
	BestsellerProductSize = 20
)

func (s *Service) LoadHomeScreen(ctx context.Context, req *api.LoadHomeScreenRequest) (*api.LoadHomeScreenResponse, error) {
	logger := s.logger.With(zap.String("func", "LoadHomeScreen"))
	logger.Info("LoadHomeScreen", zap.Any("req", req))

	bestSellerProducts, err := s.store.GetBestSellerProducts(ctx, int32(BestsellerProductSize))
	if err != nil {
		logger.Error("failed to get bestseller products", zap.Error(err))
		return nil, err
	}
	logger.Info("bestSellerProducts", zap.Any("bestSellerProducts", bestSellerProducts))

	categories, err := s.store.GetCategories(ctx)
	if err != nil {
		logger.Error("failed to get categories", zap.Error(err))
		return nil, err
	}
	logger.Info("categories", zap.Any("categories", categories))

	brands, err := s.store.GetBrands(ctx)
	if err != nil {
		logger.Error("failed to get brands", zap.Error(err))
		return nil, err
	}
	logger.Info("brands", zap.Any("brands", brands))

	return s.map2LoadHomeScreenResp(bestSellerProducts, bestSellerProducts, categories, brands), nil
}

func (s *Service) map2LoadHomeScreenResp(
	bestSellerProducts []repository.GetBestSellerProductsRow,
	topSearchProducts []repository.GetBestSellerProductsRow,
	categories []repository.Category,
	brands []repository.Brand,
) *api.LoadHomeScreenResponse {
	logger := s.logger.With(zap.String("func", "map2LoadHomeScreenResp"))
	logger.Info("map2LoadHomeScreenResp")

	resp := &api.LoadHomeScreenResponse{
		BestsellerProducts: []*api.Product{},
		TopSearchProducts:  []*api.Product{},
		Categories:         []*api.Category{},
		Brands:             []*api.Brand{},
	}
	for _, product := range bestSellerProducts {
		price, err := product.Price.Float64Value()
		if err != nil {
			logger.Error("failed to get price", zap.Error(err))
		}
		resp.BestsellerProducts = append(resp.BestsellerProducts, &api.Product{
			Id:          product.ID,
			Name:        product.Name,
			Description: product.Description.String,
			Price:       price.Float64,
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
		})
	}
	resp.TopSearchProducts = resp.BestsellerProducts

	for _, category := range categories {
		resp.Categories = append(resp.Categories, &api.Category{
			Id:       category.ID,
			Name:     category.Name,
			ImageUrl: category.ImageUrl.String,
		})
	}

	for _, brand := range brands {
		resp.Brands = append(resp.Brands, &api.Brand{
			Id:       brand.ID,
			Name:     brand.Name.String,
			ImageUrl: brand.ImageUrl.String,
		})
	}
	return resp
}
