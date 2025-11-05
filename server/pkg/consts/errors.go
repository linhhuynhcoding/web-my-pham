package consts

import (
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	ErrInvalidData    = status.Error(codes.Internal, "invalid data")
	ErrInvalidRequest = status.Error(codes.InvalidArgument, "invalid request")
	ErrInternalServer = status.Error(codes.Internal, "internal server error")
)

var (
	ErrUserNotFournd    = status.Error(codes.NotFound, "user not found")
	ErrInvalidPassword  = status.Error(codes.Unauthenticated, "incorrect password")
	ErrUserAlreadyExist = status.Error(codes.AlreadyExists, "user already exist")
	ErrCannotRegister   = status.Error(codes.Internal, "cannot register")
)
