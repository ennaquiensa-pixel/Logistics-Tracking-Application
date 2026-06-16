package com.logistics.delivery_service.controller;

import com.logistics.delivery_service.dtos.requestDTOs.AssignDriverRequest;
import com.logistics.delivery_service.dtos.requestDTOs.LivraisonRequest;
import com.logistics.delivery_service.dtos.requestDTOs.UpdateLivraisonStatusRequest;
import com.logistics.delivery_service.dtos.responseDTOs.LivraisonResponse;
import com.logistics.delivery_service.dtos.responseDTOs.RecentActivityDTO;
import com.logistics.delivery_service.dtos.responseDTOs.WeeklyPerformanceDTO;
import com.logistics.delivery_service.enums.EtatLivraison;
import com.logistics.delivery_service.repository.LivraisonRepository;
import com.logistics.delivery_service.service.LivraisonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class LivraisonController {

    private final LivraisonService livraisonService;
    private final LivraisonRepository livraisonRepository ;

    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<LivraisonResponse> createLivraison(@Valid @RequestBody LivraisonRequest request) {
        LivraisonResponse response = livraisonService.createLivraison(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivraisonResponse> getLivraisonById(@PathVariable Long id) {
        LivraisonResponse response = livraisonService.getLivraisonById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("order/{orderId}")
    public ResponseEntity<Long>  getLivraisonByOrderId(@PathVariable Long orderId) {
        Long livraisonId = livraisonService.getLivraisonByOrderId(orderId);
        return ResponseEntity.ok(livraisonId);
    }
//    @GetMapping
////    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
//    public ResponseEntity<List<LivraisonResponse>> getAllLivraisons() {
//        List<LivraisonResponse> livraisons = livraisonService.getAllLivraisons();
//        return ResponseEntity.ok(livraisons);
//    }

@GetMapping
public ResponseEntity<Page<LivraisonResponse>> getAllLivraisons(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(livraisonService.getAllLivraisons(pageable));
}


    @GetMapping("/number")
//    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Long> getHowManyLivraison() {
        long count = livraisonRepository.countLivraisons();
        return ResponseEntity.ok(count) ;
    }



    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<LivraisonResponse>> getLivraisonsByClient(@PathVariable Long clientId) {
        List<LivraisonResponse> livraisons = livraisonService.getLivraisonsByClient(clientId);
        return ResponseEntity.ok(livraisons);
    }

    @GetMapping("/driver/{livreurId}")
    public ResponseEntity<List<LivraisonResponse>> getLivraisonsByDriver(@PathVariable Long livreurId) {
        List<LivraisonResponse> livraisons = livraisonService.getLivraisonsByLivreur(livreurId);
        return ResponseEntity.ok(livraisons);
    }

    @GetMapping("/status/{status}")
//    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<LivraisonResponse>> getLivraisonsByStatus(@PathVariable EtatLivraison status) {
        List<LivraisonResponse> livraisons = livraisonService.getLivraisonsByStatus(status);
        return ResponseEntity.ok(livraisons);
    }

    @GetMapping("/active")
//    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<LivraisonResponse>> getActiveLivraisons() {
        List<LivraisonResponse> livraisons = livraisonService.getActiveLivraisons();
        return ResponseEntity.ok(livraisons);
    }

    @PostMapping("/assign")
//    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<LivraisonResponse> assignDriver(@Valid @RequestBody AssignDriverRequest request) {
        LivraisonResponse response = livraisonService.assignDriver(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
//    @PreAuthorize("@deliverySecurity.canUpdateDeliveryStatus(#id)")
    public ResponseEntity<LivraisonResponse> updateStatus(@PathVariable Long id,
                                                          @Valid @RequestBody UpdateLivraisonStatusRequest request) {
        LivraisonResponse response = livraisonService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("@deliverySecurity.canCancelDelivery(#id)")
    public ResponseEntity<Void> cancelLivraison(@PathVariable Long id, @RequestParam String reason) {
        livraisonService.cancelLivraison(id, reason);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/weekly-performance")
    public ResponseEntity<List<WeeklyPerformanceDTO>> getWeeklyDeliveryPerformance() {
        List<WeeklyPerformanceDTO> performanceData = livraisonService.getWeeklyDeliveryPerformance();
        return ResponseEntity.ok(performanceData);
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<List<RecentActivityDTO>> getRecentActivities() {
        return ResponseEntity.ok(livraisonService.getRecentActivities());
    }


}