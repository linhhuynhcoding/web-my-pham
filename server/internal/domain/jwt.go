package domain

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/config"
)

const (
	DefaultIssuer = "nhat-linh-dep-trai.com"
)

type AccessTokenClaim struct {
	jwt.RegisteredClaims
	Email string `json:"email"`
	Role  string `json:"role"`
}

func NewAccessTokenClaim(id int32, email, role string, cfg config.Config) AccessTokenClaim {
	expiredAt := time.Now().UTC().Add(time.Duration(cfg.TokenConfig.AccessTokenTTL) * time.Second)

	return AccessTokenClaim{
		Email: email,
		Role:  role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   string(id),
			Issuer:    DefaultIssuer,
			IssuedAt:  jwt.NewNumericDate(time.Now().UTC()),
			ExpiresAt: jwt.NewNumericDate(expiredAt),
		},
	}
}
