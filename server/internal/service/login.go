package service

import (
	"context"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Service) Login(ctx context.Context, req *api.LoginRequest) (*api.LoginResponse, error) {
	logger := s.logger.With(zap.String("func", "Login"))
	logger.Info("login", zap.Any("req", req))

	pwd := req.GetPassword()
	correctPwd := s.cfg.Password
	if pwd != correctPwd {
		logger.Error("incorrect password")
		return nil, status.Errorf(codes.Unauthenticated, "incorrect password")
	}

	token := s.cfg.Token

	return &api.LoginResponse{
		AccessToken: token,
	}, nil
}
