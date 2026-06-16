package com.logistics.order_service.service.impl;

import com.logistics.order_service.client.DeliveryServiceClient;
import com.logistics.order_service.client.NotificationServiceClient;
import com.logistics.order_service.client.UserServiceClient;
import com.logistics.order_service.client.WarehouseServiceClient;
import com.logistics.order_service.client.dto.*;
import com.logistics.order_service.dto.request.CreateOrderItemRequest;
import com.logistics.order_service.dto.request.CreateOrderRequest;
import com.logistics.order_service.dto.request.UpdateOrderStatusRequest;
import com.logistics.order_service.dto.request.UpdatePaymentStatusRequest;
import com.logistics.order_service.dto.response.OrderItemResponse;
import com.logistics.order_service.dto.response.OrderResponse;
import com.logistics.order_service.enums.OrderStatus;
import com.logistics.order_service.enums.PaymentStatus;
import com.logistics.order_service.exception.ExternalServiceException;
import com.logistics.order_service.exception.OrderNotFoundException;
import com.logistics.order_service.exception.OrderValidationException;
import com.logistics.order_service.model.Order;
import com.logistics.order_service.model.OrderItem;
import com.logistics.order_service.repository.OrderRepository;
import com.logistics.order_service.service.OrderService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserServiceClient userServiceClient;
    private final WarehouseServiceClient warehouseServiceClient;
    private final DeliveryServiceClient deliveryServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    //CREATE AN ORDER (POST)
    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {
        log.info("Creating order for user {}", request.getUserId());

        ClientDetails client = fetchClient(request.getUserId());
        validateClient(client);
        var warehouse = fetchWarehouse(request.getWarehouseId());
        AdresseDTO warehouseAddress = warehouse.adresse() != null
                ? warehouse.adresse()
                : fetchWarehouseAddress(request.getWarehouseId());

        Order order = mapToEntity(request);
        order = orderRepository.save(order);
        System.out.println("Saved order ID: " + order.getId());
        orderRepository.flush();

        log.info("✅ Order created with ID: {}", order.getId());

        // Create delivery first
        log.info("🔄 Creating delivery for order ID: {}", order.getId());
        triggerDeliveryCreation(order, request, client, warehouseAddress);

        // Fetch and set delivery ID using the new Feign client method
        log.info("🔄 Fetching delivery ID for order ID: {}", order.getId());
        fetchAndSetDeliveryId(order);

        // Then assign driver automatically
        log.info("🔄 Assigning driver automatically");
        assignLivreurAutomatically(order);

        log.info("🔄 Sending notification");
        sendOrderNotification(order, client);

        Order finalOrder = orderRepository.findById(order.getId()).orElse(order);
        log.info("✅ Order creation completed. Delivery ID: {}", finalOrder.getDeliveryId());

        return mapToResponse(finalOrder);
    }

    /**
     * Fetches the delivery ID from delivery service and updates the order
     */
    private void fetchAndSetDeliveryId(Order order) {
        try {
            log.info("🔍 Fetching delivery ID for order ID: {}", order.getId());
            Long deliveryId = deliveryServiceClient.getLivraisonByOrderId(order.getId());
            log.info("🔍 Received delivery ID: {} for order: {}", deliveryId, order.getId());

            if (deliveryId != null) {
                order.setDeliveryId(deliveryId);
                Order savedOrder = orderRepository.save(order); // Save the updated order with delivery ID
                log.info("✅ Successfully set delivery ID: {} for order: {}", deliveryId, order.getId());
                log.info("✅ Saved order delivery ID: {}", savedOrder.getDeliveryId());
            } else {
                log.warn("⚠️ No delivery ID found for order: {}", order.getId());
            }
        } catch (FeignException.NotFound ex) {
            log.warn("⚠️ No delivery found for order ID: {}", order.getId());
        } catch (FeignException ex) {
            log.error("❌ FeignException fetching delivery ID for order {}: Status: {}, Message: {}",
                    order.getId(), ex.status(), ex.contentUTF8());
        } catch (Exception ex) {
            log.error("❌ Unexpected error fetching delivery ID for order {}: {}", order.getId(), ex.getMessage(), ex);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));

        order.setStatus(request.getStatus());
        if (request.getDeliveryId() != null) {
            order.setDeliveryId(request.getDeliveryId());
        }
        order.setUpdatedAt(LocalDateTime.now());

        if (request.getStatus() == OrderStatus.DISPATCHED || request.getStatus() == OrderStatus.DELIVERED) {
            notifyStatusChange(order, request.getStatus(), request.getReason());
        }

        return mapToResponse(order);
    }

    @Override
    public OrderResponse updatePaymentStatus(Long id, UpdatePaymentStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));

        order.setPaymentStatus(request.getPaymentStatus());
        order.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(order);
    }

    @Override
    public BigDecimal getTotalGain() {
        BigDecimal gain = orderRepository.getTotalGain();
        return gain != null ? gain : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal getGainBetween(LocalDateTime start, LocalDateTime end) {
        BigDecimal gain = orderRepository.getGainBetween(start, end);
        return gain != null ? gain : BigDecimal.ZERO;
    }

    private Order mapToEntity(CreateOrderRequest request) {
        Order order = new Order();
        order.setReference(generateReference());
        order.setUserId(request.getUserId());
        order.setWarehouseId(request.getWarehouseId());
        order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        order.setNotes(request.getNotes());
        order.setCurrency(request.getCurrency());
        order.setShippingCost(request.getShippingCost());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CreateOrderItemRequest itemRequest : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setSku(itemRequest.getSku());
            item.setDescription(itemRequest.getDescription());
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(itemRequest.getUnitPrice());
            BigDecimal total = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            item.setTotalPrice(total);
            item.setWeightKg(itemRequest.getWeightKg() != null ? itemRequest.getWeightKg() : 1.0);
            order.addItem(item);
            subtotal = subtotal.add(total);
        }

        order.setSubtotal(subtotal);
        order.setTotalAmount(subtotal.add(request.getShippingCost()));
        return order;
    }

    private void triggerDeliveryCreation(Order order,
                                         CreateOrderRequest request,
                                         ClientDetails client,
                                         AdresseDTO warehouseAddress) {

        AdresseDetails destination = selectDestinationAddress(client);
        System.out.println("Selected destination address: " + destination);
        //elected destination address: AdresseDetails[idAdresse=17, rue=RR321,
        // ville=Sidi Rahal Chatai, codePostal=26175, pays=Morocco,
        // latitude=33.46706260018338, longitude=-7.944511612956246, estPrincipale=true]
        if (destination == null) {
            log.warn("No destination address found for client {}. Delivery will not be pre-created.", client.idUser());
            return;
        }

        AdresseDTO destinationDto = new AdresseDTO(
                destination.rue(),
                destination.ville(),
                destination.codePostal(),
                destination.pays(),
                destination.latitude(),
                destination.longitude()
        );
        System.out.println("Destination DTO: " + destinationDto);

        List<ColisPayload> colis = order.getItems().stream()
                .map(item -> new ColisPayload(
                        item.getId(),
                        item.getWeightKg() != null && item.getWeightKg() > 0 ? item.getWeightKg() : 1.0,
                        item.getDescription(),
                        null
                ))
                .collect(Collectors.toList());

        if (colis.isEmpty()) {
            log.warn("Order {} has no items. Skipping delivery creation.", order.getId());
            return;
        }

        AdresseDTO origin = warehouseAddress ;

        CreateDeliveryRequest deliveryRequest = new CreateDeliveryRequest(
                order.getId(),
                order.getUserId(),
                destinationDto,
                origin,
                TypeLivraison.STANDARD,
                colis,
                request.getExpectedDeliveryDate() != null ? request.getExpectedDeliveryDate().atStartOfDay() : null,
                request.getNotes()
        );

        try {
            DeliveryServiceClient.DeliveryResponse response = deliveryServiceClient.createLivraison(deliveryRequest);
            System.out.println("======>Delivery creation response: " + response);
            if (response != null && response.idLivraison() != null) {
                order.setDeliveryId(response.idLivraison());
                log.info("Delivery created with ID: {} for order: {}", response.idLivraison(), order.getId());
            }
        } catch (FeignException ex) {
            log.error("Failed to trigger delivery creation for order {}", order.getReference(), ex);
            throw new ExternalServiceException("Failed to create delivery for order: " + order.getReference(), ex);
        }
    }

    private void assignLivreurAutomatically(Order order) {
        if (order.getDeliveryId() == null) {
            log.warn("No delivery ID available for order {}, skipping automatic driver assignment", order.getReference());
            return;
        }

        try {
            // Create assign request with null livreurId for automatic assignment
            AssignLivreurRequest assignRequest = new AssignLivreurRequest();
            assignRequest.setLivraisonId(order.getDeliveryId());
            assignRequest.setLivreurId(null); // null triggers automatic assignment

            log.info("Attempting automatic driver assignment for delivery {}", order.getDeliveryId());
            DeliveryServiceClient.DeliveryResponse response = deliveryServiceClient.assignDriver(assignRequest);

            if (response != null && response.livreurId() != null) {
                log.info("Successfully assigned driver {} to delivery {}", response.livreurId(), order.getDeliveryId());

                // Update order status if needed
                if (order.getStatus() == OrderStatus.PENDING) {
                    order.setStatus(OrderStatus.CONFIRMED);
                    order.setUpdatedAt(LocalDateTime.now());
                    orderRepository.save(order);
                }
            } else {
                log.warn("Driver assignment completed but no driver ID returned for delivery {}", order.getDeliveryId());
            }

        } catch (FeignException ex) {
            log.error("Failed to automatically assign driver to delivery {} for order {}",
                    order.getDeliveryId(), order.getReference(), ex);
            // Don't throw exception - order creation should not fail due to driver assignment
        }
    }

    private void sendOrderNotification(Order order, ClientDetails client) {
        NotificationRequest request = NotificationRequest.builder()
                .userId(order.getUserId())
                .type(TypeNotification.EMAIL)
                .categorie(CategorieNotification.COMMANDE)
                .subject("Confirmation de commande " + order.getReference())
                .message("Votre commande a été enregistrée avec succès.")
                .templateName("order-confirmation.html")
                .templateData(Map.of(
                        "orderReference", order.getReference(),
                        "customerName", client.nom(),
                        "totalAmount", order.getTotalAmount(),
                        "currency", order.getCurrency()
                ))
                .referenceExterne(order.getReference())
                .priorite(1)
                .build();

        try {
            notificationServiceClient.sendNotification(request);
        } catch (FeignException ex) {
            log.error("Failed to send order notification for order {}", order.getReference(), ex);
        }
    }

    private void notifyStatusChange(Order order, OrderStatus status, String reason) {
        NotificationRequest request = NotificationRequest.builder()
                .userId(order.getUserId())
                .type(com.logistics.order_service.client.dto.TypeNotification.EMAIL)
                .categorie(CategorieNotification.LIVRAISON)
                .subject("Mise à jour de votre commande " + order.getReference())
                .message("Le statut de votre commande est désormais : " + status)
                .templateName(status == OrderStatus.DELIVERED ? "delivery-completed.html" : "delivery-assigned.html")
                .templateData(Map.of(
                        "orderReference", order.getReference(),
                        "status", status.name(),
                        "reason", reason == null ? "" : reason
                ))
                .referenceExterne(order.getReference())
                .priorite(2)
                .build();

        try {
            notificationServiceClient.sendNotification(request);
        } catch (FeignException ex) {
            log.error("Failed to send status notification for order {}", order.getReference(), ex);
        }
    }

    private ClientDetails fetchClient(Long userId) {
        try {
            ClientDetails response = userServiceClient.getClientById(userId);
            System.out.println("Fetched client: " + response);
            return response ;
        } catch (FeignException.NotFound ex) {
            throw new OrderValidationException("Client not found with id: " + userId);
        } catch (FeignException ex) {
            throw new ExternalServiceException("Unable to contact user-service", ex);
        }
    }

    private WarehouseDetails fetchWarehouse(Long warehouseId) {
        try {
            return warehouseServiceClient.getEntrepotById(warehouseId);
        } catch (FeignException.NotFound ex) {
            throw new OrderValidationException("Warehouse not found with id: " + warehouseId);
        } catch (FeignException ex) {
            throw new ExternalServiceException("Unable to contact warehouse-service", ex);
        }
    }

    private AdresseDTO fetchWarehouseAddress(Long warehouseId) {
        try {
            return warehouseServiceClient.getWarehouseAddress(warehouseId);
        } catch (FeignException ex) {
            log.warn("Unable to fetch address for warehouse {}", warehouseId, ex);
            return null;
        }
    }

    private void assignLivreurIfNeeded(AssignLivreurRequest assignLivreurRequest) {
        if (assignLivreurRequest.getLivreurId() != null) {
            try {
                deliveryServiceClient.assignDriver(assignLivreurRequest);
            } catch (FeignException ex) {
                log.error("Failed to assign driver {} to delivery {}", assignLivreurRequest.getLivreurId(), assignLivreurRequest.getLivraisonId(), ex);
            }
        }
    }

    private void validateClient(ClientDetails client) {
        if (client == null || Boolean.FALSE.equals(client.active())) {
            throw new OrderValidationException("Client account is inactive. Cannot create order.");
        }
    }

    private AdresseDetails selectDestinationAddress(ClientDetails client) {
        if (client == null || client.adresses() == null || client.adresses().isEmpty()) {
            log.warn("Client or client addresses are null/empty for clientId={}", client != null ? client.idUser() : null);
            return null;
        }

        // Try to find main address
        AdresseDetails main = client.adresses().stream()
                .filter(adresse -> Boolean.TRUE.equals(adresse.estPrincipale()))
                .findFirst()
                .orElse(null);

        if (main != null) return main;

        // Otherwise return first address
        return client.adresses().get(0);
    }


    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .sku(item.getSku())
                        .description(item.getDescription())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .weightKg(item.getWeightKg())
                        .stockMovementId(item.getStockMovementId())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .reference(order.getReference())
                .userId(order.getUserId())
                .warehouseId(order.getWarehouseId())
                .deliveryId(order.getDeliveryId())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .notes(order.getNotes())
                .currency(order.getCurrency())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(items)
                .build();
    }

    private String generateReference() {
        String reference;
        do {
            reference = "ORD-" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 10).toUpperCase();
        } while (orderRepository.findByReference(reference).isPresent());
        return reference;
    }
}