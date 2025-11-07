package service

// load profile info page
// response
// - user info

// load user order page
// response
// - history orders

// query
// name: GetOrderHistoryByUserID :many
// - group by user_id
// - user_id = $1
// - limit, offset
// - order by 