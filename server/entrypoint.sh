#!/bin/bash
set -e

# -------------------------------
# 1. Tạo cron job nếu RUN_CRON=true
# -------------------------------

cd /app 

echo "$CRON_SCHEDULE $CRON_COMMAND"

# Lấy giá trị từ env
CRON_SCHEDULE=${CRON_SCHEDULE:-"*/5 * * * *"}
CRON_COMMAND=${CRON_COMMAND:-"cron-task"}

# Ghi file cron cho root
echo "$CRON_SCHEDULE /app/main $CRON_COMMAND >> /proc/1/fd/1 2>&1" > /etc/crontabs/root
chmod 0644 /etc/crontabs/root

echo "[INFO] Cron job scheduled: $CRON_SCHEDULE → $CRON_COMMAND"

# Start cron daemon foreground
crond -f -l 2
