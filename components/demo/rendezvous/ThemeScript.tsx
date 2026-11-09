/**
 * Script en tête de page, exécuté avant le premier affichage.
 *
 * 1. Pose le thème (choix mémorisé, sinon préférence du système),
 *    pour éviter tout éclair de couleur.
 * 2. Garde la page invisible le temps que les polices arrivent, une
 *    seconde au plus : le texte s'affiche d'emblée dans sa police
 *    définitive et rien ne se décale au chargement. Sans JavaScript,
 *    la page s'affiche normalement.
 */
const code = [
  "(function(){",
  "var d=document.documentElement;",
  "try{var s=localStorage.getItem('el-yasmine-theme');",
  "var m=window.matchMedia('(prefers-color-scheme: dark)').matches;",
  "d.setAttribute('data-theme',(s==='dark'||s==='light')?s:(m?'dark':'light'));}catch(e){}",
  "if(!document.fonts||!window.requestAnimationFrame)return;",
  "d.classList.add('attente-polices');",
  "var fait=false;",
  "function montrer(){if(!fait){fait=true;d.classList.remove('attente-polices');}}",
  "setTimeout(montrer,1000);",
  "function attendre(){requestAnimationFrame(function(){",
  "if(document.body){void document.body.offsetWidth;}",
  "document.fonts.ready.then(montrer,montrer);});}",
  "if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',attendre);}else{attendre();}",
  "})();",
].join("");

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
