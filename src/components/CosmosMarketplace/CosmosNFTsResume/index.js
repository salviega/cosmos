import './CosmosNFTsResume.scss'
import logo from './../../../assets/images/logo-cosmos.png'
import React from 'react'

export function CosmosNFTsResume ({
  purchasedItems,
  setItem,
  setOpenModalSummary
}) {
  const owner = '0x57B8a9857FE3eEd4382EC203a042af77F5aabC5F'
  const totalItems = purchasedItems.length

  const income = purchasedItems
    ? purchasedItems.reduce((total, item) => parseInt(item.price) + total, 0)
    : 0
  const ethIncome = income ? income / 1000000000000000000 : 0

  const onShowDetail = (item) => {
    setItem(item)
    setOpenModalSummary(true)
  }

  return (
    <div className='resumen'>
      <h1 className='resumen__title'>Últimas transacciones</h1>
      <div className='resumen-list'>
        <div className='resumen-list-head'>
          <p className='resumen-list-head__title'>IDs</p>
          <p className='resumen-list-head__title'>Nombre</p>
          <p className='resumen-list-head__title'>Precio</p>
          <p className='resumen-list-head__title'>Imagen</p>
          <p className='resumen-list-head__title'>Comprador</p>
        </div>
        {purchasedItems.map((boughtItem, index) => (
          <div className='resumen-list-body' key={index}>
            <p className='resumen-list-body__item'>{boughtItem.itemId}</p>
            <p className='resumen-list-body__item'>
              {boughtItem.name ? boughtItem.name.slice(0, 4) + '...' : ''}
            </p>
            <p className='resumen-list-body__item'>
              {' '}
              {parseInt(boughtItem.price) / 1000000000000000000}
            </p>
            <p
              className='resumen-list-body__show'
              onClick={() => {
                onShowDetail(boughtItem)
              }}
            >
              ver
            </p>
            <a
              className='resumen-list-body__address'
              href={`https://testnet.snowtrace.io/address/${boughtItem.buyer}`}
            >
              {' '}
              {boughtItem.buyer.slice(0, 4) +
                '...' +
                boughtItem.buyer.slice(38)}
            </a>
          </div>
        ))}
        <div className='resumen-list-footer'>
          <p className='resumen-list-footer__item'>Total</p>
          <p className='resumen-list-footer__item'>{totalItems}</p>
          <div className='resumen-list-footer-value'>
            <figure>
              <img src={logo} alt='logo' />
            </figure>
            <p className='resumen-list-footer-value__item'>{ethIncome}</p>
          </div>
          <a
            className='resumen-list-footer__wallet'
            href={`https://goerli.etherscan.io/address/${owner}`}
          >
            {' '}
            {owner.slice(0, 4) + '...' + owner.slice(38)}
          </a>
          <p className='resumen-list-footer__item' />
        </div>
      </div>
    </div>
  )
}
