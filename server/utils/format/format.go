package format

import (
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func ToNumeric(val float64) pgtype.Numeric {
	var num pgtype.Numeric
	_ = num.Scan(strconv.FormatFloat(val, 'f', -1, 64)) // convert float64 -> pgtype.Numeric
	return num
}

func NumericToFloat64(n pgtype.Numeric) float64 {
	f, _ := n.Float64Value()
	if !f.Valid {
		return 0
	}
	return f.Float64
}

func Int32(val *int32) pgtype.Int4 {
	if val == nil {
		return pgtype.Int4{Valid: false}
	}
	return pgtype.Int4{
		Int32: *val,
		Valid: true,
	}
}

func Int64(val *int64) pgtype.Int8 {
	if val == nil {
		return pgtype.Int8{Valid: false}
	}
	return pgtype.Int8{
		Int64: *val,
		Valid: true,
	}
}

func Int(val *int) pgtype.Int4 {
	if val == nil {
		return pgtype.Int4{Valid: false}
	}
	return pgtype.Int4{
		Int32: int32(*val),
		Valid: true,
	}
}

func Int8(val *int64) pgtype.Int8 {
	if val == nil {
		return pgtype.Int8{Valid: false}
	}
	return pgtype.Int8{
		Int64: *val,
		Valid: true,
	}
}

func ToPgTimestamp(ts *timestamppb.Timestamp) pgtype.Timestamp {
	if ts == nil {
		return pgtype.Timestamp{Valid: false}
	}
	return pgtype.Timestamp{Time: ts.AsTime(), Valid: true}
}

func PgToPbTimestamp(pgTs pgtype.Timestamp) *timestamppb.Timestamp {
	if !pgTs.Valid {
		return nil
	}
	return timestamppb.New(pgTs.Time)
}

func PgTextToString(pgT pgtype.Text) string {
	if pgT.Valid {
		return pgT.String
	}
	return ""
}

func StringPointerToPgText(s *string) pgtype.Text {
	if s == nil {
		return pgtype.Text{Valid: false}
	}
	return pgtype.Text{String: *s, Valid: true}
}

func StringToPgText(s string) pgtype.Text {
	return pgtype.Text{String: s, Valid: true}
}

func PgTextToStringPointer(pgT pgtype.Text) *string {
	if pgT.Valid {
		return &pgT.String
	}
	return nil
}

func PgDateToString(pgD pgtype.Date) string {
	if pgD.Valid {
		return pgD.Time.Format("2006-01-02")
	}
	return ""
}

func PgDateToStringPointer(pgD pgtype.Date) *string {
	if pgD.Valid {
		res := pgD.Time.Format("2006-01-02")
		return &res
	}
	return nil
}

func StringDateToPgDate(dateStr string) pgtype.Date {
	date, err := time.Parse(consts.DATE_STRING_LAYOUT, dateStr)
	if err != nil {
		return pgtype.Date{Valid: false}
	}
	return pgtype.Date{Time: date, Valid: true}
}

func PbTimestampToTime(ts *timestamppb.Timestamp) time.Time {
	if ts == nil {
		return time.Time{}
	}
	return ts.AsTime()
}

func TimeToPgTimestamp(t time.Time) pgtype.Timestamp {
	return pgtype.Timestamp{Time: t, Valid: true}
}

func PbWrapString2String(pbStr *wrapperspb.StringValue) *string {
	if pbStr == nil {
		return nil
	}
	return &pbStr.Value
}

func PbWrapInt642Int64(pbInt *wrapperspb.Int64Value) *int64 {
	if pbInt == nil {
		return nil
	}
	return &pbInt.Value
}

func PbWrapInt322Int32(pbInt *wrapperspb.Int32Value) *int32 {
	if pbInt == nil {
		return nil
	}
	return &pbInt.Value
}

func PbWrapString2PgText(pbStr *wrapperspb.StringValue) pgtype.Text {
	if pbStr == nil {
		return pgtype.Text{Valid: false}
	}
	return pgtype.Text{String: pbStr.Value, Valid: true}
}

func PbWrapInt642PgInt8(pbInt *wrapperspb.Int64Value) pgtype.Int8 {
	if pbInt == nil {
		return pgtype.Int8{Valid: false}
	}
	return pgtype.Int8{Int64: pbInt.Value, Valid: true}
}

func PbWrapInt322PgInt4(pbInt *wrapperspb.Int32Value) pgtype.Int4 {
	if pbInt == nil {
		return pgtype.Int4{Valid: false}
	}
	return pgtype.Int4{Int32: pbInt.Value, Valid: true}
}
