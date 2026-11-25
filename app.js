(() => {
  'use strict';

  const SAVE_KEY = 'garagem-simulador-v1';
  const STARTING_CASH = 35000;
  const GOAL = 100000;
  const euro = value => new Intl.NumberFormat('pt-PT', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(Math.round(value));
  const fmtNumber = value => new Intl.NumberFormat('pt-PT').format(value);
  const esc = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

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
    {model:'Honda Civic',year:2017,km:92400,fuel:'Gasolina',emoji:'🚘',market:19200,buy:14500,condition:76,color:'Branco',demand:1.07}
  ];
  const buyerNames = ['João Martins','Inês Ferreira','Tiago Costa','Mariana Alves','Rui Santos','Beatriz Lopes','Diogo Rocha','Ana Carvalho','Miguel Sousa','Sofia Ribeiro'];
  const buyerReasons = ['Gostou do estado do carro','Procura este modelo','Tem financiamento aprovado','Está pronto para fechar negócio','Visitou o teu anúncio'];
  const id = name => document.getElementById(name);
  const set = (name, value) => { const el=id(name); if(el) el.textContent=value; };
  const freshMarket = () => cars.slice().sort(() => Math.random()-.5).slice(0,5).map((car,i) => ({
    ...car, id:`car-${Date.now()}-${i}-${Math.random().toString(36).slice(2,7)}`,
    buy:Math.round(car.buy*(.94+Math.random()*.12)),
    condition:Math.min(96,Math.max(52,car.condition+Math.round((Math.random()-.5)*16))),
    listed:false, asking:car.market, serviced:false
  }));
  const freshGame = () => ({cash:STARTING_CASH,day:1,reputation:50,profit:0,sales:0,inventory:[],market:freshMarket(),buyerOffers:[],activity:[{icon:'🏁',text:'O teu stand abriu as portas. Boa sorte, gerente!',day:1}]});
  let game;
  try {
    const saved=JSON.parse(localStorage.getItem(SAVE_KEY));
    game=saved&&saved.version===1?saved:freshGame();
  } catch (_) { game=freshGame(); }
  if (!Array.isArray(game.buyerOffers)) game.buyerOffers=[];
  let toastTimer;
  function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({...game,version:1}));}catch(_){}}
  function toast(message){const el=id('toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000);}
  function log(icon,text){game.activity.unshift({icon,text,day:game.day});game.activity=game.activity.slice(0,8);}
  function art(car,tag){return `<div class="car-art"><span class="deal-tag">${tag}</span><span>${car.emoji}</span><span class="condition-tag">${esc(car.color)}</span></div>`;}

  function renderDashboard(){
    const el=id('dashboard-inventory');if(!el)return;
    if(!game.inventory.length){el.innerHTML='<div class="empty-state"><div class="empty-illustration">🚘</div><strong>A montra ainda está vazia</strong><p>Compra o teu primeiro carro no mercado de usados.</p><button type="button" class="inline-link" data-goto="mercado">Encontrar oportunidades →</button></div>';return;}
    el.innerHTML=game.inventory.slice(0,3).map(car=>`<div class="car-row"><div class="car-thumb">${car.emoji}</div><div class="car-row-info"><strong>${esc(car.model)} ${car.year}</strong><span>${fmtNumber(car.km)} km · ${car.listed?'À venda':'Ainda não anunciado'}</span></div><div class="row-price">${euro(car.asking)}<small>preço anunciado</small></div></div>`).join('');
  }
  function renderMarket(){
    const el=id('market-list');if(!el)return;
    if(!game.market.length){el.innerHTML='<div class="empty-market"><strong>Já viste todas as ofertas de hoje</strong><p>Avança um dia para novas oportunidades.</p><button type="button" class="inline-link" data-goto="inicio">Voltar à visão geral →</button></div>';return;}
    el.innerHTML=game.market.map(car=>{const savings=car.market-car.buy;return `<article class="market-card">${art(car,savings>2500?'BOM NEGÓCIO':'OPORTUNIDADE')}<div class="market-card-body"><div class="market-car-title">${esc(car.model)} ${car.year}</div><div class="car-subtitle">${esc(car.color)} · Disponível para compra</div><div class="car-specs"><span>◷ ${fmtNumber(car.km)} km</span><span>⛽ ${esc(car.fuel)}</span><span>✦ ${car.condition}%</span></div><div class="market-price-row"><div><small>PREÇO PEDIDO</small><div class="market-price">${euro(car.buy)}</div></div><div><div class="market-value-label">VALOR DE MERCADO</div><div class="market-value">${euro(car.market)}</div><div class="deal-difference">${savings>0?'+'+euro(savings)+' potencial':euro(savings)+' acima do valor'}</div></div></div><button type="button" class="buy-button" data-buy="${esc(car.id)}" ${game.cash<car.buy?'disabled':''}>${game.cash<car.buy?'Capital insuficiente':'Comprar carro'} <span>→</span></button></div></article>`;}).join('');
  }
  function offerFor(car){return game.buyerOffers.find(offer=>offer.carId===car.id);}
  function renderStand(){
    const el=id('stand-list');if(!el)return;
    if(!game.inventory.length){el.innerHTML='<div class="empty-market"><strong>O teu stand está pronto para receber carros</strong><p>Compra uma oportunidade no mercado. Quando anunciares um carro, os compradores vão começar a enviar ofertas.</p><button type="button" class="inline-link" data-goto="mercado">Explorar mercado →</button></div>';return;}
    el.innerHTML=game.inventory.map(car=>{
      const offer=offerFor(car);
      const buyerHtml=offer?`<div class="buyer-offer"><div class="buyer-head"><span class="buyer-avatar">${esc(offer.name.charAt(0))}</span><div class="buyer-intro"><strong>${esc(offer.name)} quer comprar!</strong><span>${esc(offer.reason)} · Oferta válida até ao próximo dia</span></div></div><div class="buyer-offer-row"><div><small>OFERTA DO COMPRADOR</small><strong>${euro(offer.price)}</strong></div><span class="buyer-vs">Preço anunciado: ${euro(car.asking)}</span></div><div class="buyer-actions"><button type="button" class="accept-offer" data-accept-offer="${esc(offer.id)}">Aceitar oferta</button><button type="button" class="reject-offer" data-reject-offer="${esc(offer.id)}">Recusar</button></div></div>`:'';
      return `<article class="stand-card">${art(car,car.listed?'À VENDA':'NO STOCK')}<div class="stand-card-body"><div class="market-car-title">${esc(car.model)} ${car.year}</div><div class="stand-detail">${fmtNumber(car.km)} km · ${esc(car.fuel)}</div><div class="condition-row"><span class="condition-label">Estado</span><div class="condition-bar"><span style="width:${car.condition}%"></span></div><span class="condition-number">${car.condition}%</span></div><div class="price-control"><label for="price-${esc(car.id)}">Preço de venda (mercado: ${euro(car.market)})</label><div class="price-input-wrap"><span>€</span><input id="price-${esc(car.id)}" class="price-input" type="number" inputmode="numeric" min="1" step="100" value="${Math.round(car.asking)}" data-price="${esc(car.id)}"></div></div><div class="stand-actions"><button type="button" class="service-button" data-service="${esc(car.id)}" ${car.serviced||car.condition>=96||game.cash<650?'disabled':''}>${car.serviced?'✓ Revisto':car.condition>=96?'Estado excelente':'🔧 Revisão · '+euro(650)}</button><button type="button" class="list-button" data-list="${esc(car.id)}">${car.listed?'Guardar preço':'Definir preço'}</button></div>${buyerHtml}</div></article>`;
    }).join('');
  }
  function renderActivity(){const el=id('activity-list');if(!el)return;el.innerHTML=game.activity.slice(0,4).map(a=>`<div class="activity-row"><span class="activity-icon">${a.icon}</span><span class="activity-text">${esc(a.text)}</span><span class="activity-time">Dia ${a.day}</span></div>`).join('');}
  function render(){
    set('cash-value',euro(game.cash));set('stock-value',euro(game.inventory.reduce((sum,c)=>sum+c.buy,0)));set('stock-note',`${game.inventory.length} ${game.inventory.length===1?'carro':'carros'} no stand`);
    set('reputation-value',game.reputation);if(id('reputation-bar'))id('reputation-bar').style.width=`${game.reputation}%`;
    set('profit-value',`${game.profit<0?'-':''}${euro(Math.abs(game.profit))}`);set('sales-note',`${game.sales} ${game.sales===1?'venda realizada':'vendas realizadas'}`);
    set('top-day',game.day);set('stand-count',game.inventory.length);set('nav-stock',game.inventory.length);set('goal-current',euro(game.cash));
    if(id('goal-progress'))id('goal-progress').style.width=`${Math.max(0,Math.min(100,game.cash/GOAL*100))}%`;
    set('market-day',String(game.day).padStart(2,'0'));set('market-count',game.market.length);
    set('market-feature-title',game.market.length?`${game.market.length} carros em oportunidade`:'Novas oportunidades');
    set('market-feature-copy',game.market.length?'Compara preços e escolhe o teu próximo negócio.':'Avança o dia para ver novas ofertas.');
    renderDashboard();renderMarket();renderStand();renderActivity();save();
  }
  function buyCar(carId){const i=game.market.findIndex(c=>c.id===carId);if(i<0)return;const c=game.market[i];if(game.cash<c.buy){toast('Não tens capital suficiente.');return;}game.cash-=c.buy;game.inventory.push({...c,asking:c.market,listed:false,serviced:false});game.market.splice(i,1);log('🚘',`Compraste um ${c.model} por ${euro(c.buy)}.`);toast(`${c.model} comprado! Define o preço no teu stand.`);render();}
  function serviceCar(carId){const c=game.inventory.find(x=>x.id===carId);if(!c||c.serviced||c.condition>=96||game.cash<650)return;game.cash-=650;c.condition=Math.min(100,c.condition+20);c.market=Math.round(c.market*1.025);c.serviced=true;log('🔧',`Fizeste a revisão do ${c.model}. Estado: ${c.condition}%.`);toast('Revisão concluída.');render();}
  function listCar(carId){const c=game.inventory.find(x=>x.id===carId),input=id(`price-${carId}`);if(!c||!input)return;const price=Math.round(Number(input.value));if(!Number.isFinite(price)||price<1){toast('Introduz um preço válido.');return;}c.asking=price;c.listed=true;log('🏷️',`Anunciaste o ${c.model} por ${euro(price)}.`);toast('Anúncio publicado. Avança o dia para receber ofertas de compradores.');render();}
  function acceptOffer(offerId){
    const offer=game.buyerOffers.find(item=>item.id===offerId);if(!offer)return;
    const car=game.inventory.find(item=>item.id===offer.carId);if(!car)return;
    const margin=offer.price-car.buy-(car.serviced?650:0);
    game.cash+=offer.price;game.profit+=margin;game.sales++;
    game.reputation=Math.max(0,Math.min(100,game.reputation+(margin>=0?2:-2)));
    game.inventory=game.inventory.filter(item=>item.id!==car.id);
    game.buyerOffers=game.buyerOffers.filter(item=>item.carId!==car.id);
    log('🤝',`Vendeste o ${car.model} a ${offer.name} por ${euro(offer.price)}. ${margin>=0?'Lucro':'Prejuízo'}: ${euro(Math.abs(margin))}.`);
    toast(`Venda concluída! ${offer.name} comprou o ${car.model}.`);render();
  }
  function rejectOffer(offerId){const offer=game.buyerOffers.find(item=>item.id===offerId);if(!offer)return;game.buyerOffers=game.buyerOffers.filter(item=>item.id!==offerId);log('🙅',`Recusaste a oferta de ${offer.name} pelo carro.`);toast('Oferta recusada. Poderás receber outra amanhã.');render();}
  function createBuyerOffers(){
    game.buyerOffers=[];
    const available=game.inventory.filter(car=>car.listed);
    available.forEach((car,index)=>{
      const name=buyerNames[Math.floor(Math.random()*buyerNames.length)];
      const fairValue=car.market*(.79+car.condition/1000+game.reputation/5000);
      const offerPrice=Math.max(1000,Math.min(car.asking,Math.round((fairValue*(.97+Math.random()*.07))/100)*100));
      game.buyerOffers.push({id:`offer-${game.day}-${index}-${Date.now()}`,carId:car.id,name,reason:buyerReasons[Math.floor(Math.random()*buyerReasons.length)],price:offerPrice,day:game.day});
    });
    if(available.length)log('🧑‍💼',`${available.length} comprador${available.length===1?' interessado':'es interessados'} enviou uma oferta pelo teu stock.`);
  }
  function advanceDay(){
    game.day++;game.cash-=350;game.buyerOffers=[];
    if(Math.random()<.12){const bonus=250+Math.floor(Math.random()*401);game.cash+=bonus;game.reputation=Math.min(100,game.reputation+1);log('⭐',`Bónus de recomendação: ${euro(bonus)}.`);}
    game.market=freshMarket();createBuyerOffers();
    if(game.cash<0)game.reputation=Math.max(0,game.reputation-2);
    log('📅',`Começou o dia ${game.day}. Custos diários do stand: ${euro(350)}.`);
    render();
    const count=game.buyerOffers.length;
    toast(count?`${count} comprador${count===1?' interessado':'es interessados'} fez oferta! Vai ao teu stand.`:`Dia ${game.day} começou. Não tens carros anunciados; publica um anúncio para receber ofertas.`);
  }
  function switchView(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));document.querySelectorAll('.nav-link').forEach(v=>v.classList.toggle('active',v.dataset.view===name));set('crumb-title',{inicio:'VISÃO GERAL',mercado:'MERCADO DE USADOS',stand:'O MEU STAND'}[name]||'VISÃO GERAL');window.scrollTo(0,0);}

  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.view){switchView(button.dataset.view);return;}
    if(button.dataset.goto){switchView(button.dataset.goto);return;}
    if(button.id==='advance-day'){advanceDay();return;}
    if(button.dataset.buy){buyCar(button.dataset.buy);return;}
    if(button.dataset.service){serviceCar(button.dataset.service);return;}
    if(button.dataset.list){listCar(button.dataset.list);return;}
    if(button.dataset.acceptOffer){acceptOffer(button.dataset.acceptOffer);return;}
    if(button.dataset.rejectOffer){rejectOffer(button.dataset.rejectOffer);return;}
    if(button.id==='reset-button'){id('modal-backdrop').hidden=false;return;}
    if(button.id==='modal-close'||button.id==='modal-cancel'){id('modal-backdrop').hidden=true;return;}
    if(button.id==='modal-confirm'){game=freshGame();id('modal-backdrop').hidden=true;switchView('inicio');render();toast('Novo negócio iniciado.');}
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')id('modal-backdrop').hidden=true;if(event.key==='Enter'&&event.target.matches('.price-input')){event.preventDefault();listCar(event.target.dataset.price);}});
  document.addEventListener('change',event=>{if(!event.target.matches('.price-input'))return;const c=game.inventory.find(x=>x.id===event.target.dataset.price),value=Number(event.target.value);if(c&&Number.isFinite(value)&&value>0){c.asking=Math.round(value);save();}});
  render();
})();
