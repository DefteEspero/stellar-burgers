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
  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <NavLink
              to='/'
              end
              className={() =>
                `text ${isConstructorActive ? styles.link_active : styles.link}`
              }
            >
              Конструктор
            </NavLink>
          </>

          <>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <NavLink
              to='/feed'
              className={() =>
                `text ${isFeedActive ? styles.link_active : styles.link}`
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
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <NavLink
            to='/profile'
            className={() =>
              `text ${isProfileActive ? styles.link_active : styles.link}`
            }
          >
            {userName || 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
