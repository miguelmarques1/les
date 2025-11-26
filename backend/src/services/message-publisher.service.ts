import { Channel, ChannelModel, connect } from 'amqplib';
import { TransactionMessage } from '../dto/rabbitmq.dto';

export interface MessagePublisherServiceInterface {
    publish(message: TransactionMessage): Promise<void>;
}

export class RabbitMQPublisherService implements MessagePublisherServiceInterface {
    private exchange: string = 'payment.events.exchange';
    private routingKey: string = 'payment.simulation.request';
    private connection: ChannelModel;
    private channel: Channel | null = null;
    constructor() { }

    async initialize(): Promise<void> {
        this.connection = await connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
    }

    async publish(message: TransactionMessage): Promise<void> {
        if (!this.channel) {
            await this.initialize();
        }

        const messageBuffer = Buffer.from(JSON.stringify(message));
        this.channel.publish(this.exchange, this.routingKey, messageBuffer, { persistent: true });
    }
}