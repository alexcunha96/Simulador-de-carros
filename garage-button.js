(function(){
  'use strict';
  var GAME_KEY='garagem-simulador-v1',FEATURE_KEY='garagem-career-v1';
  function read(key,fallback){try{var value=JSON.parse(localStorage.getItem(key));return value&&typeof value==='object'?value:fallback;}catch(error){return fallback;}}
  function saveBoth(game,feature){
    var oldGame=localStorage.getItem(GAME_KEY),oldFeature=localStorage.getItem(FEATURE_KEY);
    try{
      localStorage.setItem(FEATURE_KEY,JSON.stringify(feature));
      localStorage.setItem(GAME_KEY,JSON.stringify(game));
      return true;
    }catch(error){
      try{if(oldGame===null)localStorage.removeItem(GAME_KEY);else localStorage.setItem(GAME_KEY,oldGame);}catch(ignored){}
      try{if(oldFeature===null)localStorage.removeItem(FEATURE_KEY);else localStorage.setItem(FEATURE_KEY,oldFeature);}catch(ignored){}
      return false;
    }
  }
  function ensureButtons(){
    var list=document.getElementById('stand-list');
    if(!list)return;
    list.querySelectorAll('.stand-card').forEach(function(card){
      var normalButton=card.querySelector('[data-list]');
      if(!normalButton)return;
      var id=normalButton.getAttribute('data-list');
      var button=card.querySelector('[data-feature-store], [data-stand-to-private]');
      if(!button){
        button=document.createElement('button');
        button.type='button';
        button.className='private-store-button';
        (card.querySelector('.stand-card-body')||card).appendChild(button);
      }
      button.setAttribute('data-feature-store',id);
      button.setAttribute('data-stand-to-private',id);
      button.textContent='Guardar na garagem privada';
    });
  }
  document.addEventListener('click',function(event){
    var button=event.target;
    while(button&&button!==document&&String(button.tagName).toLowerCase()!=='button')button=button.parentNode;
    if(!button)return;
    var id=button.getAttribute('data-stand-to-private')||button.getAttribute('data-feature-store');
    if(!id)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var game=read(GAME_KEY,null),feature=read(FEATURE_KEY,{version:1,privateCars:[],achievements:{},events:[],lifetime:{}});
    if(!game||!Array.isArray(game.inventory))return;
    if(!Array.isArray(feature.privateCars))feature.privateCars=[];
    var index=game.inventory.findIndex(function(car){return String(car.id)===String(id);});
    if(index<0)return;
    var car=game.inventory[index];
    if(feature.privateCars.some(function(item){return String(item.id)===String(id);}))return;
    var nextGame=JSON.parse(JSON.stringify(game));
    var nextFeature=JSON.parse(JSON.stringify(feature));
    nextGame.inventory=nextGame.inventory.filter(function(item){return String(item.id)!==String(id);});
    nextGame.offers=(Array.isArray(nextGame.offers)?nextGame.offers:[]).filter(function(offer){return String(offer.carId)!==String(id);});
    car.listed=false;
    car.asking=car.market;
    nextFeature.privateCars.unshift(car);
    if(!saveBoth(nextGame,nextFeature)){
      var toast=document.getElementById('toast');
      if(toast){toast.textContent='Não foi possível guardar o carro. Tenta novamente.';toast.classList.add('show');}
      return;
    }
    window.location.href='#view-garagem';
    window.location.reload();
  },true);
  var list=document.getElementById('stand-list');
  if(list)new MutationObserver(ensureButtons).observe(list,{childList:true,subtree:true});
  ensureButtons();
  window.setInterval(ensureButtons,1000);
})();
