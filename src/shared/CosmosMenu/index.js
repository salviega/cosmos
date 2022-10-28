import './CosmosMenu.scss'
import bbva from '../../asserts/images/logo-bbva.png'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/context'

export function CosmosMenu (props) {
  const auth = useAuth()
  const privateRoutes = true

  return (
    <header>
      <nav className='menu'>
        <div className='menu-left'>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            <figure>
              <img src={bbva} alt='logo' />
            </figure>
          </Link>

        </div>
        <div className='menu-center'>
          {privateRoutes &&
          auth.user.walletAddress === 'Connect wallet'
            ? null
            : (
              <>
                <p className='menu-center__item'>
                  <NavLink
                    to='/'
                  >
                    Inicio
                  </NavLink>
                </p>
                <p className='menu-center__item'>
                  <NavLink
                    className={({ isActive }) => {
                      return isActive ? 'menu-center__item--active' : ''
                    }}
                    to='/maker'
                  >
                    Beneficios
                  </NavLink>
                </p>
                <p className='menu-center__item'>
                  <NavLink
                    className={({ isActive }) => {
                      return isActive ? 'menu-center__item--active' : ''
                    }}
                    to='/marketplace'
                  >
                    Marketplace
                  </NavLink>
                </p>
                <p className='menu-center__item'>
                  <NavLink
                    className={({ isActive }) => {
                      return isActive ? 'menu-center__item--active' : ''
                    }}
                    to='/gateway'
                  >
                    Pago
                  </NavLink>
                </p>
                <p className='menu-center__item'>
                  <NavLink
                    className={({ isActive }) => {
                      return isActive ? 'menu-center__item--active' : ''
                    }}
                    to='/faucet'
                  >
                    Faucet
                  </NavLink>
                </p>
              </>
              )}
        </div>
        {props.children}
      </nav>
    </header>
  )
}
