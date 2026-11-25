(() => {
  const css = `
    .buyer-offer{margin-top:14px;padding:13px;border:1px solid #dceee2;border-radius:9px;background:#f2faf4}
    .buyer-head{display:flex;align-items:center;gap:9px}
    .buyer-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#d9efdf;color:#16865a;font-weight:700;font-size:15px;flex-shrink:0}
    .buyer-intro{min-width:0}.buyer-intro strong,.buyer-intro span{display:block}.buyer-intro strong{font-size:11px;color:#24372c}.buyer-intro span{font-size:9px;color:#79887e;margin-top:3px;line-height:1.4}
    .buyer-offer-row{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;margin-top:12px;padding-top:10px;border-top:1px solid #dfece2}
    .buyer-offer-row small{display:block;font-size:8px;letter-spacing:.5px;color:#849189;margin-bottom:3px}.buyer-offer-row strong{font:600 17px 'Space Grotesk';color:#16865a}.buyer-vs{font-size:8px;color:#87938b;text-align:right}
    .buyer-actions{display:flex;gap:8px;margin-top:10px}.buyer-actions button{min-height:42px;border-radius:6px;padding:9px 10px;font:700 10px 'DM Sans';flex:1;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    .accept-offer{border:0;background:#16865a;color:#fff}.accept-offer:hover{background:#116c47}.reject-offer{border:1px solid #dfe7e0;background:#fff;color:#657269}
    button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    @media(max-width:430px){.buyer-offer{padding:10px}.buyer-actions button{min-height:44px;font-size:11px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
})();
