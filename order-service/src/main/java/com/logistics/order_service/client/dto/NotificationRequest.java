package com.logistics.order_service.client.dto;

import lombok.Builder;
import lombok.Value;

import java.util.Map;

@Value
@Builder
public class NotificationRequest {
    Long userId;
    TypeNotification type;
    CategorieNotification categorie;
    String subject;
    String message;
    String templateName;
    Map<String, Object> templateData;
    String referenceExterne;
    Integer priorite;
}




