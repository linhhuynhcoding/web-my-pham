package domain

import (
	"context"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/config"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
	jwtUtils "github.com/linhhuynhcoding/web-my-pham/server/utils/jwt"
	"google.golang.org/grpc/metadata"
)

const (
	DefaultIssuer = "nhat-linh-dep-trai.com"
)

type AccessTokenClaim struct {
	jwt.RegisteredClaims
	Email  string `json:"email"`
	UserID int32  `json:"user_id"`
	Role   string `json:"role"`
}

func NewAccessTokenClaim(id int32, email, role string, cfg config.Config) AccessTokenClaim {
	expiredAt := time.Now().UTC().Add(time.Duration(cfg.TokenConfig.AccessTokenTTL) * time.Second)

	return AccessTokenClaim{
		Email:  email,
		Role:   role,
		UserID: id,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   string(id),
			Issuer:    DefaultIssuer,
			IssuedAt:  jwt.NewNumericDate(time.Now().UTC()),
			ExpiresAt: jwt.NewNumericDate(expiredAt),
		},
	}
}

func NewAccessTokenClaimFromHeader(ctx context.Context, cfg *config.Config) (AccessTokenClaim, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return AccessTokenClaim{}, consts.ErrUnauthorized
	}

	authToken := md[consts.AuthorizationHeader][0]
	token := strings.Split(authToken, " ")[1]

	claims, err := jwtUtils.ValidateToken(token, jwtUtils.JwtOpts{
		Key:           []byte(cfg.TokenConfig.AccessSecretKey),
		SigningMethod: *DefaultSigningMethod,
	})
	if err != nil {
		return AccessTokenClaim{}, err
	}

	return AccessTokenClaim{
		Email:  claims["email"].(string),
		UserID: int32(claims["user_id"].(float64)),
		Role:   claims["role"].(string),
	}, nil
}
