import useScrollPosition from '@react-hook/window-scroll'
import { useDarkModeManager } from 'state/user/hooks'
import styled, { useTheme } from 'styled-components/macro'

import { ReactComponent as Logo } from '../../assets/svg/logo.svg'
import ClaimModal from '../claim/ClaimModal'
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

export default function Header() {
  const [darkMode] = useDarkModeManager()
  const { deprecated_white, deprecated_black } = useTheme()

  const scrollY = useScrollPosition()
  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <ClaimModal />
      <Title href=".">
        <UniIcon>
          <Logo fill={darkMode ? deprecated_white : deprecated_black} width="24px" height="100%" title="logo" />
          <HolidayOrnament />
        </UniIcon>
      </Title>

      <HeaderControls></HeaderControls>
    </HeaderFrame>
  )
}
