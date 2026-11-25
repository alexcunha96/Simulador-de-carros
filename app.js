(() => {
  'use strict';

  const SAVE_KEY = 'garagem-simulador-v1';
  const STARTING_CASH = 35000;
  const GOAL = 100000;
  const euro = value => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.round(value));
  const fmtNumber = value => new Intl.NumberFormat('pt-PT').format(value);
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);

  const cars = [
    {model:'Renault Clio',year:2018,km:86400,fuel:'Gasolina',emoji:'🚗',market:12900,buy:9400,condition:72,color:'Azul',demand:1.08},
    {model:'Volkswagen Golf',year:2017,km:112000,fuel:'Gasóleo',emoji:'🚙',market:17400,buy:13100,condition:68,color:'Cinza',demand:1.12},
    {model:'Peugeot 208',year:2020,km:57300,fuel:'Gasolina',emoji:'🚘',market:15800,buy:11900,condition:81,color:'Branco',demand:1.1},
    {model:'Toyota Yaris',year:2019,km:69100,fuel:'Híbrido',emoji:'🚗',market:18900,buy:14800,condition:78,color:'Vermelho',demand:1.18},
    {model:'BMW Série 1',year:2016,km:128000,fuel:'Gasóleo',emoji:'🚘',market:21500,buy:16600,condition:64,color:'Preto',demand:1.02},
    {model:'Fiat 500',year:2021,km:39600,fuel:'Gasolina',emoji:'🚗',market:14900,buy:11200,condition:86,color:'Verde',demand:1.15},
    {model:'Seat Ibiza',year:2019,km:74800,fuel:'Gasolina',emoji:'🚙',market:14300,buy:10600,condition:74,color:'Prateado',demand:1.06},
    {model:'Dacia Duster',year:2018,km:95800,fuel:'Gasóleo',emoji:'🚙',market:16900,buy:12600,condition:71,color:'Laranja',demand:1.04},
    {model:'Mercedes Classe A',year:2017,km:103000,fuel:'Gasolina',emoji:'🚘',market:23900,buy:18700,condition:69,color:'Preto',demand:1.1},
    {model:'Citroën C3',year:2020,km:62400,fuel:'Gasolina',emoji:'🚗',market:13600,buy:9900,condition:79,color:'Azul',demand:1.05},
    {model:'Nissan Qashqai',year:2018,km:88700,fuel:'Gasóleo',emoji:'🚙',market:20500,buy:15700,condition:73,color:'Cinza',demand:1.12},
    {model:'Honda Civic',year:2017,km:92400,fuel:'Gasolina',emoji:'🚘',market:19200,buy:14500,condition:76,color:'Branco',demand:1.07},
    {model:'Audi A4',year:2020,km:58300,fuel:'Gasóleo',emoji:'🚘',market:32900,buy:26700,condition:82,color:'Cinzento',demand:1.08},
    {model:'BMW Série 3',year:2021,km:47200,fuel:'Híbrido',emoji:'🚘',market:42900,buy:35400,condition:84,color:'Azul',demand:1.1},
    {model:'Mercedes Classe C',year:2020,km:61900,fuel:'Gasóleo',emoji:'🚘',market:39900,buy:32600,condition:79,color:'Preto',demand:1.09},
    {model:'Volvo XC60',year:2021,km:55200,fuel:'Híbrido',emoji:'🚙',market:48900,buy:40700,condition:86,color:'Branco',demand:1.07},
    {model:'Porsche Macan',year:2019,km:68600,fuel:'Gasolina',emoji:'🚙',market:62900,buy:53500,condition:78,color:'Cinzento',demand:1.12},
    {model:'Tesla Model 3',year:2022,km:38900,fuel:'Elétrico',emoji:'🚘',market:36900,buy:30200,condition:88,color:'Branco',demand:1.13},
    {model:'Audi Q7',year:2020,km:71000,fuel:'Gasóleo',emoji:'🚙',market:67900,buy:57600,condition:77,color:'Preto',demand:1.04},
    {model:'BMW X5',year:2021,km:49300,fuel:'Híbrido',emoji:'🚙',market:78900,buy:67400,condition:85,color:'Azul',demand:1.08},
    {model:'Porsche 911 Carrera',year:2020,km:29400,fuel:'Gasolina',emoji:'🏎️',market:139000,buy:119000,condition:91,color:'Vermelho',demand:1.16},
    {model:'Ferrari 488 GTB',year:2018,km:21800,fuel:'Gasolina',emoji:'🏎️',market:239000,buy:208000,condition:88,color:'Vermelho',demand:1.13},
    {model:'Lamborghini Huracán',year:2019,km:17400,fuel:'Gasolina',emoji:'🏎️',market:289000,buy:253000,condition:92,color:'Amarelo',demand:1.18},
    {model:'McLaren 570S',year:2018,km:26700,fuel:'Gasolina',emoji:'🏎️',market:189000,buy:163000,condition:86,color:'Laranja',demand:1.1},
    {model:'Aston Martin Vantage',year:2020,km:19900,fuel:'Gasolina',emoji:'🏎️',market:169000,buy:146000,condition:90,color:'Verde',demand:1.08},
    {model:'Bentley Continental GT',year:2019,km:31200,fuel:'Gasolina',emoji:'🚘',market:219000,buy:191000,condition:89,color:'Azul',demand:1.06},
    {model:'Mercedes-AMG GT',year:2021,km:16200,fuel:'Gasolina',emoji:'🏎️',market:179000,buy:155000,condition:93,color:'Prateado',demand:1.12},
    {model:'Audi R8 V10',year:2019,km:23700,fuel:'Gasolina',emoji:'🏎️',market:174000,buy:150000,condition:90,color:'Azul',demand:1.1},
    {model:'Lexus LC 500',year:2020,km:28400,fuel:'Gasolina',emoji:'🚘',market:112000,buy:96000,condition:91,color:'Branco',demand:1.07},
    {model:'Porsche Taycan Turbo',year:2022,km:14500,fuel:'Elétrico',emoji:'🏎️',market:154000,buy:133000,condition:94,color:'Cinzento',demand:1.14},
    {model:'Bugatti Chiron',year:2019,km:8200,fuel:'Gasolina',emoji:'🏎️',market:2850000,buy:2520000,condition:95,color:'Azul',demand:1.2}
  ];
  const buyerNames=['João Martins','Inês Ferreira','Tiago Costa','Mariana Alves','Rui Santos','Beatriz Lopes','Diogo Rocha','Ana Carvalho','Miguel Sousa','Sofia Ribeiro'];
  const buyerReasons=['Gostou do estado do carro','Procura este modelo','Tem financiamento aprovado','Está pronto para fechar negócio','Visitou o teu anúncio'];
  const id=name=>document.getElementById(name);
  const set=(name,value)=>{const el=id(name);if(el)el.textContent=value;};
  const uid=prefix=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const randomCar=(source,idPrefix)=>({...source,id:uid(idPrefix),buy:Math.round(source.buy*(.94+Math.random()*.12)),condition:Math.min(96,Math.max(52,source.condition+Math.round((Math.random()-.5)*16))),listed:false,asking:source.market,serviced:false});
  function freshMarket(){
    const shuffled=cars.slice().sort(()=>Math.random()-.5);
    const regular=shuffled.slice(0,5).map(car=>randomCar(car,'car'));
    const auctionPool=shuffled.slice(5).length?shuffled.slice(5):cars;
    const auctions=auctionPool.slice(0,2).map(car=>{
      const lot=randomCar(car,'auction');
      const opening=Math.round((lot.buy*(.58+Math.random()*.12))/100)*100;
      return {...lot,auction:true,currentBid:opening,bidStep:Math.max(500,Math.round(lot.buy*.025/100)*100),playerBid:0};
    });
    return [...regular,...auctions];
  }
  const freshGame=()=>({cash:STARTING_CASH,day:1,reputation:50,profit:0,sales:0,inventory:[],market:freshMarket(),buyerOffers:[],activity:[{icon:'🏁',text:'O teu stand abriu as portas. Boa sorte, gerente!',day:1}]});
  let game;
  try{const saved=JSON.parse(localStorage.getItem(SAVE_KEY));game=saved&&saved.version===1?saved:freshGame();}catch(_){game=freshGame();}
  if(!Array.isArray(game.buyerOffers))game.buyerOffers=[];
  if(!Array.isArray(game.inventory))game.inventory=[];
  if(!Array.isArray(game.market))game.market=freshMarket();
  game.market.forEach(lot=>{if(typeof lot.auction!=='boolean')lot.auction=false;if(lot.auction){lot.currentBid=Number(lot.currentBid)||Math.round(lot.buy*.65);lot.bidStep=Number(lot.bidStep)||Math.max(500,Math.round(lot.buy*.025));lot.playerBid=Number(lot.playerBid)||0;}});
  let toastTimer;
  function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({...game,version:1}));}catch(_){}}
  function toast(message){const el=id('toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
  function log(icon,text){game.activity.unshift({icon,text,day:game.day});game.activity=game.activity.slice(0,8);}
  function art(car,tag){return `<div class="car-art"><span class="deal-tag">${esc(tag)}</span><span>${car.emoji}</span><span class="condition-tag">${esc(car.color)}</span></div>`;}
  function renderDashboard(){const el=id('dashboard-inventory');if(!el)return;if(!game.inventory.length){el.innerHTML='<div class="empty-state"><div class="empty-illustration">🚘</div><strong>A montra ainda está vazia</strong><p>Compra o teu primeiro carro no mercado de usados.</p><button type="button" class="inline-link" data-goto="mercado">Encontrar oportunidades →</button></div>';return;}el.innerHTML=game.inventory.slice(0,3).map(car=>`<div class="car-row"><div class="car-thumb">${car.emoji}</div><div class="car-row-info"><strong>${esc(car.model)} ${car.year}</strong><span>${fmtNumber(car.km)} km · ${car.listed?'À venda':'Ainda não anunciado'}</span></div><div class="row-price">${euro(car.asking)}<small>preço anunciado</small></div></div>`).join('');}
  function renderMarket(){
    const el=id('market-list');if(!el)return;
    if(!game.market.length){el.innerHTML='<div class="empty-market"><strong>Não há oportunidades disponíveis</strong><p>Avança um dia para atualizar o mercado e os leilões.</p></div>';return;}
    el.innerHTML=game.market.map(car=>{
      if(car.auction){
        const nextBid=Math.max(car.currentBid+car.bidStep,(car.playerBid||0)+car.bidStep);
        const alreadyLeading=car.playerBid>0;
        return `<article class="market-card auction-card">${art(car,'🔨 LEILÃO')}<div class="market-card-body"><div class="market-car-title">${esc(car.model)} ${car.year}</div><div class="car-subtitle">${esc(car.color)} · Lote de leilão</div><div class="car-specs"><span>◷ ${fmtNumber(car.km)} km</span><span>⛽ ${esc(car.fuel)}</span><span>✦ ${car.condition}%</span></div><div class="auction-price-row"><div><small>${alreadyLeading?'A TUA LICITAÇÃO':'LICITAÇÃO ATUAL'}</small><div class="market-price">${euro(alreadyLeading?car.playerBid:car.currentBid)}</div></div><div class="auction-market-value"><small>VALOR DE MERCADO</small><strong>${euro(car.market)}</strong></div></div><p class="auction-note">${alreadyLeading?'Estás na frente. A licitação será resolvida quando avançares o dia.':`Próxima licitação: ${euro(nextBid)}. O resultado sai ao avançar o dia.`}</p><button type="button" class="buy-button auction-button" data-bid="${esc(car.id)}" ${game.cash<nextBid?'disabled':''}>${game.cash<nextBid?'Capital insuficiente':(alreadyLeading?'Aumentar licitação':'Licitar por '+euro(nextBid))}<span>→</span></button></div></article>`;
      }
      const savings=car.market-car.buy;
      return `<article class="market-card">${art(car,savings>2500?'BOM NEGÓCIO':'OPORTUNIDADE')}<div class="market-card-body"><div class="market-car-title">${esc(car.model)} ${car.year}</div><div class="car-subtitle">${esc(car.color)} · Disponível para compra</div><div class="car-specs"><span>◷ ${fmtNumber(car.km)} km</span><span>⛽ ${esc(car.fuel)}</span><span>✦ ${car.condition}%</span></div><div class="market-price-row"><div><small>PREÇO PEDIDO</small><div class="market-price">${euro(car.buy)}</div></div><div><div class="market-value-label">VALOR DE MERCADO</div><div class="market-value">${euro(car.market)}</div><div class="deal-difference">${savings>0?'+'+euro(savings)+' potencial':euro(savings)+' acima do valor'}</div></div></div><button type="button" class="buy-button" data-buy="${esc(car.id)}" ${game.cash<car.buy?'disabled':''}>${game.cash<car.buy?'Capital insuficiente':'Comprar carro'} <span>→</span></button></div></article>`;
    }).join('');
  }
  function offerFor(car){return game.buyerOffers.find(offer=>offer.carId===car.id);}
  function renderStand(){
    const el=id('stand-list');if(!el)return;
    if(!game.inventory.length){el.innerHTML='<div class="empty-market"><strong>O teu stand está pronto para receber carros</strong><p>Compra um carro no mercado ou ganha um leilão. Depois anuncia-o para receber propostas (incluindo, ocasionalmente, retomas).</p><button type="button" class="inline-link" data-goto="mercado">Explorar mercado →</button></div>';return;}
    el.innerHTML=game.inventory.map(car=>{
      const offer=offerFor(car);
      const buyerHtml=offer?`<div class="buyer-offer"><div class="buyer-head"><span class="buyer-avatar">${esc(offer.name.charAt(0))}</span><div class="buyer-intro"><strong>${esc(offer.name)} quer comprar!</strong><span>${esc(offer.reason)} · Oferta válida até ao próximo dia</span></div></div><div class="buyer-offer-row"><div><small>VALOR EM DINHEIRO</small><strong>${euro(offer.price)}</strong></div><span class="buyer-vs">Preço anunciado: ${euro(car.asking)}</span></div>${offer.tradeIn?`<div class="tradein-details"><strong>🔁 Também propõe retoma</strong><span>${esc(offer.tradeIn.model)} ${offer.tradeIn.year} · avaliação ${euro(offer.tradeIn.allowance)}</span><small>Se aceitares, o carro entra no teu stock.</small></div>`:''}<div class="buyer-actions"><button type="button" class="accept-offer" data-accept-offer="${esc(offer.id)}">Aceitar${offer.tradeIn?' oferta e retoma':' oferta'}</button><button type="button" class="reject-offer" data-reject-offer="${esc(offer.id)}">Recusar</button></div></div>`:'';
      return `<article class="stand-card">${art(car,car.listed?'À VENDA':'NO STOCK')}<div class="stand-card-body"><div class="market-car-title">${esc(car.model)} ${car.year}</div><div class="stand-detail">${fmtNumber(car.km)} km · ${esc(car.fuel)}${car.fromTradeIn?' · Retoma':''}</div><div class="condition-row"><span class="condition-label">Estado</span><div class="condition-bar"><span style="width:${car.condition}%"></span></div><span class="condition-number">${car.condition}%</span></div><div class="price-control"><label for="price-${esc(car.id)}">Preço de venda (mercado: ${euro(car.market)})</label><div class="price-input-wrap"><span>€</span><input id="price-${esc(car.id)}" class="price-input" type="number" inputmode="numeric" min="1" step="100" value="${Math.round(car.asking)}" data-price="${esc(car.id)}"></div></div><div class="stand-actions"><button type="button" class="service-button" data-service="${esc(car.id)}" ${car.serviced||car.condition>=96||game.cash<650?'disabled':''}>${car.serviced?'✓ Revisto':car.condition>=96?'Estado excelente':'🔧 Revisão · '+euro(650)}</button><button type="button" class="list-button" data-list="${esc(car.id)}">${car.listed?'Guardar preço':'Definir preço'}</button></div>${buyerHtml}</div></article>`;
    }).join('');
  }
  function renderActivity(){const el=id('activity-list');if(!el)return;el.innerHTML=game.activity.slice(0,4).map(a=>`<div class="activity-row"><span class="activity-icon">${a.icon}</span><span class="activity-text">${esc(a.text)}</span><span class="activity-time">Dia ${a.day}</span></div>`).join('');}
  function render(){set('cash-value',euro(game.cash));set('stock-value',euro(game.inventory.reduce((sum,c)=>sum+c.buy,0)));set('stock-note',`${game.inventory.length} ${game.inventory.length===1?'carro':'carros'} no stand`);set('reputation-value',game.reputation);if(id('reputation-bar'))id('reputation-bar').style.width=`${game.reputation}%`;set('profit-value',`${game.profit<0?'-':''}${euro(Math.abs(game.profit))}`);set('sales-note',`${game.sales} ${game.sales===1?'venda realizada':'vendas realizadas'}`);set('top-day',game.day);set('stand-count',game.inventory.length);set('nav-stock',game.inventory.length);set('goal-current',euro(game.cash));if(id('goal-progress'))id('goal-progress').style.width=`${Math.max(0,Math.min(100,game.cash/GOAL*100))}%`;set('market-day',String(game.day).padStart(2,'0'));set('market-count',game.market.length);set('market-feature-title',game.market.length?`${game.market.length} oportunidades e leilões`:'Novas oportunidades');set('market-feature-copy',game.market.length?'Compara preços, licita e escolhe o teu próximo negócio.':'Avança o dia para ver novas ofertas.');renderDashboard();renderMarket();renderStand();renderActivity();save();}
  function buyCar(carId){const i=game.market.findIndex(c=>c.id===carId&&!c.auction);if(i<0)return;const car=game.market[i];if(game.cash<car.buy){toast('Não tens capital suficiente.');return;}game.cash-=car.buy;game.inventory.push({...car,asking:car.market,listed:false,serviced:false});game.market.splice(i,1);log('🚘',`Compraste um ${car.model} por ${euro(car.buy)}.`);toast(`${car.model} comprado! Define o preço no teu stand.`);render();}
  function bidAuction(carId){const lot=game.market.find(c=>c.id===carId&&c.auction);if(!lot)return;const nextBid=Math.max(lot.currentBid+lot.bidStep,(lot.playerBid||0)+lot.bidStep);const extra=nextBid-(lot.playerBid||0);if(game.cash<extra){toast('Não tens capital suficiente para aumentar esta licitação.');return;}game.cash-=extra;lot.playerBid=nextBid;log('🔨',`Licitas-te ${euro(nextBid)} pelo ${lot.model}. A licitação será resolvida ao avançar o dia.`);toast(`Licitação de ${euro(nextBid)} registada. Avança o dia para saber o resultado.`);render();}
  function serviceCar(carId){const car=game.inventory.find(x=>x.id===carId);if(!car||car.serviced||car.condition>=96||game.cash<650)return;game.cash-=650;car.condition=Math.min(100,car.condition+20);car.market=Math.round(car.market*1.025);car.serviced=true;log('🔧',`Fizeste a revisão do ${car.model}. Estado: ${car.condition}%.`);toast('Revisão concluída.');render();}
  function listCar(carId){const car=game.inventory.find(x=>x.id===carId),input=id(`price-${carId}`);if(!car||!input)return;const price=Math.round(Number(input.value));if(!Number.isFinite(price)||price<1){toast('Introduz um preço válido.');return;}car.asking=price;car.listed=true;log('🏷️',`Anunciaste o ${car.model} por ${euro(price)}.`);toast('Anúncio publicado. Os compradores podem enviar propostas, mas a venda só acontece se aceitares.');render();}
  function acceptOffer(offerId){
    const offer=game.buyerOffers.find(item=>item.id===offerId);if(!offer)return;
    const car=game.inventory.find(item=>item.id===offer.carId);if(!car)return;
    const tradeAllowance=offer.tradeIn?offer.tradeIn.allowance:0;
    const serviceCost=car.serviced?650:0;
    const margin=offer.price+tradeAllowance-car.buy-serviceCost;
    game.cash+=offer.price;game.profit+=margin;game.sales++;
    game.reputation=Math.max(0,Math.min(100,game.reputation+(margin>=0?2:-2)));
    game.inventory=game.inventory.filter(item=>item.id!==car.id);
    game.buyerOffers=game.buyerOffers.filter(item=>item.carId!==car.id);
    if(offer.tradeIn){const trade=offer.tradeIn;game.inventory.push({...trade,id:uid('tradein'),buy:trade.allowance,asking:trade.market,listed:false,serviced:false,fromTradeIn:true,auction:false});log('🔁',`Recebeste um ${trade.model} como retoma (avaliação ${euro(trade.allowance)}).`);}
    log('🤝',`Aceitaste a proposta de ${offer.name}: ${euro(offer.price)}${offer.tradeIn?' e retoma':''}.`);
    toast(`Venda aceite! ${offer.name} comprou o ${car.model}.`);render();
  }
  function rejectOffer(offerId){const offer=game.buyerOffers.find(item=>item.id===offerId);if(!offer)return;game.buyerOffers=game.buyerOffers.filter(item=>item.id!==offerId);log('🙅',`Recusaste a oferta de ${offer.name} pelo carro.`);toast('Oferta recusada. Poderás receber outra amanhã.');render();}
  function createBuyerOffers(){
    game.buyerOffers=[];
    const available=game.inventory.filter(car=>car.listed);
    available.forEach((car,index)=>{
      const name=buyerNames[Math.floor(Math.random()*buyerNames.length)];
      const fairValue=car.market*(.79+car.condition/1000+game.reputation/5000);
      const offerPrice=Math.max(1000,Math.min(car.asking,Math.round((fairValue*(.97+Math.random()*.07))/100)*100));
      let tradeIn=null;
      if(Math.random()<.24){const source=cars[Math.floor(Math.random()*12)];const trade=randomCar(source,'trade');tradeIn={model:trade.model,year:trade.year,km:trade.km,fuel:trade.fuel,emoji:trade.emoji,market:trade.market,condition:trade.condition,color:trade.color,allowance:Math.round(trade.market*(.68+Math.random()*.12)/100)*100};}
      game.buyerOffers.push({id:uid(`offer-${game.day}-${index}`),carId:car.id,name,reason:buyerReasons[Math.floor(Math.random()*buyerReasons.length)],price:offerPrice,tradeIn,day:game.day});
    });
    if(available.length)log('🧑‍💼',`${available.length} comprador${available.length===1?' interessado':'es interessados'} enviou uma proposta. Tens de a aceitar para vender.`);
  }
  function resolveAuctions(){
    const remaining=[];
    game.market.forEach(lot=>{
      if(!lot.auction){remaining.push(lot);return;}
      if(lot.playerBid>0&&Math.random()<.72){
        game.inventory.push({...lot,auction:false,buy:lot.playerBid,asking:lot.market,listed:false,serviced:false});
        log('🏆',`Ganhaste o leilão do ${lot.model} por ${euro(lot.playerBid)}.`);
      }else{
        if(lot.playerBid>0){game.cash+=lot.playerBid;log('🔨',`Não ganhaste o leilão do ${lot.model}; a licitação de ${euro(lot.playerBid)} foi devolvida.`);}
        else log('⌛',`O leilão do ${lot.model} terminou sem licitações tuas.`);
      }
    });
    return remaining;
  }
  function advanceDay(){game.day++;game.cash-=350;game.market=resolveAuctions();game.buyerOffers=[];if(Math.random()<.12){const bonus=250+Math.floor(Math.random()*401);game.cash+=bonus;game.reputation=Math.min(100,game.reputation+1);log('⭐',`Bónus de recomendação: ${euro(bonus)}.`);}game.market=game.market.concat(freshMarket());createBuyerOffers();if(game.cash<0)game.reputation=Math.max(0,game.reputation-2);log('📅',`Começou o dia ${game.day}. Custos diários do stand: ${euro(350)}.`);render();const count=game.buyerOffers.length;toast(count?`${count} comprador${count===1?' interessado':'es interessados'} enviou proposta. Vai ao stand e aceita ou recusa.`:`Dia ${game.day} começou. Publica os teus carros para receber propostas.`);}
  function switchView(name){document.querySelectorAll('.view').forEach(view=>view.classList.toggle('active',view.id===`view-${name}`));document.querySelectorAll('.nav-link').forEach(link=>link.classList.toggle('active',link.dataset.view===name));set('crumb-title',{inicio:'VISÃO GERAL',mercado:'MERCADO DE USADOS',stand:'O MEU STAND'}[name]||'VISÃO GERAL');window.scrollTo(0,0);}
  document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.view){switchView(button.dataset.view);return;}if(button.dataset.goto){switchView(button.dataset.goto);return;}if(button.id==='advance-day'){advanceDay();return;}if(button.dataset.buy){buyCar(button.dataset.buy);return;}if(button.dataset.bid){bidAuction(button.dataset.bid);return;}if(button.dataset.service){serviceCar(button.dataset.service);return;}if(button.dataset.list){listCar(button.dataset.list);return;}if(button.dataset.acceptOffer){acceptOffer(button.dataset.acceptOffer);return;}if(button.dataset.rejectOffer){rejectOffer(button.dataset.rejectOffer);return;}if(button.id==='reset-button'){id('modal-backdrop').hidden=false;return;}if(button.id==='modal-close'||button.id==='modal-cancel'){id('modal-backdrop').hidden=true;return;}if(button.id==='modal-confirm'){game=freshGame();id('modal-backdrop').hidden=true;switchView('inicio');render();toast('Novo negócio iniciado.');}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')id('modal-backdrop').hidden=true;if(event.key==='Enter'&&event.target.matches('.price-input')){event.preventDefault();listCar(event.target.dataset.price);}});
  document.addEventListener('change',event=>{if(!event.target.matches('.price-input'))return;const car=game.inventory.find(item=>item.id===event.target.dataset.price),value=Number(event.target.value);if(car&&Number.isFinite(value)&&value>0){car.asking=Math.round(value);save();}});
  render();
})();
