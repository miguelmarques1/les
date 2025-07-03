package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"payment-ms/auth"
	"payment-ms/model"
	"payment-ms/repository"
)

type PaymentService struct {
	Repo *repository.LogRepository
}

func NewPaymentService(repo *repository.LogRepository) *PaymentService {
	return &PaymentService{Repo: repo}
}

func (p *PaymentService) Handle(transaction model.Transaction) error {
	attempts, err := p.Repo.CountAttempts(fmt.Sprintf("%d", transaction.ID))
	if err != nil {
		return fmt.Errorf("erro ao contar tentativas: %w", err)
	}

	success := rand.Float64() < 0.7
	status := "DENIED"
	response := "Erro na simulação de pagamento"

	if success {
		status = "APPROVED"
		response = "Transação aprovada"
		p.Notify(transaction.ID, status, response)
	}

	err = p.Repo.SaveLog(fmt.Sprintf("%d", transaction.ID), status, response)
	if err != nil {
		return fmt.Errorf("erro ao salvar log: %w", err)
	}

	if !success && attempts+1 >= 3 {
		log.Println("Máximo de tentativas atingido. Enviando rejeição final.")
		p.Notify(transaction.ID, status, response)
		return ErrMaxAttemptsReached
	}

	if !success {
		return fmt.Errorf("falha simulada na tentativa %d", attempts+1)
	}

	return nil
}

func (p *PaymentService) Notify(transactionID int, status string, message string) {
	body := map[string]interface{}{
		"transaction_id": transactionID,
		"status":         status,
		"message":        message,
	}
	jsonData, _ := json.Marshal(body)

	token, err := auth.GenerateInternalJWT()
	if err != nil {
		log.Println("Erro ao gerar token JWT:", err)
		return
	}

	req, err := http.NewRequest(
		"PUT",
		os.Getenv("BACKEND_URL")+"/transaction",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		log.Println("Erro ao criar requisição HTTP:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Erro ao notificar backend:", err)
		return
	}
	defer resp.Body.Close()

	log.Println("Notificação enviada ao backend. Status HTTP:", resp.StatusCode)
}
