package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/adapter/cloudinary"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/service"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/config"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/middleware"
	"github.com/rs/cors"
	"go.uber.org/fx"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Command struct {
	name    string
	command func()
}

// TODO: IMPLEMENT FX
func main() {
	argsWithProg := os.Args
	cmds := os.Args[1:]

	// arg := os.Args[3]
	fmt.Println(argsWithProg)
	fmt.Println(cmds)
	// fmt.Println(arg)

	commands := []Command{
		{
			name:    "migrate",
			command: MigrateCommand,
		},
		{
			name:    "server",
			command: ServerCommand,
		},
	}

	for _, cmd := range commands {
		if cmd.name == cmds[0] {
			cmd.command()
		}
	}
}

func ServerCommand() {
	app := fx.New(
		fx.Provide(
			context.Background,
			config.NewConfig,
			zap.NewProduction,
			NewDb,
			service.NewService,
			cloudinary.NewCloudinaryClient,
		),

		fx.Invoke(runServer),
	)
	app.Run()
}

func runServer(
	lc fx.Lifecycle,
	ctx context.Context,
	cfg *config.Config,
	log *zap.Logger,
	service *service.Service,
) {
	go func() {
		lis, err := net.Listen("tcp", fmt.Sprintf(":%v", cfg.GrpcPort))
		if err != nil {
			log.Fatal("failed to listen: %v", zap.Error(err))
		}

		s := grpc.NewServer()
		api.RegisterServiceServer(s, service)

		log.Info("gRPC server listening", zap.Any("port", cfg.GrpcPort))
		if err := s.Serve(lis); err != nil {
			log.Fatal("failed to serve: %v", zap.Error(err))
		}
	}()

	go func() {
		mux := runtime.NewServeMux(
			runtime.WithErrorHandler(middleware.CustomHTTPError),
		)

		opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
		err := api.RegisterServiceHandlerFromEndpoint(ctx, mux, fmt.Sprintf(":%v", cfg.GrpcPort), opts)
		if err != nil {
			log.Fatal("failed to start gateway", zap.Error(err))
		}

		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"*", "http://localhost:5173"}, // hoặc ["http://localhost:3000"] nếu muốn giới hạn
			AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowedHeaders:   []string{"Content-Type", "Authorization"},
			AllowCredentials: true,
		})
		handler := c.Handler(mux)

		mux.HandlePath("POST", "/v1/upload", service.UploadFileHTTP)

		log.Info("gRPC-Gateway listening", zap.Any("port", cfg.HttpPort))
		if err := http.ListenAndServe(fmt.Sprintf(":%v", cfg.HttpPort), handler); err != nil {
			log.Fatal("failed to serve: %v", zap.Error(err))
		}
	}()
}

func NewServer(
	lc fx.Lifecycle,
	ctx context.Context,
	cfg config.Config,
	log *zap.Logger,
	service *service.Service,
) {

	// ------------------------------------------------------------
	// 		START SERVER
	// ------------------------------------------------------------
	lis, err := net.Listen("tcp", fmt.Sprintf(":%v", cfg.GrpcPort))
	if err != nil {
		log.Fatal("failed to listen: %v", zap.Error(err))
	}

	s := grpc.NewServer()
	api.RegisterServiceServer(s, service)

	log.Info("gRPC server listening", zap.Any("port", cfg.GrpcPort))
	if err := s.Serve(lis); err != nil {
		log.Fatal("failed to serve: %v", zap.Error(err))
	}
}

func NewGatewayServer(
	ctx context.Context,
	cfg config.Config,
	log *zap.Logger,
	service *service.Service,
) {
	mux := runtime.NewServeMux(
		runtime.WithErrorHandler(middleware.CustomHTTPError),
	)

	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	err := api.RegisterServiceHandlerFromEndpoint(ctx, mux, fmt.Sprintf("localhost:%v", cfg.GrpcPort), opts)
	if err != nil {
		log.Fatal("failed to start gateway", zap.Error(err))
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*", "http://localhost:5173"}, // hoặc ["http://localhost:3000"] nếu muốn giới hạn
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	handler := c.Handler(mux)

	log.Info("gRPC-Gateway listening", zap.Any("port", cfg.HttpPort))
	if err := http.ListenAndServe(fmt.Sprintf(":%v", cfg.HttpPort), handler); err != nil {
		log.Fatal("failed to serve: %v", zap.Error(err))
	}
}

func NewDb(ctx context.Context, logger *zap.Logger, config *config.Config) repository.Store {
	connPool, err := pgxpool.New(ctx, config.DBSource)
	if err != nil {
		log.Fatal("cannot connect to db")
	}
	store := repository.NewStore(connPool)

	return store
}
