(() => {
  'use strict';
  const SAVE_KEY = 'garagem-simulador-v1';
  const STARTING_CASH = 35000;
  const GOAL = 100000;
  const catalog = [
    {model:'Renault Clio', year:2018, km:86400, fuel:'Gasolina', emoji:'🚗', market:12900, buy:9400, condition:72, color:'Azul', demand:1.08},
    {model:'Volkswagen Golf', year:2017, km:112000, fuel:'Gasóleo', emoji:'🚙', market:17400, buy:13100, condition:68, color:'Cinza', demand:1.12},
    {model:'Peugeot 208', year:2020, km:57300, fuel:'Gasolina', emoji:'🚘', market:15800, buy:11900, condition:81, color:'Branco', demand:1.1},
    {model:'Toyota Yaris', year:2019, km:69100, fuel:'Híbrido', emoji:'🚗', market:18900, buy:14800, condition:78, color:'Vermelho', demand:1.18},
    {model:'BMW Série 1', year:2016, km:128000, fuel:'Gasóleo', emoji:'🚘', market:21500, buy:16600, condition:64, color:'Preto', demand:1.02},
    {model:'Fiat 500', year:2021, km:39600, fuel:'Gasolina', emoji:'🚗', market:14900, buy:11200, condition:86, color:'Verde', demand:1.15},
    {model:'Seat Ibiza', year:2019, km:74800, fuel:'Gasolina', emoji:'🚙', market:14300, buy:10600, condition:74, color:'Prateado', demand:1.06},
    {model:'Dacia Duster', year:2018, km:95800, fuel:'Gasóleo', emoji:'🚙', market:16900, buy:12600, condition:71, color:'Laranja', demand:1.04},
    {model:'Mercedes Classe A', year:2017, km:103000, fuel:'Gasolina', emoji:'🚘', market:23900, buy:18700, condition:69, color:'Preto', demand:1.1},
    {model:'Citroën C3', year:2020, km:62400, fuel:'Gasolina', emoji:'🚗', market:13600, buy:9900, condition:79, color:'Azul', demand:1.05},
    {model:'Nissan Qashqai', year:2018, km:88700, fuel:'Gasóleo', emoji:'🚙', market:20500, buy:15700, condition:73, color:'Cinza', demand:1.12},
    {model:'Honda Civic', year:2017, km:92400, fuel:'Gasolina', emoji:'🚘', market:19200, buy:14500, condition:76, color:'Branco', demand:1.07}
  ];
  const € = n => new Intl.NumberFormat('pt-PT', {style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Math.round(n));
  const number = n => new Intl.NumberFormat('pt-PT').format(n);
  const safe = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const makeCar = (template, index) => ({...template, id:`car-${Date.now()}-${index}-${Math.random().toString(36).slice(2,7)}`, listed:false, asking:template.market, serviced:false});
  const newMarket = () => {
    const pool = [...catalog].sort(() => Math.random() - .5).slice(0,5);
    return pool.map((car,i) => makeCar({...car, buy:Math.max(5000, Math.round(car.buy * (0.94 + Math.random()*.12))), condition:Math.min(96,Math.max(52,car.condition + Math.round((Math.random()-.5)*16)))}, i));
  };
  const initial = () => ({cash:STARTING_CASH, day:1, reputation:50, profit:0, sales:0, inventory:[], market:newMarket(), activity:[{icon:'🏁', text:'O teu stand abriu as portas. Boa sorte, gerente!', day:1}]});
  let state;
  try { const saved = JSON.parse(localStorage.getItem(SAVE_KEY)); state = saved && saved.version===1 ? saved : initial(); } catch { state=initial(); }
  let toastTimer;
  const $ = id => document.getElementById(id);
  const setText = (id, value) => { const el=$(id); if(el) el.textContent=value; };
  function save(){ localStorage.setItem(SAVE_KEY,JSON.stringify({...state,version:1})); }
  function notify(message){ const el=$('toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2500); }
  function addActivity(icon,text){ state.activity.unshift({icon,text,day:state.day}); state.activity=state.activity.slice(0,8); }
  function carArt(car,tag=''){return `<div class="car-art">${tag?`<span class="${tag.className}">${tag.text}</span>`:''}<span>${car.emoji}</span><span class="condition-tag">${safe(car.color)}</span></div>`;}
  function render(){
    setText('cash-value',€(state.cash)); setText('stock-value',€(state.inventory.reduce((sum,c)=>sum+c.buy,0)));
    setText('stock-note',`${state.inventory.length} ${state.inventory.length===1?'carro':'carros'} no stand`);
    setText('reputation-value',state.reputation); $('reputation-bar').style.width=`${state.reputation}%`;
    setText('profit-value',`${state.profit<0?'-':''}${€(Math.abs(state.profit))}`); setText('sales-note',`${state.sales} ${state.sales===1?'venda realizada':'vendas realizadas'}`);
    setText('top-day',state.day); setText('stand-count',state.inventory.length); setText('nav-stock',state.inventory.length);
    const progress=Math.max(0,Math.min(100,(state.cash/GOAL)*100)); $('goal-progress').style.width=`${progress}%`; setText('goal-current',€(state.cash));
    setText('market-day',String(state.day).padStart(2,'0')); setText('market-count',state.market.length);
    setText('market-feature-title',state.market.length?`${state.market.length} carros em oportunidade`:'Novas oportunidades');
    setText('market-feature-copy',state.market.length?'Compara preços e escolhe o teu próximo negócio.':'Avança o dia para ver novas ofertas.');
    renderDashboardCars(); renderMarket(); renderStand(); renderActivity(); save();
  }
  function renderDashboardCars(){
    const el=$('dashboard-inventory');
    if(!state.inventory.length){el.innerHTML='<div class="empty-state"><div class="empty-illustration">🚘</div><strong>A montra ainda está vazia</strong><p>Compra o teu primeiro carro no mercado de usados.</p><button class="inline-link" data-goto="mercado">Encontrar oportunidades →</button></div>';return;}
    el.innerHTML=state.inventory.slice(0,3).map(car=>`<div class="car-row"><div class="car-thumb">${car.emoji}</div><div class="car-row-info"><strong>${safe(car.model)} ${car.year}</strong><span>${number(car.km)} km · ${car.listed?'À venda':'Ainda não anunciado'}</span></div><div class="row-price">${€(car.asking)}<small>preço anunciado</small></div></div>`).join('');
  }
  function renderMarket(){
    const el=$('market-list');
    if(!state.market.length){el.innerHTML='<div class="empty-market"><div style="font-size:30px">🔎</div><strong>Já viste todas as ofertas de hoje</strong><p>Avança um dia na visão geral para encontrar novos carros.</p><button class="inline-link" data-goto="inicio">Voltar à visão geral →</button></div>';return;}
    el.innerHTML=state.market.map(car=>{const savings=car.market-car.buy;return `<article class="market-card">${carArt(car,{className:'deal-tag',text:savings>2500?'BOM NEGÓCIO':'OPORTUNIDADE'})}<div class="market-card-body"><div class="market-car-title">${safe(car.model)} ${car.year}</div><div class="car-subtitle">${safe(car.color)} · Disponível para compra</div><div class="car-specs"><span>◷ ${number(car.km)} km</span><span>⛽ ${safe(car.fuel)}</span><span>✦ ${car.condition}%</span></div><div class="market-price-row"><div><small>PREÇO PEDIDO</small><div class="market-price">${€(car.buy)}</div></div><div><div class="market-value-label">VALOR DE MERCADO</div><div class="market-value">${€(car.market)}</div><div class="deal-difference">${savings>0?`+${€(savings)} potencial`:`${€(savings)} acima do valor`}</div></div></div><button class="buy-button" data-buy="${safe(car.id)}" ${state.cash<car.buy?'disabled':''}>${state.cash<car.buy?'Capital insuficiente':'Comprar carro'} <span>→</span></button></div></article>`;}).join('');
  }
  function renderStand(){
    const el=$('stand-list');
    if(!state.inventory.length){el.innerHTML='<div class="empty-market"><div style="font-size:30px">🏪</div><strong>O teu stand está pronto para receber carros</strong><p>Compra uma oportunidade no mercado e começa a construir o teu negócio.</p><button class="inline-link" data-goto="mercado">Explorar mercado →</button></div>';return;}
    el.innerHTML=state.inventory.map(car=>`<article class="stand-card">${carArt(car,{className:'deal-tag',text:car.listed?'À VENDA':'NO STOCK'})}<div class="stand-card-body"><div class="market-car-title">${safe(car.model)} ${car.year}</div><div class="stand-detail">${number(car.km)} km · ${safe(car.fuel)}</div><div class="condition-row"><span class="condition-label">Estado</span><div class="condition-bar"><span style="width:${car.condition}%;background:${car.condition<60?'#d87960':car.condition<75?'#d8a34d':'#70b77f'}"></span></div><span class="condition-number">${car.condition}%</span></div><div class="price-control"><label for="price-${safe(car.id)}">Preço de venda (mercado: ${€(car.market)})</label><div class="price-input-wrap"><span>€</span><input id="price-${safe(car.id)}" class="price-input" type="number" min="1" step="100" value="${Math.round(car.asking)}" data-price="${safe(car.id)}" aria-label="Preço de venda de ${safe(car.model)}"></div></div><div class="stand-actions"><button class="service-button" data-service="${safe(car.id)}" ${car.serviced||car.condition>=96||state.cash<650?'disabled':''}>${car.serviced?'✓ Revisto':car.condition>=96?'Estado excelente':`🔧 Revisão · ${€(650)}`}</button><button class="list-button" data-list="${safe(car.id)}">${car.listed?'Guardar preço':'Definir preço'}</button></div></div></article>`).join('');
  }
  function renderActivity(){
    const el=$('activity-list');
    if(!state.activity.length){el.innerHTML='<div class="activity-empty">Ainda não há atividade. Começa por explorar o mercado.</div>';return;}
    el.innerHTML=state.activity.slice(0,4).map(item=>`<div class="activity-row"><span class="activity-icon">${item.icon}</span><span class="activity-text">${safe(item.text)}</span><span class="activity-time">Dia ${item.day}</span></div>`).join('');
  }
  function buyCar(id){const index=state.market.findIndex(car=>car.id===id);if(index<0)return;const car=state.market[index];if(state.cash<car.buy){notify('Não tens capital suficiente para esta compra.');return;}state.cash-=car.buy;state.inventory.push({...car,asking:car.market,listed:false,serviced:false});state.market.splice(index,1);addActivity('🚘',`Compraste um ${car.model} por ${€(car.buy)}.`);notify(`${car.model} comprado! Agora prepara a venda.`);render();}
  function serviceCar(id){const car=state.inventory.find(c=>c.id===id);if(!car||car.serviced||car.condition>=96||state.cash<650)return;state.cash-=650;car.condition=Math.min(100,car.condition+20);car.market=Math.round(car.market*(1+0.025));car.serviced=true;addActivity('🔧',`Fizeste a revisão do ${car.model}. Estado melhorado para ${car.condition}%.`);notify('Revisão concluída. O carro está em melhor estado.');render();}
  function savePrice(id){const car=state.inventory.find(c=>c.id===id);const input=$(`price-${id}`);if(!car||!input)return;const price=Math.round(Number(input.value));if(!Number.isFinite(price)||price<1){notify('Introduz um preço de venda válido.');input.value=car.asking;return;}car.asking=price;car.listed=true;addActivity('🏷️',`Anunciaste o ${car.model} por ${€(price)}.`);notify(`${car.model} anunciado por ${€(price)}.`);render();}
  function advanceDay(){
    state.day++; const upkeep=350;state.cash-=upkeep;let messages=[`Custos diários do stand: ${€(upkeep)}.`];
    const saleCandidates=state.inventory.filter(c=>c.listed);
    for(const car of saleCandidates){
      const priceRatio=car.asking/car.market;
      const priceFactor=Math.max(.08,Math.min(1.15,1.15-(priceRatio-0.88)*2.1));
      const conditionFactor=.55+car.condition/180;
      const probability=Math.max(.035,Math.min(.78,.28*car.demand*priceFactor*conditionFactor*(.65+state.reputation/100)));
      if(Math.random()<probability){
        const offerFactor=.96+Math.random()*.055;const salePrice=Math.min(car.asking,Math.round(car.market*offerFactor));const margin=salePrice-car.buy-(car.serviced?650:0);
        state.cash+=salePrice;state.profit+=margin;state.sales++;state.reputation=Math.min(100,state.reputation+(margin>0?2:margin<0?-3:1));state.inventory=state.inventory.filter(item=>item.id!==car.id);
        const text=`Vendeste o ${car.model} por ${€(salePrice)}. ${margin>=0?`Lucro de ${€(margin)}!`:`Prejuízo de ${€(Math.abs(margin))}.`}`;addActivity('🤝',text);messages.push(`Venda concluída: ${car.model} por ${€(salePrice)}.`);
      }
    }
    if(Math.random()<.12){const bonus=250+Math.floor(Math.random()*401);state.cash+=bonus;state.reputation=Math.min(100,state.reputation+1);addActivity('⭐',`Um cliente satisfeito recomendou o teu stand. Bónus de ${€(bonus)}.`);messages.push(`Recomendação de cliente: recebeste ${€(bonus)}.`);}
    state.market=newMarket();
    if(state.cash<0){state.reputation=Math.max(0,state.reputation-2);messages.push('Atenção: o saldo está negativo. Vende stock ou reduz despesas.');}
    addActivity('📅',`Começou o dia ${state.day}. ${messages[0]}`);render();notify(messages.length>1?messages.slice(1).join(' '):`Dia ${state.day} começou. Novas ofertas no mercado.`);
  }
  function switchView(name){document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===`view-${name}`));document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===name));const titles={inicio:'VISÃO GERAL',mercado:'MERCADO DE USADOS',stand:'O MEU STAND'};setText('crumb-title',titles[name]||'VISÃO GERAL');window.scrollTo({top:0,behavior:'smooth'});}
  document.addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.view){switchView(target.dataset.view);return;}
    if(target.dataset.goto){switchView(target.dataset.goto);return;}
    if(target.id==='advance-day'){advanceDay();return;}
    if(target.dataset.buy){buyCar(target.dataset.buy);return;}
    if(target.dataset.service){serviceCar(target.dataset.service);return;}
    if(target.dataset.list){savePrice(target.dataset.list);return;}
    if(target.id==='reset-button'){$('modal-backdrop').hidden=false;return;}
    if(target.id==='modal-close'||target.id==='modal-cancel'){$('modal-backdrop').hidden=true;return;}
    if(target.id==='modal-confirm'){state=initial();$('modal-backdrop').hidden=true;switchView('inicio');render();notify('Novo negócio iniciado. Boa sorte!');}
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')$('modal-backdrop').hidden=true;if(event.key==='Enter'&&event.target.matches('.price-input')){event.preventDefault();const id=event.target.dataset.price;savePrice(id);}});
  document.addEventListener('change',event=>{if(event.target.matches('.price-input')){const car=state.inventory.find(c=>c.id===event.target.dataset.price);if(car&&Number(event.target.value)>0)car.asking=Math.round(Number(event.target.value));save();}});
  render();
})();
