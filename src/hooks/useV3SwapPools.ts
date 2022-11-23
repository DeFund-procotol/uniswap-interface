import { Currency, Token } from '@uniswap/sdk-core'
import { FeeAmount, Pool } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useSingleContractMultipleData } from 'lib/hooks/multicall'
import { useMemo } from 'react'

import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { useFundManagerContract } from './useContract'
import { PoolState, usePools } from './usePools'

/**
 * Returns all the existing pools that should be considered for swapping between an input currency and an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export function useV3SwapPools(
  currencyIn?: Currency,
  currencyOut?: Currency
): {
  pools: Pool[]
  loading: boolean
} {
  const { chainId } = useWeb3React()

  const allCurrencyCombinations = useAllCurrencyCombinations(currencyIn, currencyOut)

  const allCurrencyCombinationsWithAllFees: [Token, Token, FeeAmount][] = useMemo(
    () =>
      allCurrencyCombinations.reduce<[Token, Token, FeeAmount][]>((list, [tokenA, tokenB]) => {
        return chainId === SupportedChainId.MAINNET
          ? list.concat([
              [tokenA, tokenB, FeeAmount.LOW],
              [tokenA, tokenB, FeeAmount.MEDIUM],
              [tokenA, tokenB, FeeAmount.HIGH],
            ])
          : list.concat([
              [tokenA, tokenB, FeeAmount.LOWEST],
              [tokenA, tokenB, FeeAmount.LOW],
              [tokenA, tokenB, FeeAmount.MEDIUM],
              [tokenA, tokenB, FeeAmount.HIGH],
            ])
      }, []),
    [allCurrencyCombinations, chainId]
  )

  // Filter allowed pools
  const poolParams: [string, string, FeeAmount][] = useMemo(
    () => allCurrencyCombinationsWithAllFees.map((item) => [item[0].address, item[1].address, item[2]]),
    [allCurrencyCombinationsWithAllFees]
  )
  const filter = useFundManagerContract()
  const allAllowed = useSingleContractMultipleData(filter, 'isPoolParamsAllowed', poolParams)

  const allowedCurrencyCombinationsWithAllFees = useMemo(
    () =>
      allCurrencyCombinationsWithAllFees.filter((_, index) => {
        if (!allAllowed[index]) return false
        const { result: allowed, loading: allowedLoading, valid: allowedValid } = allAllowed[index]
        if (!allowedValid || allowedLoading) return false
        return allowed && allowed[0]
      }),
    [allCurrencyCombinationsWithAllFees, allAllowed]
  )
  const pools = usePools(allowedCurrencyCombinationsWithAllFees)

  return useMemo(() => {
    return {
      pools: pools
        .filter((tuple): tuple is [PoolState.EXISTS, Pool] => {
          return tuple[0] === PoolState.EXISTS && tuple[1] !== null
        })
        .map(([, pool]) => pool),
      loading: pools.some(([state]) => state === PoolState.LOADING),
    }
  }, [pools])
}
