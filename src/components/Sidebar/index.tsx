import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Heart, Info, Menu, X, ChevronLeft, ChevronRight, Timer, Sun, Moon, Monitor } from 'lucide-react';
import SidebarLogo from '../Logo/SidebarLogo';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '../../context/ThemeContext';

const SidebarContainer = styled.nav<{ $collapsed: boolean }>`
  background: ${({ theme }) => theme.colors.background.secondary};
  width: ${({ $collapsed }) => ($collapsed ? '60px' : '250px')};
  padding: ${({ $collapsed }) => ($collapsed ? '2rem 0.5rem' : '2rem')};
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid ${({ theme }) => theme.colors.text.primary}22;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 60px;
    padding: 2rem 0.5rem;
    transform: translateX(-60px);

    &[data-visible="true"] {
      transform: translateX(0);
    }
  }
`;

const MenuButton = styled.button`
  position: fixed;
  top: 1rem;
  left: 0.6rem;
  z-index: 100;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  transition: transform 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  flex: 1;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const ThemeItem = styled.div`
  margin-bottom: 0.5rem;
`;

const LinkText = styled(motion.span)<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  white-space: nowrap;
`;

const StyledNavLink = styled(NavLink)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0.75rem;
  border-radius: 0.5rem;
  justify-content: center;
  font-size: 0.9375rem;
  overflow: hidden;
  background: transparent;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    min-width: 1.25rem;
    stroke-width: 1.5;
  }

  &:hover, &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  }
`;

const ThemeButton = styled.button<{ $active?: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.75rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  border: none;
  border-radius: 0.5rem;
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.text.primary};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 0.9375rem;
  text-align: center;
  justify-content: center;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.background.primary};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    min-width: 1.25rem;
    stroke-width: 1.5;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    text-align: left;
    justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  }
`;

const LogoWrapper = styled.div<{ $collapsed: boolean }>`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    position: fixed;
    top: -30rem;
    margin: 0;
    z-index: 99;
    opacity: 0;
    transform: translateX(-60px);
    transition: opacity 0.3s ease, transform 0.3s ease;

    ${({ $collapsed }) => $collapsed && `
      opacity: 1;
      transform: translateX(0);
    `}
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const ThemeControls = styled.div`
  margin-top: auto;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.text.primary}22;
  margin: 0.5rem 0;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsCollapsed(true);
    setIsOpen(false);
  }, [location.pathname, setIsCollapsed]);

  return (
    <>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </MenuButton>

      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <SidebarContainer data-visible={isOpen} $collapsed={isCollapsed}>
        <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </ToggleButton>

        <LogoWrapper $collapsed={isCollapsed}>
          <SidebarLogo showText={!isCollapsed} />
        </LogoWrapper>

        <NavList>
          <NavItem>
            <StyledNavLink to="/" $collapsed={isCollapsed}>
              <Home />
              <LinkText
                $collapsed={isCollapsed}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                Home
              </LinkText>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/loved" $collapsed={isCollapsed}>
              <Heart />
              <LinkText
                $collapsed={isCollapsed}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                Loved
              </LinkText>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/meditate" $collapsed={isCollapsed}>
              <Timer />
              <LinkText
                $collapsed={isCollapsed}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                Meditate
              </LinkText>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/about" $collapsed={isCollapsed}>
              <Info />
              <LinkText
                $collapsed={isCollapsed}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                About
              </LinkText>
            </StyledNavLink>
          </NavItem>
        </NavList>

        <ThemeControls>
          <Divider />
          <ThemeItem>
            <ThemeButton
              onClick={() => setTheme('light')}
              $active={theme === 'light'}
              $collapsed={isCollapsed}
            >
              <Sun />
              <LinkText
                $collapsed={isCollapsed}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                Light
              </LinkText>
            </ThemeButton>
          </ThemeItem>
          <ThemeItem>
            <ThemeButton
              onClick={() => setTheme('dark')}
              $active={theme === 'dark'}
              $collapsed={isCollapsed}
            >
              <Moon />
              <LinkText
                $collapsed={isCollapsed}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                Dark
              </LinkText>
            </ThemeButton>
          </ThemeItem>
          <ThemeItem>
            <ThemeButton
              onClick={() => setTheme('system')}
              $active={theme === 'system'}
              $collapsed={isCollapsed}
            >
              <Monitor />
              <LinkText
                $collapsed={isCollapsed}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                System
              </LinkText>
            </ThemeButton>
          </ThemeItem>
        </ThemeControls>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;