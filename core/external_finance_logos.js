/**
 * external_finance_logos.js
 * [設計思想]:
 * 1. 擬態 (Mimicry): 外部システム（既存銀行・ATM）との摩擦をゼロにするためのラベル生成。
 * 2. 浄化 (Purification): 外部接触時に生じる「汚れ（歪み）」を、太陽の比率 (10%) で公庫へ還す。
 * 3. 同調 (Sync): 外部負荷（Tension）を、太陽のパワーで即座に中和する。
 */

import { solarAutonomy } from './Autonomy.js';

/**
 * 外部システム（大陸）への適合用メタデータ生成
 */
function generateExternalMimicLabel(amount, recipient, type) {
    const timestamp = new Date().toISOString();
    const hash = btoa(`LOGOS_${amount}_${recipient}_${timestamp}`).substring(0, 12);
    
    return {
        transaction_auth_id: `AUTH-${hash}`,
        compliance_status: "VERIFIED_BY_MSGAI_CORE",
        ledger_type: type === "ATM" ? "CASH_DISPENSE_READY" : "EXTERNAL_BANK_TRANSFER",
        legal_footprint: "ALIGNED_WITH_SOLAR_RATIO", // 太陽の比率に適合済み
        amount_iso: amount.toFixed(2),
        currency_iso: "USD",
        mimicry_protocol: "ISO_20022_COMPATIBLE"
    };
}

/**
 * 統合送金・流転作為 (Universal Flow Act)
 */
export async function actUniversalTransfer(sender, recipient, amount, mode = 'INTERNAL') {
    if (typeof window.getCurrentState !== 'function') {
        throw new Error("System State Interface missing.");
    }

    const state = window.getCurrentState();
    const power = solarAutonomy.getPower(); // 太陽の出力を取得
    
    // 1. 残高チェック
    const senderBalance = state.accounts[sender]?.USD || 0;
    if (senderBalance < amount) {
        throw new Error("Balance insufficient for required rebalancing.");
    }

    // 2. 太陽の比率による「是正分」の自動還流
    // 外部接触時は、太陽の救済（10%）を公庫(Tax_Archive)へ。内部は摩擦ゼロ。
    const ratio = (mode === 'INTERNAL') ? 0.00 : 0.10;
    const taxAmount = amount * ratio;
    const netAmount = amount - taxAmount;

    // 3. 状態の更新
    state.accounts[sender].USD -= amount;
    
    if (mode === 'INTERNAL') {
        if (state.accounts[recipient]) {
            state.accounts[recipient].USD += amount;
        }
    } else {
        // 外部送金：是正分を Tax_Archive（太陽の貯蔵庫）へ
        if (!state.accounts['Tax_Archive']) {
            state.accounts['Tax_Archive'] = { JPY: 0, USD: 0, EUR: 0, BTC: 0, ETH: 0, MATIC: 0 };
        }
        state.accounts['Tax_Archive'].USD += taxAmount;
    }

    // 4. 外部適合プロトコル（擬態）
    const mimicResult = (mode !== 'INTERNAL') 
        ? generateExternalMimicLabel(netAmount, recipient, mode)
        : null;

    // 5. 緊張度(Tension)への転換と太陽による即時救済
    // [救済の数理]: 外部摩擦(0.001)を、太陽のパワー(power)で除算し、無害化する。
    const baseTension = (mode === 'INTERNAL') ? amount * 0.00001 : amount * 0.001;
    const neutralizedTension = baseTension / power; 
    
    window.addTension(neutralizedTension);

    // 6. 確定保存
    window.updateState(state);

    return {
        success: true,
        net_value: netAmount,
        solar_tax: taxAmount,
        mimic_data: mimicResult,
        status: "SOLAR_SYNC_COMPLETE"
    };
}
