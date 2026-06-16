package com.logistics.order_service.client;

import com.logistics.order_service.client.dto.ClientDetails;
import com.logistics.order_service.client.dto.UserDetails;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/users/{id}")
    UserDetails getUserById(@PathVariable("id") Long id);

    @GetMapping("/api/users/clients/{id}")
    ClientDetails getClientById(@PathVariable("id") Long id);

    @GetMapping("/api/users/email/{email}")
    UserDetails getUserByEmail(@PathVariable("email") String email);
}

