package com.ismailourakh.wallet_service.service;

import com.ismailourakh.wallet_service.model.Transaction;
import com.ismailourakh.wallet_service.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getTransactionsByWalletId(UUID walletId) {
        return transactionRepository.findByWalletId(walletId);
    }
}
