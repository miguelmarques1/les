package repository

import (
	"database/sql"
	"time"
)

type LogRepository struct {
	DB *sql.DB
}

func NewLogRepository(db *sql.DB) *LogRepository {
	return &LogRepository{DB: db}
}

func (r *LogRepository) SaveLog(transactionID string, status string, response string) error {
	query := "INSERT INTO payment_log (transaction_id, status, response, created_at) VALUES ($1, $2, $3, $4)"
	_, err := r.DB.Exec(query, transactionID, status, response, time.Now())
	return err
}

func (r *LogRepository) CountAttempts(transactionID string) (int, error) {
	var count int
	err := r.DB.QueryRow("SELECT COUNT(*) FROM payment_log WHERE transaction_id = $1", transactionID).Scan(&count)
	return count, err
}
