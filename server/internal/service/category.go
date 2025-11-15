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

func (s *Service) CreateCategory(ctx context.Context, req *api.CreateCategoryRequest) (*api.CreateCategoryResponse, error) {
	if violations := validateCreateCategoryRequest(req); violations != nil {
		return nil, invalidArgumentError(violations)
	}
	logger := s.logger.With(zap.String("func", "CreateCategory"))
	arg := repository.CreateCategoryParams{
		Name:     req.GetName(),
		ImageUrl: format.StringToPgText(req.GetImageUrl()),
	}

	category, err := s.store.CreateCategory(ctx, arg)
	if err != nil {
		logger.Error("s.store.CreateCategory", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "failed to create category: %s", err)
	}
	logger.Info("Category created successfully", zap.Any("category_id", category.ID))

	return &api.CreateCategoryResponse{
		Category: &api.Category{
			Id:        category.ID,
			Name:      category.Name,
			ImageUrl:  category.ImageUrl.String,
			CreatedAt: format.PgToPbTimestamp(category.CreatedAt),
		},
	}, nil
}
func (s *Service) ListCategories(ctx context.Context, req *api.ListCategoriesRequest) (*api.ListCategoriesResponse, error) {
	logger := s.logger.With(zap.String("func", "ListCategories"))
	limit, offset := s.buildLimitOffset(req.GetPagination())

	arg := repository.ListCategoriesParams{
		Limit:  int32(limit),
		Offset: offset,
	}

	categories, err := s.store.ListCategories(ctx, arg)
	if err != nil {
		logger.Error("s.store.ListCategories", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "failed to list categories: %s", err)
	}

	total, err := s.store.CountCategories(ctx)
	if err != nil {
		logger.Error("s.store.CountCategories", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "failed to count categories: %s", err)
	}

	categoriesApi := make([]*api.Category, len(categories))
	for i, category := range categories {
		categoriesApi[i] = &api.Category{
			Id:        category.ID,
			Name:      category.Name,
			ImageUrl:  category.ImageUrl.String,
			CreatedAt: format.PgToPbTimestamp(category.CreatedAt),
		}
	}

	return &api.ListCategoriesResponse{
		Categories: categoriesApi,
		Pagination: s.buildPagination(req.Pagination, int32(*total)),
	}, nil
}
func (s *Service) UpdateCategory(ctx context.Context, req *api.UpdateCategoryRequest) (*api.UpdateCategoryResponse, error) {
	logger := s.logger.With(zap.String("func", "UpdateCategory"))
	arg := repository.UpdateCategoryParams{
		ID:       req.GetCategoryId(),
		Name:     req.GetName().GetValue(),
		ImageUrl: format.PbWrapString2PgText(req.GetImageUrl()),
	}

	category, err := s.store.UpdateCategory(ctx, arg)
	if err != nil {
		logger.Error("s.store.UpdateCategory", zap.Error(err), zap.Any("category_id", req.GetCategoryId()))
		return nil, status.Errorf(codes.Internal, "failed to update category: %s", err)
	}
	logger.Info("Category updated successfully", zap.Any("category_id", category.ID))

	return &api.UpdateCategoryResponse{
		Category: &api.Category{
			Id:        category.ID,
			Name:      category.Name,
			ImageUrl:  category.ImageUrl.String,
			CreatedAt: format.PgToPbTimestamp(category.CreatedAt),
		},
	}, nil
}
func (s *Service) DeleteCategory(ctx context.Context, req *api.DeleteCategoryRequest) (*api.DeleteCategoryResponse, error) {
	logger := s.logger.With(zap.String("func", "DeleteCategory"))
	if err := s.store.DeleteCategory(ctx, req.GetCategoryId()); err != nil {
		logger.Error("s.store.DeleteCategory", zap.Error(err), zap.Any("category_id", req.GetCategoryId()))
		return nil, status.Errorf(codes.Internal, "failed to delete category: %s", err)
	}
	logger.Info("Category deleted successfully", zap.Any("category_id", req.GetCategoryId()))
	return &api.DeleteCategoryResponse{}, nil
}

func validateCreateCategoryRequest(req *api.CreateCategoryRequest) (violations []*errdetails.BadRequest_FieldViolation) {
	if req.GetName() == "" {
		violations = append(violations, fieldViolation("name", "is required"))
	}
	return violations
}

func fieldViolation(field string, description string) *errdetails.BadRequest_FieldViolation {
	return &errdetails.BadRequest_FieldViolation{
		Field:       field,
		Description: description,
	}
}

func invalidArgumentError(violations []*errdetails.BadRequest_FieldViolation) error {
	badRequest := &errdetails.BadRequest{FieldViolations: violations}
	statusInvalid := status.New(codes.InvalidArgument, "invalid parameters")

	statusWithDetails, err := statusInvalid.WithDetails(badRequest)
	if err != nil {
		return statusInvalid.Err()
	}

	return statusWithDetails.Err()
}
