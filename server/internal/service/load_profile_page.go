package service

import (
	"context"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/domain"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"go.uber.org/zap"
)

// load profile info page
// response
// - user info

// load user order page
// response
// - history orders

// query
// name: GetOrderHistoryByUserID :many
// - group by user_id
// - user_id = $1
// - limit, offset
// - order by

func (s *Service) LoadProfileInfoPage(ctx context.Context, req *api.LoadProfileInfoPageRequest) (*api.LoadProfileInfoPageResponse, error) {
	logger := s.logger.With(zap.String("func", "LoadProfileInfoPage"))
	logger.Info("LoadProfileInfoPage", zap.Any("req", req))

	accessToken, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		logger.Error("failed to get access token", zap.Error(err))
		return nil, err
	}

	user, err := s.store.GetUserByEmail(ctx, accessToken.Email)
	if err != nil {
		logger.Error("failed to get user", zap.Error(err))
		return nil, err
	}

	return &api.LoadProfileInfoPageResponse{
		User: &api.User{
			Id:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	}, nil
}

func (s *Service) LoadUserOrderPage(ctx context.Context, req *api.LoadUserOrderPageRequest) (*api.LoadUserOrderPageResponse, error) {
	logger := s.logger.With(zap.String("func", "LoadUserOrderPage"))
	logger.Info("LoadUserOrderPage", zap.Any("req", req))

	accessToken, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		logger.Error("failed to get access token", zap.Error(err))
		return nil, err
	}

	if req.Pagination == nil {
		req.Pagination = &api.Pagination{}
	}
	limit, offset := s.buildLimitOffset(req.Pagination)

	orders, err := s.store.GetOrderHistoryByUserEmail(ctx, repository.GetOrderHistoryByUserEmailParams{
		UserEmail: accessToken.Email,
		Limit:     limit,
		Offset:    offset,
	})
	if err != nil {
		logger.Error("failed to get orders", zap.Error(err))
		return nil, err
	}
	orderIds := make([]int32, 0, len(orders))
	for _, o := range orders {
		orderIds = append(orderIds, o.ID)
	}

	orderItems, err := s.store.GetOrderDetailByID(ctx, orderIds)
	if err != nil {
		logger.Error("failed to get order items", zap.Error(err))
		return nil, err
	}

	return &api.LoadUserOrderPageResponse{
		Orders:     s.mapOrderDb2Api(orders, orderItems),
		Pagination: s.buildPagination(req.Pagination, int32(len(orders))),
	}, nil
}

func (s *Service) mapOrderDb2Api(orders []repository.GetOrderHistoryByUserEmailRow, orderItems []repository.GetOrderDetailByIDRow) []*api.Order {
	orderResp := []*api.Order{}
	orderItemsMap := s.mapOrderID2OrderItem(orderItems)

	for _, order := range orders {
		orderItem := orderItemsMap[order.ID]

		orderResp = append(orderResp, s.orders2OrdersApi(order, orderItem))
	}
	return orderResp
}

func (s *Service) mapOrderID2OrderItem(orderItems []repository.GetOrderDetailByIDRow) map[int32][]repository.GetOrderDetailByIDRow {
	orderItemsMap := make(map[int32][]repository.GetOrderDetailByIDRow)
	for _, item := range orderItems {
		orderItemsMap[item.ID] = append(orderItemsMap[item.ID], item)
	}
	return orderItemsMap
}
