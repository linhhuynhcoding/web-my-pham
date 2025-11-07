package service

import (
	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/domain"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
	"github.com/linhhuynhcoding/web-my-pham/server/utils/format"
	"go.uber.org/zap"
)

func (s *Service) buildPagination(pagination *api.Pagination, total int32) *api.Pagination {
	return &api.Pagination{
		CurrentPage: pagination.CurrentPage + 1,
		PageSize:    pagination.PageSize,
		Total:       total,
		LastPage:    (total / pagination.PageSize),
		HasNextPage: (total / pagination.PageSize) >= pagination.CurrentPage+1,
	}
}

// buildLimitOffset return limit, offset from api.Pagination
func (s *Service) buildLimitOffset(pagination *api.Pagination) (int32, int32) {
	if pagination == nil {
		return consts.DEFAULT_PAGE_SIZE, (consts.DEFAULT_PAGE - 1) * consts.DEFAULT_PAGE_SIZE
	}
	return pagination.PageSize, (pagination.CurrentPage - 1) * pagination.PageSize
}

func (s *Service) brands2BrandsApi(brand []repository.Brand) []*api.Brand {
	brands := []*api.Brand{}
	for _, brand := range brand {
		brands = append(brands, &api.Brand{
			Id:       brand.ID,
			Name:     brand.Name.String,
			ImageUrl: brand.ImageUrl.String,
		})
	}
	return brands
}

func (s *Service) categories2CategoriesApi(categories []repository.Category) []*api.Category {
	resp := []*api.Category{}
	for _, category := range categories {
		resp = append(resp, &api.Category{
			Id:       category.ID,
			Name:     category.Name,
			ImageUrl: category.ImageUrl.String,
		})
	}
	return resp
}

func (s *Service) products2ProductsApi(product domain.IProduct) *api.Product {
	price, err := product.GetPrice().Float64Value()
	if err != nil {
		s.logger.Error("failed to get price", zap.Error(err))
	}
	return &api.Product{
		Id:          product.GetID(),
		Name:        product.GetName(),
		Description: product.GetDescription().String,
		Price:       price.Float64,
		Category: &api.Category{
			Id:       product.GetCategoryID(),
			Name:     product.GetCategoryName().String,
			ImageUrl: product.GetCategoryImageUrl().String,
		},
		Brand: &api.Brand{
			Id:       product.GetBrandID(),
			Name:     product.GetBrandName().String,
			ImageUrl: product.GetBrandImageUrl().String,
		},
		Stock:     product.GetStock(),
		BuyTurn:   product.GetBuyturn(),
		ImageUrl:  product.GetImageUrl(),
		CreatedAt: format.PgToPbTimestamp(product.GetCreatedAt()),
		UpdatedAt: format.PgToPbTimestamp(product.GetUpdatedAt()),
	}
}
