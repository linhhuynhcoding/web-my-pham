package service_test

import (
	"context"
	"testing"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/service"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/config"
	"go.uber.org/zap"
)

func TestService_Login(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for receiver constructor.
		logger *zap.Logger
		cfg    *config.Config
		store  repository.Store
		// Named input parameters for target function.
		req     *api.LoginRequest
		want    *api.LoginResponse
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := service.NewService(context.Background(), tt.logger, tt.cfg, tt.store)
			got, gotErr := s.Login(context.Background(), tt.req)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("Login() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("Login() succeeded unexpectedly")
			}
			// TODO: update the condition below to compare got with tt.want.
			if true {
				t.Errorf("Login() = %v, want %v", got, tt.want)
			}
		})
	}
}
