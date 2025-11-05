package domain

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/config"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
	jwtUtils "github.com/linhhuynhcoding/web-my-pham/server/utils/jwt"

	"golang.org/x/crypto/bcrypt"
)

var (
	DefaultSigningMethod = jwt.SigningMethodHS256

	ErrInvalidUserHelper = errors.New("invalid user helper")
)

type UserHelper struct {
	*repository.User
	cfg *config.Config
}

func NewUserHelper(
	user *repository.User,
	cfg *config.Config,
) *UserHelper {
	return &UserHelper{
		User: user,
		cfg:  cfg,
	}
}

func (u *UserHelper) ValidatePassword(pwd string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(u.Password))
	return err
}

func (u *UserHelper) GenerateAccessToken() (string, error) {
	if u.User == nil || u.cfg == nil {
		return consts.EMPTY_STRING, ErrInvalidUserHelper
	}

	claim := NewAccessTokenClaim(u.ID, u.Email, u.Role, *u.cfg)

	accessToken, err := jwtUtils.GenerateNewToken(jwtUtils.JwtOpts{
		Key:           u.cfg.TokenConfig.AccessSecretKey,
		SigningMethod: *DefaultSigningMethod,
		Claims:        claim,
	})
	if err != nil {
		return consts.EMPTY_STRING, err
	}

	return accessToken, nil
}

func (u *UserHelper) HashPassword(pwd string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
	if err != nil {
		return consts.EMPTY_STRING, err
	}
	return string(hashedPassword), nil
}
