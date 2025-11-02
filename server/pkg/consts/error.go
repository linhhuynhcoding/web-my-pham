package consts

import (
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	ErrInvalidData = status.Error(codes.Internal, "invalid data")
)
