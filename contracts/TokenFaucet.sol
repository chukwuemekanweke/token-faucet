// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "./libraries/SafeERC20.sol";
import "./interfaces/IERC20.sol";

contract TokenFaucet is ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    mapping(address => bool) private _activatedAssets;
    address[] assets;

  
    event AssetAdded(address indexed token);

    function getAssetInfo(address asset) external view returns (string, string, uint256, uint256)
    {
        IERC20 token = IERC20(asset);
        uint256 totalSupply = token.totalSupply();
        uint256 decimals = token.decimals();
        string name = token.name();
        string symbol = token.symbol();
        return (name, symbol, decimals, totalSupply);
    }

    function addAsset(address asset) external onlyOwner
    {

        IERC20 token = IERC20(asset);

        
        require(!activatedAssets[asset],"Asset already added");

        address tokenOwner = token.getOwner();
        require (_msgSender()==tokenOwner, "Can only add assets you own");

        (bool success, bytes memory result) = token.delegatecall(abi.encodeWithSignature(token.transferOwnership.selector,  _msgSender()));
        require(success,"Asset ownerhsip could not be transferred");

        uint256 ownerBalance = token.balanceOf(_msgSender());

        (bool success2, bytes memory returndata) = token.delegatecall(abi.encodeWithSignature(token.transfer.selector,  _msgSender(), address(this), ownerBalance));
        require(success2,"Asset transfer failed");

         if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }

        activatedAssets[asset] = true;
        assets.push(asset);
    }

    function disburseTokens(uint256 amount, address asset) external nonReentrant
    {
        IERC20 token = IERC20(asset);
        uint256 balance = token.balanceOf(address(this));

        if(balance < amount){
          token.mint(amount);
        }

        token.safeTransfer(_msgSender(),amount);
    }

}
