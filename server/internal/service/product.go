package service

import (
	"context"
	"database/sql"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/utils/format"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Service) CreateProduct(ctx context.Context, req *api.CreateProductRequest) (*api.CreateProductResponse, error) {
	logger := s.logger.With(zap.String("func", "CreateProduct"))

	if req.Name == "" {
		return nil, status.Error(codes.InvalidArgument, "Product name is required")
	}
	product, err := s.store.CreateProduct(ctx, repository.CreateProductParams{
		Name:        req.Name,
		Description: format.StringToPgText(req.Description),
		Price:       format.ToNumeric(req.Price),
		Stock:       req.Stock,
		ImageUrl:    req.ImageUrl,
		CategoryID:  req.CategoryId,
		BrandID:     req.BrandId,
	})
	if err != nil {
		logger.Error("s.store.CreateProduct", zap.Error(err))
		return nil, status.Error(codes.Internal, "Failed to create product")
	}
	logger.Info("Product created successfully", zap.Any("product_id", product.ID))
	return &api.CreateProductResponse{Product: nil}, nil
}
func (s *Service) UpdateProduct(ctx context.Context, req *api.UpdateProductRequest) (*api.UpdateProductResponse, error) {
	logger := s.logger.With(zap.String("func", "UpdateProduct"))
	if req.ProductId == 0 {
		return nil, status.Error(codes.InvalidArgument, "Product is required")
	}
	upsertProductParams := repository.UpdateProductParams{
		ID: req.ProductId,
	}
	if req.Name != nil {
		upsertProductParams.Name = pgtype.Text{Valid: true, String: req.Name.Value}
	}
	if req.Description != nil {
		upsertProductParams.Description = pgtype.Text{Valid: true, String: req.Description.Value}
	}
	if req.Price != nil {
		upsertProductParams.Price = format.ToNumeric(req.Price.Value)
	}
	if req.Stock != nil {
		upsertProductParams.Stock = pgtype.Int4{
			Valid: true,
			Int32: req.Stock.Value,
		}
	}
	if req.ImageUrl != nil {
		upsertProductParams.ImageUrl = pgtype.Text{Valid: true, String: req.ImageUrl.Value}
	}
	if req.CategoryId != nil {
		upsertProductParams.CategoryID = pgtype.Int4{
			Valid: true,
			Int32: req.CategoryId.Value,
		}
	}
	if req.BrandId != nil {
		upsertProductParams.BrandID = pgtype.Int4{
			Valid: true,
			Int32: req.BrandId.Value,
		}
	}

	err := s.store.UpdateProduct(ctx, upsertProductParams)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, status.Error(codes.NotFound, "Product not found")
		}
		logger.Error("s.store.UpdateProduct", zap.Error(err))
		return nil, status.Error(codes.Internal, "Failed to update product")
	}
	logger.Info("Product updated successfully", zap.Any("product_id", req.ProductId))
	return &api.UpdateProductResponse{Product: nil}, nil
}

func (s *Service) DeleteProduct(ctx context.Context, req *api.DeleteProductRequest) (*api.DeleteProductResponse, error) {
	logger := s.logger.With(zap.String("func", "DeleteProduct"))
	if req.ProductId == 0 {
		return nil, status.Error(codes.InvalidArgument, "Product ID is required")
	}
	err := s.store.DeleteProduct(ctx, req.ProductId)
	if err != nil {
		logger.Error("s.store.DeleteProduct", zap.Error(err), zap.Any("product_id", req.ProductId))
		return nil, status.Error(codes.Internal, "Failed to delete product")
	}
	logger.Info("Product deleted successfully", zap.Any("product_id", req.ProductId))
	return &api.DeleteProductResponse{}, nil
}

func (s *Service) GetProductDetail(ctx context.Context, req *api.GetProductDetailRequest) (*api.GetProductDetailResponse, error) {
	logger := s.logger.With(zap.String("func", "GetProductDetail"))
	if req.ProductId == 0 {
		logger.Error("Invalid product ID")
		return nil, status.Error(codes.InvalidArgument, "Invalid product ID")
	}

	product, err := s.store.GetProductDetail(ctx, req.ProductId)
	if err != nil {
		logger.Error("s.store.GetProductDetail", zap.Error(err))
		return nil, status.Error(codes.Internal, "Failed to get product detail")
	}

	return &api.GetProductDetailResponse{
		Product: &api.Product{
			Id:          product.ID,
			Name:        product.Name,
			Description: product.Description.String,
			Price:       format.NumericToFloat64(product.Price),
			Stock:       product.Stock,
			ImageUrl:    product.ImageUrl,
			Brand: &api.Brand{
				Id:       product.BrandID,
				Name:     product.BrandName.String,
				ImageUrl: product.BrandImageUrl.String,
			},
			Category: &api.Category{
				Id:       product.CategoryID,
				Name:     product.CategoryName.String,
				ImageUrl: product.CategoryImageUrl.String,
			},
			BuyTurn:   product.Buyturn,
			CreatedAt: format.PgToPbTimestamp(product.CreatedAt),
			UpdatedAt: format.PgToPbTimestamp(product.UpdatedAt),
		},
	}, nil
}
