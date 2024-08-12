// components/Banner.js
import React, { useEffect } from 'react';

const TradingViewBanner = () => {
  useEffect(() => {
    // Load the TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
              description: '30-Day Federal Funds',
              proName: 'CBOT:ZQ1!'
            }, 
            {
                description: '2-Year Note',
                proName: 'CBOT:ZT1!'
            },
            {
                description: '5-Year Note',
                proName: 'CBOT:ZF1!'
            },
            {
                description: '10-Year Note',
                proName: 'CBOT:ZN1!'
            },
            {
                description: '30-Year Note',
                proName: 'CBOT:ZB1!'
            },
            {
              proName: 'FOREXCOM:SPXUSD',
              title: 'S&P 500 Index'
            }, 
            {
              proName: 'NASDAQ:MSFT',
              title: 'Microsoft'
            }, 
            {
              proName: 'NASDAQ:NVDA',
              title: 'Nvidia'
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: 'adaptive',
      colorTheme: 'light',
      locale: 'en'
    });
    document.querySelector('.tradingview-widget-container').appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"></div>
    </div>
  );
};

export default TradingViewBanner;
