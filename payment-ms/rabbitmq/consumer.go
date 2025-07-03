package consumer

import (
	"encoding/json"
	"errors"
	"log"
	"os"
	"payment-ms/model"
	"payment-ms/service"

	"github.com/streadway/amqp"
)

func StartRabbitMQConsumer(paymentService *service.PaymentService) error {
	conn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		return err
	}
	defer conn.Close()
	log.Println("Conectado ao RabbitMQ")

	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"payment_simulation", true, false, false, false, nil,
	)
	if err != nil {
		return err
	}

	msgs, err := ch.Consume(
		q.Name, "", false, false, false, false, nil,
	)
	if err != nil {
		return err
	}

	go func() {
		for d := range msgs {
			var transaction model.Transaction
			err := json.Unmarshal(d.Body, &transaction)
			if err != nil {
				log.Println("Erro ao parsear mensagem:", err)
				d.Nack(false, false)
				continue
			}

			log.Printf("Recebida tentativa de pagamento ID %d no valor de %.2f\n", transaction.ID, transaction.Amount)

			err = paymentService.Handle(transaction)

			if err != nil {
				if errors.Is(err, service.ErrMaxAttemptsReached) {
					log.Println("Máximo de tentativa de pagamento efetuadas")
					d.Ack(false)
					continue
				}

				log.Println("Erro durante processamento", err)
				d.Nack(false, true)
				continue
			}

			d.Ack(false)
		}
	}()

	log.Println("Aguardando mensagens de pagamento...")
	select {}
}
