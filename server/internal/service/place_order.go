package service

import (
	"context"
	"math/big"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/linhhuynhcoding/web-my-pham/server/api"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/domain"
	"github.com/linhhuynhcoding/web-my-pham/server/internal/repository"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Service) PlaceOrder(ctx context.Context, req *api.PlaceOrderRequest) (*api.PlaceOrderResponse, error) {
	// 1. Validate input
	if len(req.CartItemIds) == 0 {
		return nil, status.Error(codes.InvalidArgument, "order must contain at least one item")
	}
	accessToken, err := domain.NewAccessTokenClaimFromHeader(ctx, s.cfg)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "invalid access token")
	}

	var totalAmount float64

	// A struct to hold details fetched within the transaction
	type itemDetail struct {
		CartItem repository.CartItem
		Product  repository.GetProductByIDRow
	}
	var detailedItems []itemDetail
	var orderID int32

	// 2. Start a database transaction
	err = s.store.ExecTx(ctx, func(q *repository.Queries) error {
		var txErr error

		// 3. For each cart item ID, fetch details, check stock, and calculate total
		for _, cartItemID := range req.CartItemIds {
			cartItem, txErr := q.GetCartItem(ctx, cartItemID)
			if txErr != nil {
				return status.Errorf(codes.NotFound, "cart item with id %d not found", cartItemID)
			}

			product, txErr := q.GetProductByID(ctx, cartItem.ProductID.Int32)
			if txErr != nil {
				return status.Errorf(codes.NotFound, "product with id %d not found", cartItem.ProductID)
			}

			if product.Stock < cartItem.Quantity.Int32 {
				return status.Errorf(codes.FailedPrecondition, "not enough stock for product %s. available: %d, requested: %d", product.Name, product.Stock, cartItem.Quantity)
			}
			productPrice, err := product.Price.Float64Value()
			if err != nil {
				return status.Errorf(codes.Internal, "failed to convert product price: %v", err)
			}
			totalAmount += productPrice.Float64 * float64(cartItem.Quantity.Int32)
			detailedItems = append(detailedItems, itemDetail{CartItem: cartItem, Product: product})
		}

		order, txErr := q.CreateOrder(ctx, repository.CreateOrderParams{
			UserEmail:       accessToken.Email,
			TotalPrice:      pgtype.Numeric{Int: big.NewInt(int64(totalAmount)), Valid: true},
			ShippingFee:     pgtype.Numeric{Int: big.NewInt(30000), Valid: true},
			ShippingAddress: req.OrderDetailForm.Address,
			Phone:           req.OrderDetailForm.Phone,
			PaymentMethod:   req.OrderDetailForm.PaymentMethod,
			OrderDate:       pgtype.Date{Time: time.Now().UTC(), Valid: true},
			Notes:           pgtype.Text{String: req.OrderDetailForm.Notes, Valid: true},
		})
		if txErr != nil {
			return status.Errorf(codes.Internal, "failed to create order: %v", txErr)
		}
		orderID = order.ID

		// 5. Create order items and update stock
		for _, detail := range detailedItems {
			if _, txErr = q.CreateOrderItem(ctx, repository.CreateOrderItemParams{
				OrderID:   orderID,
				ProductID: detail.Product.ID,
				Quantity:  detail.CartItem.Quantity.Int32,
				Price:     detail.CartItem.Subtotal,
			}); txErr != nil {
				return status.Errorf(codes.Internal, "failed to create order item: %v", txErr)
			}

			if txErr = q.UpdateProductStock(ctx, repository.UpdateProductStockParams{ID: detail.Product.ID, Quantity: detail.CartItem.Quantity.Int32}); txErr != nil {
				return status.Errorf(codes.Internal, "failed to update product stock: %v", txErr)
			}

			// 6. Delete the cart item that has been processed
			if txErr = q.DeleteCartItem(ctx, detail.CartItem.ID); txErr != nil {
				return status.Errorf(codes.Internal, "failed to delete cart item: %v", txErr)
			}
		}

		return nil
	})

	if err != nil {
		return nil, err // Return the error from the transaction
	}

	return &api.PlaceOrderResponse{
		OrderInfo: &api.OrderInfo{
			Id:          orderID,
			Items:       []*api.CartItem{},
			ShippingFee: 30000,
			TotalPrice:  totalAmount,
		},
	}, nil
}
