package service

import (
	"context"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/utils/format"
	"go.uber.org/zap"
	"google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Service) CreateBrand(ctx context.Context, req *api.CreateBrandRequest) (*api.CreateBrandResponse, error) {
	if violations := validateCreateBrandRequest(req); violations != nil {
		return nil, invalidArgumentError(violations)
	}
	logger := s.logger.With(zap.String("func", "CreateBrand"))
	arg := repository.CreateBrandParams{
		Name:     format.StringToPgText(req.GetName()),
		ImageUrl: format.StringToPgText(req.GetImageUrl()),
	}
	brand, err := s.store.CreateBrand(ctx, arg)
	if err != nil {
		logger.Error("s.store.CreateBrand", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "failed to create brand: %s", err)
	}
	logger.Info("Brand created successfully", zap.Any("brand_id", brand.ID))
	return &api.CreateBrandResponse{
		Brand: &api.Brand{
			Id:       brand.ID,
			Name:     brand.Name.String,
			ImageUrl: brand.ImageUrl.String,
		},
	}, nil
}
func (s *Service) ListBrands(ctx context.Context, req *api.ListBrandsRequest) (*api.ListBrandsResponse, error) {
	logger := s.logger.With(zap.String("func", "ListBrands"))
	limit, offset := s.buildLimitOffset(req.GetPagination())
	arg := repository.ListBrandsParams{
		Limit:  limit,
		Offset: offset,
	}
	brands, err := s.store.ListBrands(ctx, arg)
	if err != nil {
		logger.Error("s.store.ListBrands", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "failed to list brands: %s", err)
	}
	total, err := s.store.CountBrands(ctx)
	if err != nil {
		logger.Error("s.store.CountBrands", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "failed to count brands: %s", err)
	}
	brandsApi := make([]*api.Brand, len(brands))
	for i, brand := range brands {
		brandsApi[i] = &api.Brand{
			Id:       brand.ID,
			Name:     brand.Name.String,
			ImageUrl: brand.ImageUrl.String,
		}
	}
	return &api.ListBrandsResponse{
		Brands:     brandsApi,
		Pagination: s.buildPagination(req.Pagination, int32(*total)),
	}, nil
}
func (s *Service) UpdateBrand(ctx context.Context, req *api.UpdateBrandRequest) (*api.UpdateBrandResponse, error) {
	logger := s.logger.With(zap.String("func", "UpdateBrand"))
	arg := repository.UpdateBrandParams{
		ID:       req.GetBrandId(),
		Name:     format.PbWrapString2PgText(req.GetName()),
		ImageUrl: format.PbWrapString2PgText(req.GetImageUrl()),
	}
	brand, err := s.store.UpdateBrand(ctx, arg)
	if err != nil {
		logger.Error("s.store.UpdateBrand", zap.Error(err), zap.Any("brand_id", req.BrandId))
		return nil, status.Errorf(codes.Internal, "failed to update brand: %s", err)
	}
	logger.Info("Brand updated successfully", zap.Any("brand_id", brand.ID))
	return &api.UpdateBrandResponse{
		Brand: &api.Brand{
			Id:       brand.ID,
			Name:     brand.Name.String,
			ImageUrl: brand.ImageUrl.String,
		},
	}, nil
}
func (s *Service) DeleteBrand(ctx context.Context, req *api.DeleteBrandRequest) (*api.DeleteBrandResponse, error) {
	if err := s.store.DeleteBrand(ctx, req.GetBrandId()); err != nil {
		return nil, status.Errorf(codes.Internal, "failed to delete brand: %s", err)
	}
	logger := s.logger.With(zap.String("func", "DeleteBrand"))
	logger.Info("Brand deleted successfully", zap.Any("brand_id", req.BrandId))
	return &api.DeleteBrandResponse{}, nil
}

func validateCreateBrandRequest(req *api.CreateBrandRequest) (violations []*errdetails.BadRequest_FieldViolation) {
	if req.GetName() == "" {
		violations = append(violations, fieldViolation("name", "is required"))
	}
	return violations
}
