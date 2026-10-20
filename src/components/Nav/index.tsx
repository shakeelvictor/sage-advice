import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sunrise, Compass, Heart, Wind, BookOpen, Sun, Moon, Monitor } from 'lucide-react';
import { Mark } from '../Logo';
import { useTheme } from '../../context/ThemeContext';
import { springSnappy } from '../../styles/motion';

const items = [
  { to: '/', label: 'Today', Icon: Sunrise },
  { to: '/paths', label: 'Paths', Icon: Compass },
  { to: '/loved', label: 'Loved', Icon: Heart },
  { to: '/meditate', label: 'Still', Icon: Wind },
  { to: '/about', label: 'About', Icon: BookOpen },
];

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
  border-right: 1px solid ${({ theme }) => theme.colors.line};
  background: color-mix(in srgb, ${({ theme }) => theme.colors.ground} 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 50;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const RailList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
  flex: 1;
`;

const Bar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--nav-h) + env(safe-area-inset-bottom, 0px));
  padding: 0 max(8px, env(safe-area-inset-left, 0px)) env(safe-area-inset-bottom, 0px) max(8px, env(safe-area-inset-right, 0px));
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  background: color-mix(in srgb, ${({ theme }) => theme.colors.surface} 86%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 50;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const BarList = styled.ul`
  list-style: none;
  display: flex;
  width: 100%;
`;

const BarItem = styled.li`
  flex: 1;
  min-width: 0;
`;

const Item = styled(NavLink)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  min-height: 56px;
  padding: 0.5rem 0.25rem;
  border-radius: var(--radius-m);
  color: ${({ theme }) => theme.colors.ink3};
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.25s ease;

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 1.6;
    position: relative;
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }

  &.active {
    color: ${({ theme }) => theme.colors.amber};
  }
`;

const ActivePill = styled(motion.span)`
  position: absolute;
  inset: 6px 10px;
  border-radius: var(--radius-m);
  background: color-mix(in srgb, ${({ theme }) => theme.colors.amber} 14%, transparent);
  z-index: 0;
`;

const ThemeButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.ink2};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surface};
  transition: color 0.25s ease, transform 0.25s var(--ease-out);

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.6;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.amber};
    transform: translateY(-1px);
  }
`;

const FloatingTheme = styled(ThemeButton)`
  position: fixed;
  top: calc(0.75rem + env(safe-area-inset-top, 0px));
  right: max(0.75rem, env(safe-area-inset-right, 0px));
  z-index: 50;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MarkLink = styled(NavLink)`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.colors.amber};
`;

const order = ['dark', 'light', 'system'] as const;
const themeIcon = { light: Sun, dark: Moon, system: Monitor };
const themeLabel = { light: 'Light theme', dark: 'Dark theme', system: 'Follow system theme' };

const useThemeCycle = () => {
  const { theme, setTheme } = useTheme();
  const Icon = themeIcon[theme];
  const cycle = () => setTheme(order[(order.indexOf(theme) + 1) % order.length]);
  return { Icon, cycle, label: themeLabel[theme] };
};

const Links = ({ layoutId }: { layoutId: string }) => {
  const { pathname } = useLocation();
  return (
    <>
      {items.map(({ to, label, Icon }) => (
        <li key={to} style={{ position: 'relative' }}>
          <Item to={to} end={to === '/'}>
            {(pathname === to || (to !== '/' && pathname.startsWith(to + '/'))) && <ActivePill layoutId={layoutId} transition={springSnappy} />}
            <Icon aria-hidden />
            <span>{label}</span>
          </Item>
        </li>
      ))}
    </>
  );
};

const Nav = () => {
  const { Icon, cycle, label } = useThemeCycle();

  return (
    <>
      <Rail aria-label="Primary">
        <MarkLink to="/" aria-label="Sage Advice, today">
          <Mark size={30} />
        </MarkLink>
        <RailList>
          <Links layoutId="rail-pill" />
        </RailList>
        <ThemeButton onClick={cycle} aria-label={label} title={label}>
          <Icon aria-hidden />
        </ThemeButton>
      </Rail>

      <Bar aria-label="Primary">
        <BarList>
          {items.map(({ to, label: text, Icon: ItemIcon }) => (
            <BarItem key={to}>
              <Item to={to} end={to === '/'}>
                <ItemIcon aria-hidden />
                <span>{text}</span>
              </Item>
            </BarItem>
          ))}
        </BarList>
      </Bar>

      <FloatingTheme onClick={cycle} aria-label={label} title={label}>
        <Icon aria-hidden />
      </FloatingTheme>
    </>
  );
};

export default Nav;
