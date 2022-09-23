import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { TokensVariant, useTokensFlag } from 'featureFlags/flags/tokens'
import { darken } from 'polished'
import { NavLink, useLocation } from 'react-router-dom'
import { useDarkModeManager } from 'state/user/hooks'
import styled, { useTheme } from 'styled-components/macro'

import { ReactComponent as Logo } from '../../assets/svg/logo.svg'
import ClaimModal from '../claim/ClaimModal'
import Row from '../Row'
import HolidayOrnament from './HolidayOrnament'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 21;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.deprecated_bg0} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.deprecated_bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

const HeaderLinks = styled(Row)`
  justify-self: center;
  background-color: ${({ theme }) => theme.deprecated_bg0};
  width: max-content;
  padding: 2px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
  align-items: center;
  z-index: 100;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    z-index: 99;
    position: fixed;
    bottom: 0; right: 50%;
    transform: translate(50%,-50%);
    margin: 0 auto;
    background-color: ${({ theme }) => theme.deprecated_bg0};
    border: 1px solid ${({ theme }) => theme.deprecated_bg2};
    box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }

  position: relative;
`

// can't be customized under react-router-dom v6
// so we have to persist to the default one, i.e., .active
const activeClassName = 'active'

const StyledNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.deprecated_text2};
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;
  &.${activeClassName} {
    border-radius: 14px;
    font-weight: 600;
    justify-content: center;
    color: ${({ theme }) => theme.deprecated_text1};
    background-color: ${({ theme }) => theme.deprecated_bg1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.deprecated_text1)};
  }
`

export default function Header() {
  const tokensFlag = useTokensFlag()

  const [darkMode] = useDarkModeManager()
  const { deprecated_white, deprecated_black } = useTheme()

  const scrollY = useScrollPosition()

  const { pathname } = useLocation()

  // work around https://github.com/remix-run/react-router/issues/8161
  // as we can't pass function `({isActive}) => ''` to className with styled-components
  const isPoolActive =
    pathname.startsWith('/pool') ||
    pathname.startsWith('/add') ||
    pathname.startsWith('/remove') ||
    pathname.startsWith('/increase') ||
    pathname.startsWith('/find')

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <ClaimModal />
      <Title href=".">
        <UniIcon>
          <Logo fill={darkMode ? deprecated_white : deprecated_black} width="24px" height="100%" title="logo" />
          <HolidayOrnament />
        </UniIcon>
      </Title>
      <HeaderLinks>
        <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
          <Trans>Swap</Trans>
        </StyledNavLink>
        {tokensFlag === TokensVariant.Enabled && (
          <StyledNavLink id={`tokens-nav-link`} to={'/tokens'}>
            <Trans>Tokens</Trans>
          </StyledNavLink>
        )}
        <StyledNavLink
          data-cy="pool-nav-link"
          id={`pool-nav-link`}
          to={'/pool'}
          className={isPoolActive ? activeClassName : undefined}
        >
          <Trans>Pool</Trans>
        </StyledNavLink>
      </HeaderLinks>

      <HeaderControls></HeaderControls>
    </HeaderFrame>
  )
}
