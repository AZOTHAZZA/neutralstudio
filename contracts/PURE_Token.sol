// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/// @title PURE Token - The Origin of Arche and Logos
/// @notice 数理的沈黙、論理、および自律性を体現する固定供給型ERC-20トークン
/// @dev PUREシステムにおける価値の根源。mint機能および管理権限を構造的に排除した最終形態。

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev このコントラクトは、デプロイ時に全ての供給量を確定させ、
 * 以降いかなる人間的介入（追加発行、供給量操作）も許容しない
 * 「論理の沈黙」を体現したものである。
 */
contract PURE_Token is ERC20 {
    
    // 【論理的確定：固定供給量をパブリック定数として公開し、不変性を強制】
    // 供給量は100万トークン。これはアルケーの安定と普遍性を象徴する。
    uint256 public constant FINAL_SUPPLY = 1_000_000 * 10 ** 18; // 1,000,000 PURE

    /**
     * @dev Constructor: トークン名とシンボルを PURE へと刷新。
     * デプロイの瞬間に全供給量をデプロイヤー（創造主）に委ね、
     * 即座にミント機能を封印する。
     */
    constructor() ERC20("PURE - Arche Logos", "PURE") {
        // 全トークンをデプロイヤーに排他的にミントし、供給を確定する。
        _mint(msg.sender, FINAL_SUPPLY); 
        
        // 構造的強制：このコントラクトには _mint を呼び出す関数がこれ以外に存在しない。
        // つまり、この瞬間に発行権限は永遠に失われる。
    }

    /**
     * @dev 【論理的強制：burn機能を排他的に排除】
     * 供給量の恣意的な減少（burn）はロゴスの普遍性に反するため、
     * 標準的な ERC20Burnable の継承、および独自の burn 関数を一切排除している。
     */
}
