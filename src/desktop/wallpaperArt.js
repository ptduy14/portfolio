// Self-designed wallpaper set — abstract SVG art encoded as data URIs.
// Self-contained (no network / no CSP issues), license-free (original), lightweight.
// D12: wallpaper is desktop content → gradients/shapes allowed here (UI chrome stays flat per D9).

const toCss = (svg) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}") center / cover no-repeat`;

// concentric rings, generated once
const rings = (() => {
  let s = "";
  for (let r = 60; r < 1100; r += 46) s += `<circle cx='1260' cy='250' r='${r}'/>`;
  return s;
})();

const ART = {
  aurora: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'><rect width='1600' height='1000' fill='#0e1320'/><defs><filter id='f' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='110'/></filter></defs><g filter='url(#f)'><circle cx='380' cy='280' r='300' fill='#3584e4' opacity='0.55'/><circle cx='1180' cy='240' r='280' fill='#9141ac' opacity='0.5'/><circle cx='820' cy='860' r='340' fill='#1f9ea8' opacity='0.45'/></g></svg>`,

  blobs: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'><rect width='1600' height='1000' fill='#141a2b'/><defs><filter id='f' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='95'/></filter></defs><g filter='url(#f)'><ellipse cx='300' cy='760' rx='380' ry='300' fill='#26507a' opacity='0.6'/><ellipse cx='1260' cy='400' rx='420' ry='340' fill='#5b3a7e' opacity='0.55'/><ellipse cx='820' cy='120' rx='300' ry='240' fill='#1d7a86' opacity='0.5'/></g></svg>`,

  topographic: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'><rect width='1600' height='1000' fill='#0f1623'/><g fill='none' stroke='#2b466a' stroke-width='2' opacity='0.55'>${rings}</g></svg>`,

  lowpoly: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'><rect width='1600' height='1000' fill='#121826'/><polygon points='0,0 820,0 0,620' fill='#1a2740'/><polygon points='820,0 1600,0 1600,520' fill='#16203a'/><polygon points='0,620 0,1000 720,1000' fill='#1d2b48'/><polygon points='1600,520 1600,1000 740,1000' fill='#202d4d'/><polygon points='820,0 1600,520 740,1000 0,620' fill='#18233c'/></svg>`,

  waves: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#0f2030'/><stop offset='1' stop-color='#16324b'/></linearGradient></defs><rect width='1600' height='1000' fill='url(#g)'/><path d='M0,640 C420,540 1180,780 1600,600 L1600,1000 L0,1000 Z' fill='#1c466a' opacity='0.4'/><path d='M0,760 C480,680 1120,900 1600,720 L1600,1000 L0,1000 Z' fill='#22577a' opacity='0.5'/></svg>`,

  mesh: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'><rect width='1600' height='1000' fill='#121622'/><defs><pattern id='p' width='42' height='42' patternUnits='userSpaceOnUse'><circle cx='4' cy='4' r='2' fill='#2a3956'/></pattern><radialGradient id='v' cx='50%' cy='40%' r='75%'><stop offset='0' stop-color='#3584e4' stop-opacity='0.18'/><stop offset='1' stop-color='#3584e4' stop-opacity='0'/></radialGradient></defs><rect width='1600' height='1000' fill='url(#p)'/><rect width='1600' height='1000' fill='url(#v)'/></svg>`,
};

export const WALLPAPERS = [
  { id: "aurora", name: "Aurora", css: toCss(ART.aurora) },
  { id: "blobs", name: "Blobs", css: toCss(ART.blobs) },
  { id: "topographic", name: "Topographic", css: toCss(ART.topographic) },
  { id: "lowpoly", name: "Low Poly", css: toCss(ART.lowpoly) },
  { id: "waves", name: "Waves", css: toCss(ART.waves) },
  { id: "mesh", name: "Mesh", css: toCss(ART.mesh) },
];
