(function () {
  'use strict';
  var GAME_KEY='garagem-simulador-v1';
  function readGame(){try{return JSON.parse(localStorage.getItem(GAME_KEY));}catch(e){return null;}}
  function writeGame(game){try{localStorage.setItem(GAME_KEY,JSON.stringify(game));}catch(e){}}
  function money(value){return new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Math.round(Number(value)||0));}
  function addLog(game,text){if(!Array.isArray(game.activity))game.activity=[];game.activity.unshift({icon:'🔨',text:text,day:game.day});game.activity=game.activity.slice(0,15);}
  function settleAuction(lot,game){
    var bid=Number(lot.playerBid)||0;
    if(bid<=0)return;
    var rivalBid=Number(lot.currentBid)||0;
    if(Math.random()<.65)rivalBid+=Number(lot.bidStep||500)*(1+Math.floor(Math.random()*Math.max(1,Number(lot.rivalCount)||1)));
    if(bid>=rivalBid){
      var price=Math.min(bid,rivalBid+(Number(lot.bidStep)||500));
      game.cash=(Number(game.cash)||0)+(bid-price);
      var car={};Object.keys(lot).forEach(function(key){car[key]=lot[key];});
      car.id='won-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);car.auction=false;car.buy=price;car.playerBid=0;car.currentBid=0;car.listed=false;car.asking=car.market;car.repairCost=0;car.serviced=false;
      game.inventory.push(car);
      addLog(game,'Ganhaste o leilão de '+car.model+' por '+money(price)+'.');
    }else{
      game.cash=(Number(game.cash)||0)+bid;
      addLog(game,'Não ganhaste o leilão de '+lot.model+'. A licitação de '+money(bid)+' foi devolvida.');
    }
  }
  document.addEventListener('click',function(event){
    var button=event.target;
    while(button&&button!==document&&String(button.tagName).toLowerCase()!=='button')button=button.parentNode;
    if(!button||button.id!=='advance-day')return;
    var before=readGame();
    if(!before||!Array.isArray(before.market))return;
    var pending=before.market.filter(function(lot){return lot.auction&&Number(lot.playerBid)>0;}).map(function(lot){var copy={};Object.keys(lot).forEach(function(key){copy[key]=lot[key];});return copy;});
    if(!pending.length)return;
    // Let the simulator advance and persist its new day first, then settle the lots that just closed.
    window.setTimeout(function(){
      var current=readGame();
      if(!current||!Array.isArray(current.inventory))return;
      pending.forEach(function(lot){settleAuction(lot,current);});
      writeGame(current);
      var toast=document.getElementById('toast');
      if(toast){toast.textContent='Leilões resolvidos: consulta a atividade e o teu stand.';toast.classList.add('show');}
      window.setTimeout(function(){window.location.reload();},180);
    },260);
  },true);
})();
