(function(){
  'use strict';
  var defaults={name:'FERCHOSTER',make:'Hyundai',model:'Santa Fe Sport',year:'2017',color:'Azul',time:'24'};
  var prefs=loadPrefs();
  var currentPage='home';
  var videoUrl=null,audioUrls=[],selectedAudio=-1;
  function $(id){return document.getElementById(id)}
  function loadPrefs(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem('ferchesterPrefs')||'{}'))}catch(e){return Object.assign({},defaults)}}
  function savePrefs(){try{localStorage.setItem('ferchesterPrefs',JSON.stringify(prefs))}catch(e){}}
  function vehicleText(){return (prefs.make+' '+prefs.model+' '+prefs.year).toUpperCase()}
  function updateBrand(){
    $('hero-name').innerHTML=escapeHTML(prefs.name)+'<span>.</span>';
    $('top-title').textContent=prefs.name;
    $('vehicle-label').innerHTML=escapeHTML((prefs.make+' '+prefs.model).toUpperCase())+' <strong>'+escapeHTML(prefs.year)+'</strong>';
    $('home-vehicle').textContent=vehicleText();
    document.title=prefs.name+' CAR';
    document.documentElement.style.setProperty('--blue',prefs.color==='Azul'?'#168bff':prefs.color==='Rojo'?'#ff4058':prefs.color==='Verde'?'#21d6a1':prefs.color==='Gris'?'#8c9caf':'#f5f8ff');
  }
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function go(page){
    var target=$('page-'+page);if(!target)return;
    currentPage=page;
    document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});target.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-page')===page)});
    var titles={home:prefs.name,youtube:'YouTube',videos:'Mis videos',music:'Música',maps:'Mapas',apps:'Aplicaciones',settings:'Ajustes'};$('top-title').textContent=titles[page]||prefs.name;
    window.scrollTo(0,0);
  }
  document.addEventListener('click',function(e){var b=e.target.closest('[data-page],[data-go]');if(!b)return;var p=b.getAttribute('data-page')||b.getAttribute('data-go');if(p){e.preventDefault();go(p)}});
  function updateClock(){var d=new Date(),opts={hour:'2-digit',minute:'2-digit',hour12:prefs.time==='12'};$('clock').textContent=d.toLocaleTimeString('es-GT',opts)}
  function populateSettings(){ $('setting-name').value=prefs.name;$('setting-make').value=prefs.make;$('setting-model').value=prefs.model;$('setting-year').value=prefs.year;$('setting-color').value=prefs.color;$('setting-time').value=prefs.time; }
  $('settings-form').addEventListener('submit',function(e){e.preventDefault();prefs={name:$('setting-name').value.trim()||defaults.name,make:$('setting-make').value.trim()||defaults.make,model:$('setting-model').value.trim()||defaults.model,year:$('setting-year').value||defaults.year,color:$('setting-color').value,time:$('setting-time').value};savePrefs();updateBrand();updateClock();$('settings-message').textContent='Cambios guardados en este navegador.';setTimeout(function(){$('settings-message').textContent=''},3000)});
  $('reset-settings').addEventListener('click',function(){prefs=Object.assign({},defaults);savePrefs();populateSettings();updateBrand();updateClock();$('settings-message').textContent='Configuración original restaurada.'});
  $('youtube-form').addEventListener('submit',function(e){e.preventDefault();var url=$('youtube-url').value.trim();var result=$('youtube-result');var id='';try{var u=new URL(url);if(u.hostname.indexOf('youtu.be')!==-1)id=u.pathname.slice(1);else if(u.hostname.indexOf('youtube.com')!==-1){id=u.searchParams.get('v')||((u.pathname.indexOf('/embed/')===0)?u.pathname.split('/')[2]:'')}}catch(err){}
    if(!id){result.className='media-stage empty-stage';result.innerHTML='<span class="stage-symbol">!</span><strong>Enlace no reconocido</strong><span>Pega una URL válida de YouTube.</span>';return}
    var frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id);frame.title='Reproductor de YouTube';frame.setAttribute('allow','accelerometer; autoplay; encrypted-media; picture-in-picture');frame.setAttribute('allowfullscreen','');frame.style.cssText='width:100%;aspect-ratio:16/9;border:0;border-radius:12px;background:#000';result.className='';result.innerHTML='';result.appendChild(frame);
    var open=document.createElement('a');open.className='secondary-btn';open.style.marginTop='12px';open.href='https://www.youtube.com/watch?v='+encodeURIComponent(id);open.target='_blank';open.rel='noopener';open.textContent='ABRIR EN YOUTUBE ↗';result.appendChild(open);
  });
  $('open-youtube').addEventListener('click',function(){window.open('https://www.youtube.com/','_blank','noopener')});
  $('video-file').addEventListener('change',function(e){var f=e.target.files&&e.target.files[0];if(!f)return;if(videoUrl)URL.revokeObjectURL(videoUrl);videoUrl=URL.createObjectURL(f);var player=$('local-video');player.src=videoUrl;player.hidden=false;$('video-empty').hidden=true;$('video-filename').textContent=f.name;player.load()});
  $('audio-file').addEventListener('change',function(e){var files=Array.prototype.slice.call(e.target.files||[]);if(!files.length)return;audioUrls.forEach(function(x){URL.revokeObjectURL(x.url)});audioUrls=files.map(function(f){return {file:f,url:URL.createObjectURL(f)}});selectedAudio=0;renderTracks();playTrack(0)});
  function renderTracks(){var list=$('track-list');list.innerHTML='';$('audio-count').textContent=audioUrls.length+' archivo(s)';audioUrls.forEach(function(item,i){var row=document.createElement('button');row.type='button';row.className='track-row'+(i===selectedAudio?' selected':'');var num=document.createElement('span');num.className='track-number';num.textContent=(i+1).toString().padStart(2,'0');var meta=document.createElement('span');meta.style.minWidth='0';var name=document.createElement('div');name.className='track-name';name.textContent=item.file.name;var type=document.createElement('div');type.className='track-type';type.textContent='ARCHIVO DE AUDIO';meta.appendChild(name);meta.appendChild(type);row.appendChild(num);row.appendChild(meta);row.addEventListener('click',function(){playTrack(i)});list.appendChild(row)})}
  function playTrack(i){if(i<0||i>=audioUrls.length)return;selectedAudio=i;$('audio-player').src=audioUrls[i].url;$('audio-title').textContent=audioUrls[i].file.name;renderTracks();var promise=$('audio-player').play();if(promise&&promise.catch)promise.catch(function(){})}
  $('audio-player').addEventListener('ended',function(){if(selectedAudio+1<audioUrls.length)playTrack(selectedAudio+1)});
  populateSettings();updateBrand();updateClock();setInterval(updateClock,15000);
})();
