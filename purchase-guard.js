(function(){
  'use strict';
  var GAME_KEY='garagem-simulador-v1',toastTimer;
  function readGame(){try{return JSON.parse(localStorage.getItem(GAME_KEY));}catch(error){return null;}}
  function notify(message){
    var node=document.getElementById('toast');
    if(!node)return;
    node.textContent=message;
    node.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer=window.setTimeout(function(){node.classList.remove('show');},2600);
  }
  document.addEventListener('click',function(event){
    var button=event.target;
    while(button&&button!==document&&String(button.tagName).toLowerCase()!=='button')button=button.parentNode;
    if(!button||!button.hasAttribute('data-buy'))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var id=button.getAttribute('data-buy'),game=readGame();
    if(!game||!Array.isArray(game.market)||!Array.isArray(game.inventory)){
      notify('Não foi possível carregar o jogo. Atualiza a página e tenta novamente.');
      return;
    }
    var index=game.market.findIndex(function(car){return String(car.id)===String(id)&&!car.auction;});
    if(index<0){notify('Este carro já não está disponível. Atualiza o mercado.');return;}
    var car=game.market[index],price=Number(car.buy);
    if(!isFinite(price)||price<0){notify('O preço deste carro é inválido.');return;}
    if(Number(game.cash)<price){notify('Capital insuficiente para comprar este carro.');return;}
    button.disabled=true;
    game.cash=Number(game.cash)-price;
    game.inventory.push(car);
    game.market.splice(index,1);
    if(!Array.isArray(game.activity))game.activity=[];
    game.activity.unshift({text:'Compraste '+car.model+' por '+new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(price)+'.',day:game.day});
    game.activity=game.activity.slice(0,12);
    try{localStorage.setItem(GAME_KEY,JSON.stringify(game));}
    catch(error){button.disabled=false;notify('Não foi possível guardar a compra. Verifica o espaço disponível no navegador.');return;}
    notify(car.model+' comprado e guardado no teu stand.');
    // Reload once after the confirmation; the toast timeout is independent so it cannot remain stuck.
    window.setTimeout(function(){window.location.reload();},1500);
  },true);
})();
