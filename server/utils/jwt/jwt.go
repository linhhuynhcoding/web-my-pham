package jwt

import (
	"github.com/golang-jwt/jwt/v5"
)

type JwtOpts struct {
	Key           any
	SigningMethod jwt.SigningMethodHMAC
	Claims        jwt.Claims
}

func GenerateNewToken(opts JwtOpts) (string, error) {
	t := jwt.NewWithClaims(&opts.SigningMethod, opts.Claims)
	s, err := t.SignedString(opts.Key)
	return s, err
}

func ValidateToken(tokenString string, opts JwtOpts) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return opts.Key, nil
	}, jwt.WithValidMethods([]string{opts.SigningMethod.Alg()}))
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		return claims, nil
	} else {
		return nil, err
	}
}
