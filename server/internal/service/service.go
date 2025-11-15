package service

import (
	"context"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/adapter/cloudinary"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/config"
	"go.uber.org/zap"
)

type Service struct {
	api.UnimplementedServiceServer
	logger            *zap.Logger
	cfg               *config.Config
	store             repository.Store
	cloudinaryAdapter cloudinary.ICoundinaryClient
}

func NewService(
	ctx context.Context,
	logger *zap.Logger,
	cfg *config.Config,
	store repository.Store,
	cloudinaryAdapter cloudinary.ICoundinaryClient,
) *Service {
	return &Service{
		logger:            logger,
		cfg:               cfg,
		store:             store,
		cloudinaryAdapter: cloudinaryAdapter,
	}
}
