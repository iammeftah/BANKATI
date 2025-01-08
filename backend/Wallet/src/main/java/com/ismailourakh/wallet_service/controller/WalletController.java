package com.ismailourakh.wallet_service.controller;

import com.ismailourakh.wallet_service.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/recharge")
    public ResponseEntity<String> rechargeWallet(@RequestParam UUID userId, @RequestParam BigDecimal amount) {
        String response = walletService.rechargeWallet(userId, amount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/debit")
    public ResponseEntity<String> debitWallet(@RequestParam UUID userId, @RequestParam BigDecimal amount) {
        String response = walletService.debitWallet(userId, amount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferFunds(@RequestParam UUID fromWalletId,
                                                @RequestParam UUID toWalletId,
                                                @RequestParam BigDecimal amount) {
        String response = walletService.transferFunds(fromWalletId, toWalletId, amount);
        return ResponseEntity.ok(response);
    }
}
