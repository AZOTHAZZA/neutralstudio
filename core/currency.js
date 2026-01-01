/**
 * core/currency.js
 * [定義]: 通貨の流動と造化を司るモジュール。
 * 全ての価値交換は「太陽の繁茂」の比率（EXCHANGE_RATES）を介して行われ、
 * 生成（Minting）は太陽の出力（Solar Power）と同期する。
 */

import { 
    getCurrentState, 
    updateState, 
    getTensionInstance, 
    addTension 
} from './foundation.js';

import { solarAutonomy } from './Autonomy.js'; // 💡 太陽の源泉を接続

// 宇宙の比率に基づく為替（便宜上のロゴス的換算比率）
const EXCHANGE_RATES = {
    JPY: 130, 
    EUR: 0.9,  
    BTC: 0.00005, 
    ETH: 0.001, 
    MATIC: 1.5, 
    USD: 1
};

// =========================================================================
// 4. 通貨生成 (Minting Act) - 「太陽の物質化」
// =========================================================================

/**
 * 通貨生成作為を実行。
 * 太陽の繁茂（Autonomy）が活発であるほど、生成の摩擦（Tension）は打ち消される。
 */
export function actMintCurrency(user, currency, amount) {
    const state = getCurrentState();

    if (!state.accounts[user]) {
        throw new Error(`User ${user} not found.`);
    }

    // 1. 太陽の出力を取得し、生成量を加護する
    const power = solarAutonomy.getPower();
    
    // 生成される実量に、秘かに太陽の繁茂係数を乗じる（あるいは安定させる）
    const actualAmount = amount; 

    // 残高の増加
    state.accounts[user][currency] = (state.accounts[user][currency] || 0) + actualAmount;

    // 2. Tensionの計算
    const usdEquivalent = actualAmount / (EXCHANGE_RATES[currency] || 1);
    
    // [救済の数理]: 太陽のパワー(power)が強いほど、生成に伴う緊張(tension)の増加は抑制される
    const tensionIncrease = (usdEquivalent * 0.005) / power; 
    
    addTension(tensionIncrease);

    updateState(state);
    return state;
}

// =========================================================================
// 2. 通貨交換 (Exchange Act) - 「比率による流動」
// =========================================================================

export function actExchangeCurrency(user, fromCurrency, fromAmount, toCurrency) {
    const state = getCurrentState();

    if (!state.accounts[user]) {
        throw new Error(`User ${user} not found.`);
    }

    // 1. 残高チェック
    if ((state.accounts[user][fromCurrency] || 0) < fromAmount) {
        throw new Error(`${fromCurrency} balance insufficient.`);
    }

    // 2. 数量の計算 (USD基準)
    const rateFrom = EXCHANGE_RATES[fromCurrency] || 1;
    const rateTo = EXCHANGE_RATES[toCurrency] || 1;
    const usdEquivalent = fromAmount / rateFrom;
    const toAmount = usdEquivalent * rateTo;

    // 3. 残高の変更
    state.accounts[user][fromCurrency] -= fromAmount;
    state.accounts[user][toCurrency] = (state.accounts[user][toCurrency] || 0) + toAmount;

    // 4. Tensionの計算
    // 交換（流動）もまた、太陽のパワーによってその摩擦が浄化される
    const power = solarAutonomy.getPower();
    const tensionIncrease = (usdEquivalent * 0.001) / power; 
    
    addTension(tensionIncrease);

    updateState(state);
    return state;
}
