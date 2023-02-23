import { Connector } from '@web3-react/types'
import { URI_AVAILABLE } from '@web3-react/walletconnect'
import { Connection, networkConnection, walletConnectConnection } from 'connection'
import { getConnection } from 'connection/utils'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { updateSelectedWallet } from 'state/user/reducer'

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

  const selectedWallet = useAppSelector((state) => state.user.selectedWallet)

  let selectedConnection: Connection | undefined
  if (selectedWallet) {
    try {
      selectedConnection = getConnection(selectedWallet)
    } catch {
      dispatch(updateSelectedWallet({ wallet: undefined }))
    }
  } else {
    walletConnectConnection.connector.activate()
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
        if (event.data?.data?.name === 'disconnect' && localStorage.getItem('walletconnect')) {
          localStorage.removeItem('walletconnect')
          await walletConnectConnection.connector.deactivate()
        }
      }
    }
    window.addEventListener('message', messageListener)
    return () => {
      window.removeEventListener('message', messageListener)
    }
  }, [dispatch])

  useEffect(() => {
    connect(networkConnection.connector)

    if (selectedConnection) {
      connect(selectedConnection.connector)
    } // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
