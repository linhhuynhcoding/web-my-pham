package time

import (
	"time"

	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
)

func LatestDayToBetweenDate(days int) (*time.Time, *time.Time) {
	now := time.Now()
	startDate := now.AddDate(consts.ZERO, consts.ZERO, -days)
	return &startDate, &now
}
