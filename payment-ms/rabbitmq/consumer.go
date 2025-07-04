package consumer

import (
	"encoding/json"
	"errors"
	"log"
	"os"
	"payment-ms/model"
	"payment-ms/service"
	"time"

	"github.com/streadway/amqp"
)

func connectRabbitMQ(url string, retries int, delay time.Duration) (*amqp.Connection, error) {
	for i := 0; i < retries; i++ {
		conn, err := amqp.Dial(url)
		if err == nil {
			log.Println("Conectado ao RabbitMQ com sucesso!")
			return conn, nil
		}
		log.Printf("Falha ao conectar ao RabbitMQ (tentativa %d/%d): %v. Tentando novamente em %v...", i+1, retries, err, delay)
		time.Sleep(delay)
	}
	return nil, errors.New("não foi possível conectar ao RabbitMQ após várias tentativas")
}

func SetupRabbitMQInfrastructure(ch *amqp.Channel) error {
	exchangeName := "payment.events.exchange"
	exchangeType := "direct"

	err := ch.ExchangeDeclare(
		exchangeName,
		exchangeType,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return errors.New("falha ao declarar a Exchange: " + err.Error())
	}
	log.Printf("Exchange '%s' do tipo '%s' declarada com sucesso.", exchangeName, exchangeType)

	queueName := "payment_simulation"
	q, err := ch.QueueDeclare(
		queueName, true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return errors.New("falha ao declarar a fila '" + queueName + "': " + err.Error())
	}
	log.Printf("Fila '%s' declarada com sucesso. Mensagens: %d, Consumidores: %d", q.Name, q.Consumers)

	routingKey := "payment.simulation.request"
	err = ch.QueueBind(
		q.Name,
		routingKey,
		exchangeName,
		false,
		nil,
	)
	if err != nil {
		return errors.New("falha ao criar o binding entre fila '" + q.Name + "' e exchange '" + exchangeName + "': " + err.Error())
	}
	log.Printf("Binding criado: Fila '%s' -> Exchange '%s' com Routing Key '%s'.", q.Name, exchangeName, routingKey)

	return nil
}

func StartRabbitMQConsumer(paymentService *service.PaymentService) error {
	conn, err := connectRabbitMQ(os.Getenv("RABBITMQ_URL"), 5, 5*time.Second)
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	err = SetupRabbitMQInfrastructure(ch)
	if err != nil {
		return errors.New("falha ao configurar a infraestrutura RabbitMQ: " + err.Error())
	}

	queueName := "payment_simulation"
	msgs, err := ch.Consume(
		queueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return errors.New("falha ao registrar consumidor: " + err.Error())
	}

	go func() {
		for d := range msgs {
			var transaction model.Transaction
			err := json.Unmarshal(d.Body, &transaction)
			if err != nil {
				log.Printf("Erro ao parsear mensagem '%s': %v\n", d.Body, err)
				d.Nack(false, false)
				continue
			}

			log.Printf("Recebida tentativa de pagamento ID %d no valor de %.2f\n", transaction.ID, transaction.Amount)

			err = paymentService.Handle(transaction)

			if err != nil {
				if errors.Is(err, service.ErrMaxAttemptsReached) {
					log.Println("Máximo de tentativas de pagamento efetuadas para o ID", transaction.ID)
					d.Ack(false)
					continue
				}

				log.Printf("Erro durante processamento do pagamento ID %d: %v\n", transaction.ID, err)
				d.Nack(false, true)
				continue
			}

			d.Ack(false)
		}
	}()

	log.Printf("Aguardando mensagens de pagamento na fila '%s'...", queueName)
	select {}
}
