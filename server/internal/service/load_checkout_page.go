package service

import (
	"context"

	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/domain"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// load checkout page
// request:
// 1. cart_items: []int

// response
// 1. order_info
// - products
// - ship_fee
// - total_price
// 2. order_detail_form
// 	- payment_method

func (s *Service) LoadCheckoutPage(ctx context.Context, req *api.LoadCheckoutPageRequest) (*api.LoadCheckoutPageResponse, error) {
	logger := s.logger.With(zap.String("func", "LoadCheckoutPage"))
	logger.Info("LoadCheckoutPage", zap.Any("req", req))

	_, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		logger.Error("Failed to get access token from context", zap.Error(err))
		return nil, status.Errorf(codes.Unauthenticated, "invalid access token")
	}
	// userId := accessToken.UserID

	// Fetch cart items from the database
	dbCartItems, err := s.store.FetchProductToCheckout(ctx, req.CartItemIds)
	if err != nil {
		logger.Error("Failed to fetch cart items for checkout", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "failed to load checkout items")
	}

	var cartItems []*api.CartItem
	var subtotal float64

	for _, item := range dbCartItems {
		productPrice, err := item.ProductPrice.Float64Value()
		if err != nil {
			logger.Error("Failed to convert product price", zap.Error(err))
		}
		sub := productPrice.Float64 * float64(item.Quantity.Int32)
		cartItems = append(cartItems, &api.CartItem{
			Id:       item.ID,
			Quantity: item.Quantity.Int32,
			Subtotal: sub,
			Product: &api.Product{
				Id:       item.ProductID,
				Name:     item.ProductName,
				ImageUrl: item.ProductImageUrl,
				Price:    productPrice.Float64,
			},
		})
		subtotal += sub
	}

	shippingFee := 30000.0
	totalPrice := subtotal + shippingFee

	return &api.LoadCheckoutPageResponse{
		OrderInfo: &api.OrderInfo{
			Items:       cartItems, // Populated with actual data
			ShippingFee: shippingFee,
			TotalPrice:  totalPrice, // Calculated total
		},
		OrderDetailForm: &api.OrderDetailForm{
			AvailablePaymentMethods: []*api.PaymentMethod{
				{
					Type: api.PaymentMethodType_CASH_ON_DELIVERY,
					Name: "COD",
				},
			},
		},
	}, nil
}
