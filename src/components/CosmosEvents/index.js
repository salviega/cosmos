import React from 'react'
import './CosmosEvents.scss'

export function CosmosEvents ({ children }) {
  return (
    <div className='events'>
      <h2 className='events__title'>Beneficios que tenemos para ti</h2>
      <div className='events-benefits'>
        <div className='events-container'>
          {React.Children.toArray(children).map(child => React.cloneElement(child, { }))}
        </div>
      </div>
    </div>
  )
}
