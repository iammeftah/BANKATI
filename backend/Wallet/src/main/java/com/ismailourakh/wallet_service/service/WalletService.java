package com.ismailourakh.wallet_service.service;

import com.ismailourakh.wallet_service.model.Transaction;
import com.ismailourakh.wallet_service.model.Wallet;
import com.ismailourakh.wallet_service.repository.TransactionRepository;
import com.ismailourakh.wallet_service.repository.WalletRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public WalletService(WalletRepository walletRepository, TransactionRepository transactionRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    public String rechargeWallet(UUID userId, BigDecimal amount) {
        Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);
        if (walletOpt.isEmpty()) {
            return "Wallet not found for the given user.";
        }

        Wallet wallet = walletOpt.get();
        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setWalletId(wallet.getId());
        transaction.setType("CREDIT");
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        return "Wallet recharged successfully.";
    }

    public String debitWallet(UUID userId, BigDecimal amount) {
        Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);
        if (walletOpt.isEmpty()) {
            return "Wallet not found for the given user.";
        }

        Wallet wallet = walletOpt.get();
        if (wallet.getBalance().compareTo(amount) < 0) {
            return "Insufficient funds in the wallet.";
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setWalletId(wallet.getId());
        transaction.setType("DEBIT");
        transaction.setAmount(amount.negate());
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        return "Wallet debited successfully.";
    }

    public String transferFunds(UUID fromWalletId, UUID toWalletId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return "Transaction amount must be greater than zero.";
        }

        Optional<Wallet> fromWalletOpt = walletRepository.findById(fromWalletId);
        Optional<Wallet> toWalletOpt = walletRepository.findById(toWalletId);

        if (fromWalletOpt.isEmpty() || toWalletOpt.isEmpty()) {
            return "One or both wallets do not exist.";
        }

        Wallet fromWallet = fromWalletOpt.get();
        Wallet toWallet = toWalletOpt.get();

        if (fromWallet.getBalance().compareTo(amount) < 0) {
            return "Insufficient funds in the sender's wallet.";
        }

        // Perform the transfer
        fromWallet.setBalance(fromWallet.getBalance().subtract(amount));
        toWallet.setBalance(toWallet.getBalance().add(amount));

        // Update wallets in the database
        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        // Record transactions
        Transaction debitTransaction = new Transaction();
        debitTransaction.setWalletId(fromWalletId);
        debitTransaction.setType("DEBIT");
        debitTransaction.setAmount(amount.negate());
        debitTransaction.setTimestamp(LocalDateTime.now());

        Transaction creditTransaction = new Transaction();
        creditTransaction.setWalletId(toWalletId);
        creditTransaction.setType("CREDIT");
        creditTransaction.setAmount(amount);
        creditTransaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(debitTransaction);
        transactionRepository.save(creditTransaction);

        return "Transfer successful.";
    }
}
