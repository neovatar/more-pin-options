import { DEFAULT_FLAGS } from "./const.js";

export function addOption(label, inputHTML) {
  const option = document.createElement("div");
  option.classList.add("form-group");
  option.innerHTML = `
    <label>${label}</label>
    <div class="form-fields">${inputHTML}</div>
  `;
  return option;
}

export function getDefault(noteConfig, flagName) {  
  return noteConfig.document.getFlag("more-pin-options", flagName) ?? DEFAULT_FLAGS[flagName];
}

export function hexToRgba(hex, opacity = 1) {
    let c = hex.replace(/^#/, "");

    if (c.length === 3) {
        c = c.split("").map(ch => ch + ch).join("");
    }

    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}