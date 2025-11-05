package service

import (
	"context"
	"database/sql"
	"errors"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/domain"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

// TODO: update response message
func (s *Service) Login(ctx context.Context, req *api.LoginRequest) (*api.LoginResponse, error) {
	logger := s.logger.With(zap.String("func", "Login"))
	logger.Info("login", zap.Any("req", req))

	// validate request
	err := req.ValidateAll()
	if err != nil {
		logger.Error("Validate request failed!", zap.Any("error", err))
		return nil, err
	}

	// check user is exist
	user, err := s.store.GetUserByEmail(ctx, req.String())
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		logger.Error("get user by email failed!", zap.Any("error", err))
		return nil, consts.ErrInvalidData
	}
	if errors.Is(err, sql.ErrNoRows) {
		logger.Error("user not found!", zap.Any("error", err))
		return nil, consts.ErrUserNotFournd
	}

	userHelper := domain.NewUserHelper(&user, s.cfg)

	// validate password
	err = userHelper.ValidatePassword(req.Password)
	if err != nil {
		logger.Error("validate password failed!", zap.Any("error", err))
		return nil, consts.ErrInvalidPassword
	}

	accessToken, err := userHelper.GenerateAccessToken()
	if err != nil {
		logger.Error("generate access token failed!", zap.Any("error", err))
		return nil, consts.ErrInternalServer
	}

	return &api.LoginResponse{
		AccessToken: accessToken,
		User: &api.User{
			Name:  user.Name,
			Email: user.Email,
		},
	}, nil
}

func (s *Service) Register(ctx context.Context, req *api.RegisterRequest) (*api.RegisterResponse, error) {
	logger := s.logger.With(zap.String("func", "Register"))
	logger.Info("Register", zap.Any("req", req))

	// validate request
	err := req.ValidateAll()
	if err != nil {
		logger.Error("Validate request failed!", zap.Any("error", err))
		return nil, err
	}

	// validate confirm pwd
	if req.Password != req.ConfirmPassword {
		logger.Error("confirm pwd not match")
		return nil, consts.ErrInvalidRequest
	}

	// check user is exist
	err = s.store.IsUserExist(ctx, req.Email)
	if err != nil && errors.Is(err, sql.ErrNoRows) {
		logger.Error("user already existed!", zap.Any("error", err))
		return nil, consts.ErrUserAlreadyExist
	}

	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("hash password failed!", zap.Any("error", err))
		return nil, consts.ErrInternalServer
	}

	_, err = s.store.UpsertUSer(ctx, repository.UpsertUSerParams{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     string(UserRole),
	})
	if err != nil {
		logger.Error("failed to insert user", zap.Error(err))
		return nil, consts.ErrCannotRegister
	}

	return &api.RegisterResponse{}, nil
}
