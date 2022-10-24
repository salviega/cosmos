import React from 'react'
import './CosmosEvents.scss'

export function CosmosEvents ({ children }) {
  return (
    <div className='events'>
      <div className='events-benefits'>
          {React.Children.toArray(children).map(child => React.cloneElement(child, { }))}
      </div>
    </div>
  )
}
