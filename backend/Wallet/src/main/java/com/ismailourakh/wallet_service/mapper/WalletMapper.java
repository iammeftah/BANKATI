package com.ismailourakh.wallet_service.mapper;

import com.ismailourakh.wallet_service.dto.WalletDTO;
import com.ismailourakh.wallet_service.model.Wallet;
import org.springframework.stereotype.Component;

@Component
public class WalletMapper {
    public WalletDTO toDTO(Wallet wallet) {
        WalletDTO dto = new WalletDTO();
        dto.setId(wallet.getId());
        dto.setUserId(wallet.getUserId());
        dto.setBalance(wallet.getBalance());
        dto.setCreatedAt(wallet.getCreatedAt());
        dto.setUpdatedAt(wallet.getUpdatedAt());
        return dto;
    }
}