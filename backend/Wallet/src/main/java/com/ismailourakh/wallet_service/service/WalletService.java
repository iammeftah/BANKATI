package com.ismailourakh.wallet_service.service;

import com.ismailourakh.wallet_service.client.AuthServiceClient;
import com.ismailourakh.wallet_service.dto.WalletDTO;
import com.ismailourakh.wallet_service.dto.TransactionDTO;
import com.ismailourakh.wallet_service.exception.UnauthorizedException;
import com.ismailourakh.wallet_service.exception.ResourceNotFoundException;
import com.ismailourakh.wallet_service.mapper.WalletMapper;
import com.ismailourakh.wallet_service.model.Transaction;
import com.ismailourakh.wallet_service.model.Wallet;
import com.ismailourakh.wallet_service.repository.TransactionRepository;
import com.ismailourakh.wallet_service.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final AuthServiceClient authServiceClient;
    private final WalletMapper walletMapper;

    public WalletService(WalletRepository walletRepository,
                         TransactionRepository transactionRepository,
                         AuthServiceClient authServiceClient,
                         WalletMapper walletMapper) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.authServiceClient = authServiceClient;
        this.walletMapper = walletMapper;
    }

    @Transactional
    public WalletDTO createWallet(Long userId, BigDecimal initialBalance, String token) {
        System.out.println("=== WalletService: Creating Wallet ===");
        System.out.println("UserId: " + userId);
        System.out.println("InitialBalance: " + initialBalance);

        // Ensure token is in correct format
        String formattedToken = token.startsWith("Bearer ") ? token : "Bearer " + token;

        // Validate token with retries
        boolean isValid = authServiceClient.validateToken(formattedToken, userId.toString());
        if (!isValid) {
            throw new UnauthorizedException("Token validation failed for user: " + userId);
        }

        // Check for existing wallet
        Optional<Wallet> existingWallet = walletRepository.findByUserId(userId);
        if (existingWallet.isPresent()) {
            throw new IllegalStateException("Wallet already exists for user: " + userId);
        }

        try {
            Wallet wallet = new Wallet();
            wallet.setUserId(userId);
            wallet.setBalance(initialBalance);
            wallet.setCreatedAt(LocalDateTime.now());
            wallet.setUpdatedAt(LocalDateTime.now());

            Wallet savedWallet = walletRepository.save(wallet);

            // Create initial transaction
            if (initialBalance.compareTo(BigDecimal.ZERO) > 0) {
                createTransaction(savedWallet.getId(), initialBalance, "INITIAL_DEPOSIT");
            }

            return walletMapper.toDTO(savedWallet);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create wallet: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public WalletDTO getWalletByUserId(Long userId, String token) {
        validateUserAccess(userId, token);
        return walletRepository.findByUserId(userId)
                .map(walletMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
    }

    @Transactional
    public String rechargeWallet(Long userId, BigDecimal amount, String token) {
        validateUserAccess(userId, token);

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        createTransaction(wallet.getId(), amount, "CREDIT");

        return "Wallet recharged successfully";
    }

    @Transactional
    public String debitWallet(Long userId, BigDecimal amount, String token) {
        validateUserAccess(userId, token);

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalStateException("Insufficient funds");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        createTransaction(wallet.getId(), amount.negate(), "DEBIT");

        return "Wallet debited successfully";
    }

    @Transactional
    public String transferFunds(Long fromUserId, Long toUserId, BigDecimal amount, String token) {
        validateUserAccess(fromUserId, token);

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be greater than zero");
        }

        Wallet fromWallet = walletRepository.findByUserId(fromUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Source wallet not found"));

        Wallet toWallet = walletRepository.findByUserId(toUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));

        if (fromWallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalStateException("Insufficient funds for transfer");
        }

        // Perform transfer
        fromWallet.setBalance(fromWallet.getBalance().subtract(amount));
        toWallet.setBalance(toWallet.getBalance().add(amount));

        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        // Record transactions
        createTransaction(fromWallet.getId(), amount.negate(), "TRANSFER_OUT");
        createTransaction(toWallet.getId(), amount, "TRANSFER_IN");

        return "Transfer completed successfully";
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getTransactions(Long userId, String token) {
        validateUserAccess(userId, token);

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        return transactionRepository.findByWalletId(wallet.getId()).stream()
                .map(this::mapTransactionToDTO)
                .collect(Collectors.toList());
    }

    private void validateUserAccess(Long userId, String token) {
        // Add debug logging
        System.out.println("Validating access for userId: " + userId);
        System.out.println("Token: " + token);

        if (!authServiceClient.validateToken(token, userId.toString())) {
            throw new UnauthorizedException("Invalid user access for user: " + userId);
        }
    }

    private void createTransaction(Long walletId, BigDecimal amount, String type) {
        Transaction transaction = new Transaction();
        transaction.setWalletId(walletId);
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);
    }

    private TransactionDTO mapTransactionToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setWalletId(transaction.getWalletId());
        dto.setAmount(transaction.getAmount());
        dto.setType(transaction.getType());
        dto.setTimestamp(transaction.getTimestamp());
        return dto;
    }
}