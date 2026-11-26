(function(){
  'use strict';
  var GAME_KEY='garagem-simulador-v1',FEATURE_KEY='garagem-career-v1';
  function read(key,fallback){try{var value=JSON.parse(localStorage.getItem(key));return value&&typeof value==='object'?value:fallback;}catch(error){return fallback;}}
  function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(error){return false;}}
  function ensureButtons(){
    var list=document.getElementById('stand-list');
    if(!list)return;
    list.querySelectorAll('.stand-card').forEach(function(card){
      if(card.querySelector('[data-stand-to-private]'))return;
      var listButton=card.querySelector('[data-list]');
      if(!listButton)return;
      var id=listButton.getAttribute('data-list');
      var body=card.querySelector('.stand-card-body')||card;
      var button=document.createElement('button');
      button.type='button';
      button.className='private-store-button';
      button.setAttribute('data-stand-to-private',id);
      button.textContent='Guardar na garagem privada';
      body.appendChild(button);
    });
  }
  document.addEventListener('click',function(event){
    var button=event.target;
    while(button&&button!==document&&String(button.tagName).toLowerCase()!=='button')button=button.parentNode;
    if(!button||!button.hasAttribute('data-stand-to-private'))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var id=button.getAttribute('data-stand-to-private');
    var game=read(GAME_KEY,null),feature=read(FEATURE_KEY,{version:1,privateCars:[],achievements:{},events:[],lifetime:{}});
    if(!game||!Array.isArray(game.inventory))return;
    if(!Array.isArray(feature.privateCars))feature.privateCars=[];
    var index=game.inventory.findIndex(function(car){return car.id===id;});
    if(index<0)return;
    var car=game.inventory.splice(index,1)[0];
    car.listed=false;
    car.asking=car.market;
    feature.privateCars.unshift(car);
    game.offers=(Array.isArray(game.offers)?game.offers:[]).filter(function(offer){return offer.carId!==id;});
    if(!write(FEATURE_KEY,feature)||!write(GAME_KEY,game))return;
    window.location.reload();
  },true);
  var list=document.getElementById('stand-list');
  if(list)new MutationObserver(ensureButtons).observe(list,{childList:true,subtree:true});
  ensureButtons();
  window.setInterval(ensureButtons,1000);
})();
