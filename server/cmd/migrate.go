package main

import (
	"context"
	"database/sql"

	_ "github.com/lib/pq"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/config"
	"go.uber.org/fx"
	"go.uber.org/zap"
)

func MigrateCommand() {
	app := fx.New(
		fx.Provide(
			context.Background,
			config.NewConfig,
			zap.NewProduction,
			NewDb,
		),

		fx.Invoke(runMigrate),
	)
	app.Run()
}

func runMigrate(lc fx.Lifecycle, ctx context.Context, cfg *config.Config, logger *zap.Logger, store repository.Store, shutdowner fx.Shutdowner) {
	lc.Append(fx.Hook{
		OnStart: func(context.Context) error {
			err := Migrate(logger, cfg, store)
			if err != nil {
				logger.Error("failed to migrate db", zap.Error(err))
				return err
			}
			shutdowner.Shutdown()
			return nil
		},
	})
}

func Migrate(logger *zap.Logger, cfg *config.Config, store repository.Store) error {
	logger.Info("starting db migration...")

	db, err := sql.Open("postgres", cfg.DBSource)
	if err != nil {
		logger.Error("cannot connect to db", zap.Error(err))
		return err
	}
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		logger.Error("cannot create postgres driver", zap.Error(err))
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://sql/migration",
		"postgres", driver)
	if err != nil {
		logger.Error("cannot create new migrate instance", zap.Error(err))
		return err
	}

	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		logger.Error("failed to run migrate up", zap.Error(err))
		return err
	}

	logger.Info("db migrated successfully")
	return nil
}
