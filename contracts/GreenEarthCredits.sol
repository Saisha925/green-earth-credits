// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GreenEarthCredits
 * @dev ERC20 token for the Green Earth Credits platform (carbon credits marketplace).
 * Initial supply is minted to the platform wallet; owner can mint additional supply.
 */
contract GreenEarthCredits is ERC20, Ownable {
    uint8 private constant _DECIMALS = 18;

    /// @param initialSupplyAmount Initial token supply (in wei, 18 decimals). e.g. 1_000_000 * 10**18
    /// @param platformWallet Address to receive the initial supply (e.g. 0xFA510493D1921407a9893d2f8E72cAF919B4e459)
    constructor(
        uint256 initialSupplyAmount,
        address platformWallet
    ) ERC20("Green Earth Credits", "GEC") Ownable(platformWallet) {
        require(platformWallet != address(0), "platform wallet is zero");
        _mint(platformWallet, initialSupplyAmount);
    }

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    /// @notice Mint new tokens (only owner / platform wallet)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
