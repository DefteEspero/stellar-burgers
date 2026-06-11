import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={'primary'} />
            <NavLink
              to='/'
              end
              className={({ isActive }) =>
                `text ${
                  isActive || pathname.startsWith('/ingredients')
                    ? styles.link_active
                    : styles.link
                }`
              }
            >
              Конструктор
            </NavLink>
          </>
          <>
            <ListIcon type={'primary'} />
            <NavLink
              to='/feed'
              className={({ isActive }) =>
                `text ${isActive ? styles.link_active : styles.link}`
              }
            >
              Лента заказов
            </NavLink>
          </>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon type={'primary'} />
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `text ${isActive ? styles.link_active : styles.link}`
            }
          >
            {userName || 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
