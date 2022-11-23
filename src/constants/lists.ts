// export const UNI_LIST = 'https://tokens.uniswap.org'
// export const UNI_EXTENDED_LIST = 'https://cloudflare-ipfs.com/ipfs/QmaQvV3pWKKaWJcHvSBuvQMrpckV3KKtGJ6p3HZjakwFtX'
// const AAVE_LIST = 'tokenlist.aave.eth'
// const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
// const CMC_ALL_LIST = 'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json'
// const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
// const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
// const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
// const KLEROS_LIST = 't2crtokens.eth'
// const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
// const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
// const WRAPPED_LIST = 'wrapped.tokensoft.eth'
export const DECONTRACTS_LIST = 'https://raw.githubusercontent.com/Decontract/token-list/main/tokens.json'
export const DECONTRACTS_GOERLI_LIST = 'https://raw.githubusercontent.com/Decontract/token-list/main/goerli.json'
export const DECONTRACTS_MUMBAI_LIST = 'https://raw.githubusercontent.com/Decontract/token-list/main/mumbai.json'

export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const CELO_LIST = 'https://celo-org.github.io/celo-token-list/celo.tokenlist.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
// const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [UNI_LIST, UNI_EXTENDED_LIST, DECONTRACTS_LIST]

export const DEFAULT_LIST_OF_LISTS: string[] = [DECONTRACTS_LIST]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [DECONTRACTS_LIST]
