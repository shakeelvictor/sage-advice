import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sunrise, Compass, Sprout, Wind, BookOpen, Sun, Moon, Monitor } from 'lucide-react';
import { Mark } from '../Logo';
import { VisuallyHidden } from '../ui';
import { useTheme, themeLabel } from '../../context/theme';
import { springSnappy } from '../../styles/motion';

const items = [
  { to: '/', label: 'Today', Icon: Sunrise },
  { to: '/paths', label: 'Paths', Icon: Compass },
  { to: '/garden', label: 'Garden', Icon: Sprout },
  { to: '/meditate', label: 'Still', Icon: Wind },
  { to: '/about', label: 'About', Icon: BookOpen },
];

const isActive = (pathname: string, to: string) => pathname === to || (to !== '/' && pathname.startsWith(to + '/'));

/* ---------- Phones: a floating pill of five icons ---------- */

const Bar = styled.nav`
  position: fixed;
  left: max(24px, env(safe-area-inset-left, 0px));
  right: max(24px, env(safe-area-inset-right, 0px));
  bottom: max(16px, env(safe-area-inset-bottom, 0px));
  margin: 0 auto;
  max-width: 360px;
  padding: 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.float};
  z-index: 50;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const BarList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-between;
`;

const BarItem = styled(NavLink)`
  position: relative;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.ink2};
  transition: color 0.25s ease;

  svg {
    position: relative;
    z-index: 1;
    width: 22px;
    height: 22px;
    stroke-width: 1.8;
  }

  /* Mint against white is faint, so the active icon also gets ink and a heavier stroke. */
  &.active {
    color: ${({ theme }) => theme.colors.onMint};

    svg {
      stroke-width: 2.2;
    }
  }
`;

const BarPill = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.mint};
`;

/* ---------- Tablet and desktop: a labelled rail ---------- */

const Rail = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--rail-w);
  padding: 1.5rem 0.6rem calc(1.25rem + env(safe-area-inset-bottom, 0px));
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  z-index: 50;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const RailList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  flex: 1;
`;

const RailItem = styled(NavLink)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 64px;
  padding: 0.5rem 0.25rem;
  border-radius: var(--radius-m);
  color: ${({ theme }) => theme.colors.ink2};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: color 0.25s ease;

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 1.8;
  }

  svg,
  span {
    position: relative;
    z-index: 1;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }

  &.active {
    color: ${({ theme }) => theme.colors.onMint};
    font-weight: 700;
  }
`;

const RailPill = styled(motion.span)`
  position: absolute;
  inset: 4px 6px;
  border-radius: var(--radius-m);
  background: ${({ theme }) => theme.colors.mint};
`;

const MarkLink = styled(NavLink)`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.colors.forest};
`;

const ThemeButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.ink2};
  background: ${({ theme }) => theme.colors.surface2};
  transition: color 0.25s ease;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.8;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const themeOrder = ['light', 'dark', 'system'] as const;
const themeIcon = { light: Sun, dark: Moon, system: Monitor };

const Nav = () => {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const ThemeIcon = themeIcon[theme];
  const next = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
  const themeTitle = `Theme: ${themeLabel[theme]}. Switch to ${themeLabel[next].toLowerCase()}.`;

  return (
    <>
      <Rail aria-label="Primary">
        <MarkLink to="/" aria-label="Sage Advice, today">
          <Mark size={30} />
        </MarkLink>
        <RailList>
          {items.map(({ to, label, Icon }) => (
            <li key={to}>
              <RailItem to={to} end={to === '/'}>
                {isActive(pathname, to) && <RailPill layoutId="rail-pill" transition={springSnappy} />}
                <Icon aria-hidden />
                <span>{label}</span>
              </RailItem>
            </li>
          ))}
        </RailList>
        <ThemeButton onClick={() => setTheme(next)} aria-label={themeTitle} title={themeTitle}>
          <ThemeIcon aria-hidden />
        </ThemeButton>
      </Rail>

      <Bar aria-label="Primary">
        <BarList>
          {items.map(({ to, label, Icon }) => (
            <li key={to}>
              <BarItem to={to} end={to === '/'} aria-label={label}>
                {isActive(pathname, to) && <BarPill layoutId="bar-pill" transition={springSnappy} />}
                <Icon aria-hidden />
                <VisuallyHidden>{label}</VisuallyHidden>
              </BarItem>
            </li>
          ))}
        </BarList>
      </Bar>
    </>
  );
};

export default Nav;
