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
    .garage-costs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px;margin:12px 0;padding:11px 12px;border:1px solid #e7ece8;border-radius:8px;background:#f8faf8}
    .garage-costs div{display:flex;flex-direction:column;gap:3px;min-width:0}.garage-costs span{font-size:9px;line-height:1.35;color:#7c8982}.garage-costs strong{font:600 13px 'Space Grotesk',sans-serif;color:#26372e}.garage-costs .garage-total{grid-column:1/-1;flex-direction:row;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid #e1e9e3}.garage-costs .garage-total span{font-weight:700;color:#354b3c}.garage-costs .garage-total strong{font-size:15px;color:#16865a}
    button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    @media(max-width:430px){.buyer-offer{padding:10px}.buyer-actions button{min-height:44px;font-size:11px}.garage-costs{gap:7px;padding:10px}.garage-costs strong{font-size:12px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const formatEuro=value=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Math.round(Number(value)||0));
  function updateGarageCosts(){
    let game;
    try{game=JSON.parse(localStorage.getItem('garagem-simulador-v1')||'null');}catch(_){return;}
    if(!game||!Array.isArray(game.inventory))return;
    document.querySelectorAll('.stand-card').forEach(card=>{
      const action=card.querySelector('[data-service], [data-list]');
      const carId=action?.dataset.service||action?.dataset.list;
      const car=game.inventory.find(item=>item.id===carId);
      if(!car)return;
      let summary=card.querySelector('.garage-costs');
      if(!summary){
        summary=document.createElement('div');
        summary.className='garage-costs';
        const anchor=card.querySelector('.stand-detail')||card.querySelector('.price-control');
        if(anchor)anchor.insertAdjacentElement('afterend',summary);
        else card.querySelector('.stand-card-body')?.append(summary);
      }
      const repairCost=Number.isFinite(Number(car.repairCost))?Number(car.repairCost):(car.serviced?650:0);
      const purchaseCost=Number(car.buy)||0;
      const markup=`<div><span>Valor de mercado</span><strong>${formatEuro(car.market)}</strong></div><div><span>Valor de compra</span><strong>${formatEuro(purchaseCost)}</strong></div><div><span>Gasto em reparações</span><strong>${formatEuro(repairCost)}</strong></div><div class="garage-total"><span>Compra + reparações</span><strong>${formatEuro(purchaseCost+repairCost)}</strong></div>`;
      if(summary.dataset.summary!==markup){summary.innerHTML=markup;summary.dataset.summary=markup;}
    });
  }
  const observer=new MutationObserver(updateGarageCosts);
  observer.observe(document.body,{childList:true,subtree:true});
  updateGarageCosts();
})();
