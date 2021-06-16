const template = document.createElement("template");

const thumbStyles = `
  background-color: var(--thumb-background-color);
  background-image: var(--thumb-background-image);
  background-size: 90%;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: var(--thumb-radius);
  border: var(--thumb-border-size) var(--thumb-border-color) solid;
  color: var(--thumb-border-color);
  width: var(--thumb-size);
  height: var(--thumb-size);
`;

const thumbFocusStyles = `
  box-shadow: 0px 0px 0px var(--focus-width) var(--focus-color);
`;


const thumbSvgWidth = 4;

template.innerHTML = /*html*/`
  <style>
    :host {
      --exposure: 50%;

      --thumb-background-color: hsla(0, 0%, 100%, 0.85);
      --thumb-background-image: url('data:image/svg+xml;utf8,<svg viewbox="0 0 60 60"  width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="${thumbSvgWidth}" d="M20 20 L10 30 L20 40"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="${thumbSvgWidth}" d="M40 20 L50 30 L40 40"/></svg>');
      --thumb-size: 3em;
      --thumb-radius: 50%;
      --thumb-border-color: hsla(0, 0%, 0%, 0.9);
      --thumb-border-size: 2px;

      --focus-width: var(--thumb-border-size);
      --focus-color: hsl(200, 100%, 80%);

      --border-width: 2px;
      --border-color: hsla(0, 0%, 0%, 0.9);

      display: flex;
      flex-direction: column;
      margin: 0;
      overflow: hidden;
      position: relative;
    }

    ::slotted(img) {
      width: 100%;
    }

    ::slotted([slot='image-2']) {
      clip-path: polygon(
        calc(var(--exposure) + var(--border-width)/2) 0, 
        100% 0, 
        100% 100%, 
        calc(var(--exposure) + var(--border-width)/2) 100%);
    }

    slot {
      display: block;
      width: 100%;
    }

    slot[name='image-2'] {
      position: absolute;
      top:0;
      filter: drop-shadow(calc(var(--border-width) * -1) 0 0 var(--border-color));
    }

    .visually-hidden {
      border: 0; 
      clip: rect(0 0 0 0); 
      clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
      -webkit-clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
      height: 1px; 
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
      white-space: nowrap;
    }

    label {
      align-items: stretch;
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    input {
      cursor: col-resize;
      margin: 0 calc(var(--thumb-size) / -2);
      width: calc(100% + var(--thumb-size));
      appearance: none;
      -webkit-appearance: none;
      height: 100%;
      background: none;
      border: none;
    }

    ::-moz-range-thumb {
      ${thumbStyles}
    }

    ::-webkit-slider-thumb {
      -webkit-appearance: none;
      ${thumbStyles}
    }

    input:focus {
      box-shadow: 0px 0px 0px var(--focus-width) var(--focus-color);
    }

    input:focus::-moz-range-thumb {
      ${thumbFocusStyles}
    }

    input:focus::-webkit-slider-thumb {
      ${thumbFocusStyles}
    }
  </style>

  <slot name="image-1"></slot>
  <slot name="image-2"></slot>
  
  <label>
    <span class="visually-hidden js-label-text">
      Control how much of each overlapping image is shown. 
      0 means the first image is completely hidden and the second image is fully visible.
      100 means the first image is fully visible and the second image is completely hidden.
      50 means both images are half-shown, half-hidden.
    </span>
    <input type="range" value="50" min="0" max="100"/>
  </label>
`;

class ImageCompare extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector("input").addEventListener('input', this.update);

    const customLabel = this.shadowRoot.host.getAttribute('label-text');
    if(customLabel) {
      this.shadowRoot.querySelector(".js-label-text").textContent = customLabel;
    }
  }

  update = (e) => {
    this.shadowRoot.host.style.setProperty('--exposure', `${e.target.value}%`)
  }
}

customElements.define("image-compare", ImageCompare);
