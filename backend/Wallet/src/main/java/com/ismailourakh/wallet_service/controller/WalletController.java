package com.ismailourakh.wallet_service.controller;

import com.ismailourakh.wallet_service.client.AuthServiceClient;
import com.ismailourakh.wallet_service.dto.TransactionDTO;
import com.ismailourakh.wallet_service.dto.WalletCreationRequest;
import com.ismailourakh.wallet_service.dto.WalletDTO;
import com.ismailourakh.wallet_service.exception.UnauthorizedException;
import com.ismailourakh.wallet_service.service.WalletService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    private final WalletService walletService;
    private final AuthServiceClient authServiceClient;

    public WalletController(WalletService walletService, AuthServiceClient authServiceClient) {
        this.walletService = walletService;
        this.authServiceClient = authServiceClient;
    }

    @PostMapping
    public ResponseEntity<String> createWallet(
            @RequestHeader("Authorization") String token,
            @RequestBody WalletCreationRequest request) {
        try {
            // Ensure token is properly formatted
            String formattedToken = token.startsWith("Bearer ") ? token : "Bearer " + token;

            WalletDTO wallet = walletService.createWallet(
                    request.getUserId(),
                    new BigDecimal(request.getInitialBalance()),
                    formattedToken
            );

            return ResponseEntity.ok("Wallet created successfully for user: " + request.getUserId());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create wallet: " + e.getMessage());
        }
    }

    @GetMapping("/current")
    public ResponseEntity<WalletDTO> getCurrentWallet(
            @RequestHeader("Authorization") String token,
            @RequestParam Long userId) {
        WalletDTO wallet = walletService.getWalletByUserId(userId, token);
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/recharge")
    public ResponseEntity<String> rechargeWallet(
            @RequestHeader("Authorization") String token,
            @RequestParam Long userId,
            @RequestParam BigDecimal amount) {
        String response = walletService.rechargeWallet(userId, amount, token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/debit")
    public ResponseEntity<String> debitWallet(
            @RequestHeader("Authorization") String token,
            @RequestParam Long userId,
            @RequestParam BigDecimal amount) {
        String response = walletService.debitWallet(userId, amount, token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferFunds(
            @RequestHeader("Authorization") String token,
            @RequestParam Long fromUserId,
            @RequestParam Long toUserId,
            @RequestParam BigDecimal amount) {
        String response = walletService.transferFunds(fromUserId, toUserId, amount, token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO>> getTransactions(
            @RequestHeader("Authorization") String token,
            @RequestParam Long userId) {
        List<TransactionDTO> transactions = walletService.getTransactions(userId, token);
        return ResponseEntity.ok(transactions);
    }
}