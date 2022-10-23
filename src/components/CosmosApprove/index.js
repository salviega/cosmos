import React from 'react';
import {QRCodeSVG} from 'qrcode.react';
import './CosmosApprove.scss';

export function CosmosApprove() {

  return (
    <div className="qr">
      <QRCodeSVG value="https://cosmos-ivory.vercel.app/"/>,
    </div>
  )
}