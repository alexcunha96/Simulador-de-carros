(() => {
  const css = `
    .buyer-offer{margin-top:14px;padding:13px;border:1px solid #dceee2;border-radius:9px;background:#f2faf4}
    .buyer-head{display:flex;align-items:center;gap:9px}
    .buyer-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#d9efdf;color:#16865a;font-weight:700;font-size:15px;flex-shrink:0}
    .buyer-intro{min-width:0}.buyer-intro strong,.buyer-intro span{display:block}.buyer-intro strong{font-size:11px;color:#24372c}.buyer-intro span{font-size:9px;color:#79887e;margin-top:3px;line-height:1.4}
    .buyer-offer-row{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;margin-top:12px;padding-top:10px;border-top:1px solid #dfece2}
    .buyer-offer-row small{display:block;font-size:8px;letter-spacing:.5px;color:#849189;margin-bottom:3px}.buyer-offer-row strong{font:600 17px 'Space Grotesk';color:#16865a}.buyer-vs{font-size:8px;color:#87938b;text-align:right}
    .tradein-details{display:grid;gap:4px;margin-top:10px;padding:10px;border-radius:6px;background:#fff;border:1px solid #e6ece7}.tradein-details strong{font-size:10px;color:#4e624f}.tradein-details span{font-size:10px;color:#26372b}.tradein-details small{font-size:9px;color:#87938b}
    .buyer-actions{display:flex;gap:8px;margin-top:10px}.buyer-actions button{min-height:42px;border-radius:6px;padding:9px 10px;font:700 10px 'DM Sans';flex:1;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    .accept-offer{border:0;background:#16865a;color:#fff}.accept-offer:hover{background:#116c47}.reject-offer{border:1px solid #dfe7e0;background:#fff;color:#657269}
    .auction-card{border-color:#f0dfbd}.auction-card .deal-tag{background:#de9c31}.auction-price-row{display:flex;justify-content:space-between;align-items:flex-end;padding:11px 0 2px;border-top:1px solid #f0ece4}.auction-price-row small{display:block;font-size:8px;letter-spacing:.5px;color:#87938b;margin-bottom:4px}.auction-market-value{text-align:right}.auction-market-value strong{font:600 14px 'Space Grotesk';color:#64736a}.auction-note{margin:8px 0 12px;color:#7c8982;font-size:10px;line-height:1.5}.auction-button{background:#a96d11}.auction-button:hover{background:#8c580d}
    button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    @media(max-width:430px){.buyer-offer{padding:10px}.buyer-actions button{min-height:44px;font-size:11px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
})();
