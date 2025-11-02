package middleware

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc/status"
)

type ErrorResponse struct {
	Code    int32  `json:"code"`
	Message string `json:"message"`
	Details any    `json:"details,omitempty"`
}

func CustomHTTPError(_ context.Context, mux *runtime.ServeMux, marshaler runtime.Marshaler,
	w http.ResponseWriter, r *http.Request, err error) {

	st, ok := status.FromError(err)
	if !ok {
		// không phải lỗi gRPC
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(ErrorResponse{
			Code:    int32(http.StatusInternalServerError),
			Message: err.Error(),
		})
		return
	}

	// map code gRPC → HTTP
	httpStatus := runtime.HTTPStatusFromCode(st.Code())
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)

	_ = json.NewEncoder(w).Encode(ErrorResponse{
		Code:    int32(st.Code()),
		Message: st.Message(),
		Details: st.Details(), // có thể để nil hoặc custom parse
	})
}
