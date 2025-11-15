package service

import (
	"context"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/domain"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
	"github.com/linhhuynhcoding/web-my-pham/server/utils/format"
	"go.uber.org/zap"
)

func (s *Service) GetOrderDetail(ctx context.Context, req *api.GetOrderDetailRequest) (*api.GetOrderDetailResponse, error) {
	logger := s.logger.With(zap.String("func", "GetOrderDetail"))
	logger.Info("GetOrderDetail", zap.Any("req", req))

	accessToken, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		logger.Error("GetOrderDetail", zap.Error(err))
		return nil, consts.ErrUnauthorized
	}
	logger.Info("GetOrderDetail", zap.Any("accessToken", accessToken))

	userEmail := accessToken.Email

	order, err := s.store.GetOrderDetail(ctx, req.OrderId)
	if err != nil {
		logger.Error("GetOrderDetail", zap.Error(err))
		return nil, err
	}
	if strings.ToLower(accessToken.Role) != "admin" && order.UserEmail != userEmail {
		logger.Error("Not permission to do action")
		return nil, consts.ErrPermissionDenied
	}

	orderItems, err := s.store.GetOrderItems(ctx, pgtype.Int4{
		Int32: int32(order.ID),
		Valid: true,
	})
	if err != nil {
		logger.Error("failed to get order items", zap.Error(err))
		return nil, err
	}
	logger.Info("GetOrderDetail", zap.Any("order", order), zap.Any("orderItems", orderItems))

	var items []*api.OrderItem
	for _, item := range orderItems {
		price, err := item.Price.Float64Value()
		if err != nil {
			logger.Error("failed to get price", zap.Error(err))
		}
		priceProduct, err := item.ProductPrice.Float64Value()
		if err != nil {
			logger.Error("failed to get price product", zap.Error(err))
		}
		items = append(items, &api.OrderItem{
			ProductId: item.ProductID.Int32,
			Quantity:  item.Quantity,
			Price:     price.Float64,
			Product: &api.Product{
				Name:     item.ProductName.String,
				ImageUrl: item.ProductImageUrl.String,
				Price:    priceProduct.Float64,
			},
		})
	}

	totalPrice, err := order.TotalPrice.Float64Value()
	if err != nil {
		logger.Error("failed to get total price", zap.Error(err))
	}

	return &api.GetOrderDetailResponse{
		Order: &api.Order{
			Id:              order.ID,
			UserEmail:       order.UserEmail,
			TotalPrice:      totalPrice.Float64,
			ShippingAddress: order.ShippingAddress,
			Status:          order.Status,
			OrderDate:       format.PgToPbTimestamp(pgtype.Timestamp(order.OrderDate)),
			PaymentMethod: &api.PaymentMethod{
				Type: api.PaymentMethodType_CASH_ON_DELIVERY,
				Name: "COD",
			},
			Items:       items,
			ShippingFee: 30000,
			Phone:       order.Phone,
			User: &api.User{
				Name:  order.UserName.String,
				Email: order.UserEmail,
			},
			Notes: order.Notes.String,
		},
	}, nil
}
