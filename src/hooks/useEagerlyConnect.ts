import { Connector } from '@web3-react/types'
import { URI_AVAILABLE } from '@web3-react/walletconnect'
import { Connection, networkConnection, walletConnectConnection } from 'connection'
import { getConnection } from 'connection/utils'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { updateSelectedWallet } from 'state/user/reducer'

import { parsedQueryString } from './useParsedQueryString'

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function useEagerlyConnect() {
  const dispatch = useAppDispatch()
  const chainId = Number(parsedQueryString().chainId || '1')
  const selectedWallet = useAppSelector((state) => state.user.selectedWallet)

  let selectedConnection: Connection | undefined
  if (selectedWallet) {
    try {
      selectedConnection = getConnection(selectedWallet)
    } catch {
      dispatch(updateSelectedWallet({ wallet: undefined }))
    }
  }

  useEffect(() => {
    const uriHandler = (uri: string) => {
      window.parent.postMessage(
        {
          target: 'uniswap-interface',
          data: {
            name: 'walletconnect-uri',
            data: { uri },
          },
        },
        '*'
      )
    }
    walletConnectConnection.connector.events.on(URI_AVAILABLE, uriHandler)
    return () => {
      walletConnectConnection.connector.events.off(URI_AVAILABLE, uriHandler)
    }
  }, [])

  useEffect(() => {
    async function messageListener(event: any) {
      if (event.data?.target === 'decontracts' || event.data?.target === 'defund') {
        if (event.data?.data?.name === 'connect') {
          const remoteKey = event.data.data.data.key
          const localKey = JSON.parse(localStorage.getItem('walletconnect') || '{}').key
          if (localKey && remoteKey !== localKey) {
            console.debug('reconnect', remoteKey, localKey)
            localStorage.removeItem('walletconnect')
          }
        }
      }
    }
    window.addEventListener('message', messageListener)
    return () => {
      window.removeEventListener('message', messageListener)
    }
  }, [dispatch, chainId])

  useEffect(() => {
    connect(networkConnection.connector)

    if (selectedConnection) {
      connect(selectedConnection.connector)
    } else {
      walletConnectConnection.connector.activate(chainId)
    } // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
