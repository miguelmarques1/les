CREATE TABLE IF NOT EXISTS payment_log (
    id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL,
    status payment_status NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);