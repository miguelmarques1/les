package model

type Card struct {
	Number     string
	HolderName string
	CVV        string
	ExpiryDate string
}

type Transaction struct {
	ID     int
	Amount float64
	Card   Card
}
