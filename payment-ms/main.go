package main

import (
	"log"
	"payment-ms/db"
	consumer "payment-ms/rabbitmq"
	"payment-ms/repository"
	"payment-ms/service"
)

func main() {
	database, err := db.Connect()
	if err != nil {
		log.Fatal("Erro ao conectar no banco:", err)
	}
	defer database.Close()

	repo := repository.NewLogRepository(database)
	paymentService := service.NewPaymentService(repo)

	err = consumer.StartRabbitMQConsumer(paymentService)
	if err != nil {
		log.Fatal("Erro ao iniciar consumidor RabbitMQ:", err)
	}
}
