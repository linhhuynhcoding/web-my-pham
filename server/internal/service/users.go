package service

import (
	"context"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"go.uber.org/zap"
)

func (s *Service) LoadAccounts(ctx context.Context, req *api.LoadAccountsRequest) (*api.LoadAccountsResponse, error) {
	logger := s.logger.With(zap.String("func", "LoadAccounts"))
	logger.Info("LoadAccounts", zap.Any("req", req))

	limit, offset := s.buildLimitOffset(req.Pagination)

	users, err := s.store.GetAllUsers(ctx, repository.GetAllUsersParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		logger.Error("failed to get users", zap.Error(err))
		return nil, err
	}
	if len(users) == 0 {
		return &api.LoadAccountsResponse{
			Users:      []*api.User{},
			Pagination: nil,
		}, nil
	}

	usersApi := make([]*api.User, 0, len(users))
	for _, user := range users {
		usersApi = append(usersApi, &api.User{
			Id:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		})
	}

	return &api.LoadAccountsResponse{
		Users:      usersApi,
		Pagination: s.buildPagination(req.Pagination, int32(*users[0].Total)),
	}, nil
}
