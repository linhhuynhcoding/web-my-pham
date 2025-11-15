package service

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/utils/format"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Update order
// Request:
// order

// Delete order
// Request:
// order_id

// List order
// Request:
// 1. Filter
// - brand
// - date [range]
// - total_amount [range]
// - product_id
// - user_email
// 2. Order by
// - total_amount [range]
// - date [range]
// Response
// - orders
// - pagination

func (s *Service) AdminLoadOrders(ctx context.Context, req *api.AdminLoadOrdersRequest) (*api.AdminLoadOrdersResponse, error) {
	logger := s.logger.With(zap.String("func", "AdminLoadOrders"))
	logger.Info("AdminLoadOrders", zap.Any("req", req))

	limit, offset := s.buildLimitOffset(req.Pagination)
	params := repository.ListOrdersParams{
		Limit:  limit,
		Offset: offset,
	}

	if req.Filter != nil {
		if req.Filter.UserEmail != nil && req.Filter.UserEmail.Value != "" {
			params.UserEmail = format.PbWrapString2PgText(req.GetFilter().UserEmail)
		}
		if req.Filter.OrderId != nil {
			params.OrderID = format.PbWrapInt322PgInt4(req.GetFilter().OrderId)
		}

		if req.Filter.DateRange != nil && req.Filter.DateRange.StartDate != nil && req.Filter.DateRange.EndDate != nil {
			if req.Filter.DateRange.StartDate.IsValid() {
				params.StartDate = pgtype.Timestamp{Time: req.Filter.DateRange.StartDate.AsTime(), Valid: true}
			}
			if req.Filter.DateRange.EndDate.IsValid() {
				params.EndDate = pgtype.Timestamp{Time: req.Filter.DateRange.EndDate.AsTime(), Valid: true}
			}
		}

		if req.Filter.TotalAmountRange != nil && (req.Filter.TotalAmountRange.Min > 0 || req.Filter.TotalAmountRange.Max > 0) {
			if req.Filter.TotalAmountRange.Min > 0 {
				params.MinTotalAmount = format.ToNumeric(req.Filter.TotalAmountRange.Min)
			}
			if req.Filter.TotalAmountRange.Max > 0 {
				params.MaxTotalAmount = format.ToNumeric(req.Filter.TotalAmountRange.Max)
			}
		}

		if req.Filter.Status != nil && req.Filter.Status.Value != "" && req.Filter.Status.Value != "ALL" {
			params.Status = format.PbWrapString2PgText(req.Filter.Status)
		}
	}

	switch req.OrderBy {
	case api.AdminOrderOrderBy_ORDER_DATE_ASC:
		params.OrderBy = "order_date_asc"
	case api.AdminOrderOrderBy_TOTAL_AMOUNT_DESC:
		params.OrderBy = "total_amount_desc"
	case api.AdminOrderOrderBy_TOTAL_AMOUNT_ASC:
		params.OrderBy = "total_amount_asc"
	default: // api.AdminOrderOrderBy_ORDER_DATE_DESC
		params.OrderBy = "order_date_desc"
	}

	orders, err := s.store.ListOrders(ctx, params)
	if err != nil {
		logger.Error("s.store.ListOrders", zap.Error(err))
		return nil, status.Error(codes.Internal, "Failed to load orders")
	}

	ordersApi := make([]*api.Order, len(orders))
	for i, order := range orders {
		ordersApi[i] = &api.Order{
			Id:              order.ID,
			UserEmail:       order.UserEmail,
			TotalPrice:      format.NumericToFloat64(order.TotalPrice),
			Status:          order.Status,
			CreatedAt:       format.PgToPbTimestamp(order.CreatedAt),
			UpdatedAt:       format.PgToPbTimestamp(order.UpdatedAt),
			ShippingAddress: order.ShippingAddress,
			PaymentMethod: &api.PaymentMethod{
				Type: api.PaymentMethodType_CASH_ON_DELIVERY,
				Name: order.PaymentMethod,
			},
			OrderDate: format.PgDateToPbTimestamp(order.OrderDate),
		}
	}
	if len(orders) == 0 {
		return &api.AdminLoadOrdersResponse{
			Orders:     []*api.Order{},
			Pagination: &api.Pagination{},
		}, nil
	}

	return &api.AdminLoadOrdersResponse{
		Orders:     ordersApi,
		Pagination: s.buildPagination(req.Pagination, int32(*orders[0].Total)), // Should be updated with total count
	}, nil
}
func (s *Service) UpdateOrderStatus(ctx context.Context, req *api.UpdateOrderStatusRequest) (*api.UpdateOrderStatusResponse, error) {
	logger := s.logger.With(zap.String("func", "UpdateOrderStatus"))

	order, err := s.store.UpdateOrderStatus(ctx, repository.UpdateOrderStatusParams{
		ID:     req.OrderId,
		Status: req.Status,
	})
	if err != nil {
		logger.Error("s.store.UpdateOrderStatus", zap.Error(err), zap.Int32("order_id", req.OrderId))
		return nil, status.Error(codes.Internal, "Failed to update order status")
	}
	return &api.UpdateOrderStatusResponse{Order: &api.Order{
		Id:              order.ID,
		UserEmail:       order.UserEmail,
		TotalPrice:      format.NumericToFloat64(order.TotalPrice),
		Status:          order.Status,
		CreatedAt:       format.PgToPbTimestamp(order.CreatedAt),
		UpdatedAt:       format.PgToPbTimestamp(order.UpdatedAt),
		ShippingAddress: order.ShippingAddress,
		PaymentMethod: &api.PaymentMethod{
			Type: api.PaymentMethodType_CASH_ON_DELIVERY,
			Name: order.PaymentMethod,
		},
		OrderDate: format.PgDateToPbTimestamp(order.OrderDate),
	}}, nil
}
