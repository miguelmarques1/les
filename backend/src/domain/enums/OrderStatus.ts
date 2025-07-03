export enum OrderStatus {
    PROCESSING = 'PROCESSING',   // EM PROCESSAMENTO
    APPROVED = 'APPROVED',       // APROVADO
    REJECTED = 'REJECTED',       // REPROVADO
    CANCELED = 'CANCELED',       // CANCELADO
    SHIPPED = 'SHIPPED',         // EM TRANSPORTE
    SHIPPING = "SHIPPING",       // Preparando para a entrega
    DELIVERED = 'DELIVERED'      // ENTREGUE
}