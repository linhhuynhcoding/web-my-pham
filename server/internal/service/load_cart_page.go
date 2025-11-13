package service

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/domain"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
	"go.uber.org/zap"
)

// load cart page
// response:
// 1. items
// 2. total_price
// 3. check_out_bill
//
//
//

// query
// name: GetCartByUserId :many

func (s *Service) LoadCartPage(ctx context.Context, req *api.LoadCartPageRequest) (*api.LoadCartPageResponse, error) {
	logger := s.logger.With(zap.String("func", "LoadCartPage"))
	logger.Info("LoadCartPage", zap.Any("req", req))

	accessToken, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		logger.Error("failed to get access token", zap.Error(err))
		return nil, err
	}

	cartItemsDB, err := s.store.GetCartByUserId(ctx, pgtype.Int4{
		Int32: accessToken.UserID,
		Valid: true,
	})
	if err != nil {
		logger.Error("failed to get cart items by user id", zap.Error(err))
		return nil, consts.ErrInternalServer
	}

	if len(cartItemsDB) == 0 {
		return &api.LoadCartPageResponse{
			Items:        []*api.CartItem{},
			TotalPrice:   0,
			CheckOutBill: 0,
		}, nil
	}

	totalPrice := float64(cartItemsDB[0].TotalPrice)

	items := make([]*api.CartItem, 0, len(cartItemsDB))
	for _, itemDB := range cartItemsDB {
		subtotal, err := itemDB.Subtotal.Float64Value()
		if err != nil {
			logger.Error("failed to convert subtotal", zap.Error(err))
			continue
		}
		productPrice, err := itemDB.ProductPrice.Float64Value()
		if err != nil {
			logger.Error("failed to convert product price", zap.Error(err))
			continue
		}
		items = append(items, &api.CartItem{
			Id:       itemDB.CartItemID,
			Quantity: itemDB.Quantity.Int32,
			Subtotal: subtotal.Float64,
			Product: &api.Product{
				Id:       itemDB.ProductID,
				Name:     itemDB.ProductName,
				Price:    productPrice.Float64,
				ImageUrl: itemDB.ProductImageUrl,
			},
		})
	}

	return &api.LoadCartPageResponse{
		Items:        items,
		TotalPrice:   totalPrice,
		CheckOutBill: totalPrice, // Assuming checkout bill is same as total price for now
	}, nil
}

func (s *Service) UpdateCartItem(ctx context.Context, req *api.UpdateCartItemRequest) (*api.UpdateCartItemResponse, error) {
	logger := s.logger.With(zap.String("func", "UpdateCartItem"))
	logger.Info("UpdateCartItem", zap.Any("req", req))

	accessToken, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		logger.Error("failed to get access token", zap.Error(err))
		return nil, err
	}

	// Authorization check: Ensure the cart item belongs to the user
	isOwner, err := s.store.IsCartItemOwner(ctx, repository.IsCartItemOwnerParams{
		UserID: pgtype.Int4{
			Int32: accessToken.UserID,
			Valid: true,
		},
		CartItemID: req.CartItemId,
	})
	if err != nil || !isOwner {
		logger.Error("user is not the owner of the cart item or db error", zap.Error(err))
		return nil, consts.ErrPermissionDenied
	}

	updatedItem, err := s.store.UpdateCartItem(ctx, repository.UpdateCartItemParams{
		ID:       req.CartItemId,
		Quantity: req.Quantity,
	})
	if err != nil {
		logger.Error("failed to update cart item", zap.Error(err))
		return nil, consts.ErrInternalServer
	}

	subtotal, _ := updatedItem.Subtotal.Float64Value()

	return &api.UpdateCartItemResponse{
		Item: &api.CartItem{
			Id:        updatedItem.ID,
			CartId:    updatedItem.CartID.Int32,
			ProductId: updatedItem.ProductID.Int32,
			Quantity:  updatedItem.Quantity.Int32,
			Subtotal:  subtotal.Float64,
		},
	}, nil
}

func (s *Service) DeleteCartItem(ctx context.Context, req *api.DeleteCartItemRequest) (*api.DeleteCartItemResponse, error) {
	logger := s.logger.With(zap.String("func", "DeleteCartItem"))
	logger.Info("DeleteCartItem", zap.Any("req", req))

	accessToken, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		logger.Error("failed to get access token", zap.Error(err))
		return nil, err
	}

	// Authorization check: Ensure the cart item belongs to the user
	isOwner, err := s.store.IsCartItemOwner(ctx, repository.IsCartItemOwnerParams{
		UserID: pgtype.Int4{
			Int32: accessToken.UserID,
			Valid: true,
		},
		CartItemID: req.CartItemId,
	})
	if err != nil || !isOwner {
		logger.Error("user is not the owner of the cart item or db error", zap.Error(err))
		return nil, consts.ErrPermissionDenied
	}

	err = s.store.DeleteCartItem(ctx, req.CartItemId)
	if err != nil {
		logger.Error("failed to delete cart item", zap.Error(err))
		return nil, consts.ErrInternalServer
	}

	return &api.DeleteCartItemResponse{}, nil
}

func (s *Service) AddCartItem(ctx context.Context, req *api.AddCartItemRequest) (*api.AddCartItemResponse, error) {
	logger := s.logger.With(zap.String("func", "AddCartItem"))
	logger.Info("AddCartItem", zap.Any("req", req))

	if err := req.ValidateAll(); err != nil {
		logger.Error("request validation failed", zap.Error(err))
		return nil, consts.ErrInvalidRequest
	}

	accessToken, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		logger.Error("failed to get access token", zap.Error(err))
		return nil, consts.ErrUnauthorized
	}

	cartItem, err := s.store.AddCartItem(ctx, repository.AddCartItemParams{
		UserID: pgtype.Int4{
			Int32: accessToken.UserID,
			Valid: true,
		},
		ProductID: pgtype.Int4{
			Int32: req.ProductId,
			Valid: true,
		},
		Quantity: req.Quantity,
	})
	if err != nil {
		logger.Error("failed to add item to cart", zap.Error(err))
		return nil, consts.ErrInternalServer
	}

	subtotal, _ := cartItem.Subtotal.Float64Value()

	return &api.AddCartItemResponse{
		Item: &api.CartItem{Id: cartItem.ID, CartId: cartItem.CartID.Int32, ProductId: cartItem.ProductID.Int32, Quantity: cartItem.Quantity.Int32, Subtotal: subtotal.Float64},
	}, nil
}
