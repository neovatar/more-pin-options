import { MODULE_ID, DEFAULT_FLAGS } from "./const.js";
import { addOption, getDefault, hexToRgba } from "./utils.js";

Hooks.on("renderNoteConfig", (noteConfig, html, data, options) => {
    const iconTintGroup = html.querySelector("[name='texture.tint']").closest(".form-group");
    const bgOption = document.createElement("div");
    bgOption.classList.add("form-group");
    iconTintGroup.parentElement.appendChild(addOption("Show Background?", `
      <input type="checkbox" name="flags.${MODULE_ID}.hasBackground" data-dtype="Boolean" ${getDefault(noteConfig, "hasBackground") ? "checked" : ""}>
    `));

    const labelGroup = html.querySelector("[name='textColor']").closest(".form-group");
    const dropShadowColorOption = document.createElement("div");
    dropShadowColorOption.classList.add("form-group");
    labelGroup.parentElement.appendChild(addOption("Always Show Tooltip?", `
      <input type="checkbox" name="flags.${MODULE_ID}.alwaysShowTooltip" data-dtype="Boolean" ${getDefault(noteConfig, "alwaysShowTooltip") ? "checked" : ""}>
    `));
    labelGroup.parentElement.appendChild(addOption("Drop Shadow Enabled?", `
      <input type="checkbox" name="flags.${MODULE_ID}.dropShadowEnabled" data-dtype="Boolean" ${getDefault(noteConfig, "dropShadowEnabled") ? "checked" : ""}>
    `));
    labelGroup.parentElement.appendChild(addOption("Drop Shadow Color", `
      <input type="color" name="flags.${MODULE_ID}.dropShadowColor" value="${getDefault(noteConfig, "dropShadowColor")}">
    `));
    labelGroup.parentElement.appendChild(addOption("Drop Shadow Alpha", `
      <input type="range" name="flags.${MODULE_ID}.dropShadowAlpha" value="${getDefault(noteConfig, "dropShadowAlpha")}" min="0" max="1" step="0.01">
    `));
    labelGroup.parentElement.appendChild(addOption("Drop Shadow Distance", `
      <input type="number" name="flags.${MODULE_ID}.dropShadowDistance" value="${getDefault(noteConfig, "dropShadowDistance")}" min="0" step="1">
    `));
    labelGroup.parentElement.appendChild(addOption("Drop Shadow Blur", `
      <input type="number" name="flags.${MODULE_ID}.dropShadowBlur" value="${getDefault(noteConfig, "dropShadowBlur")}" min="0" step="1">
    `));
    labelGroup.parentElement.appendChild(addOption("Drop Shadow Angle", `
      <input type="number" name="flags.${MODULE_ID}.dropShadowAngle" value="${getDefault(noteConfig, "dropShadowAngle")}" min="0" max="360" step="1">
    `));
    labelGroup.parentElement.appendChild(addOption("Stroke Color", `
      <input type="color" name="flags.${MODULE_ID}.strokeColor" value="${getDefault(noteConfig, "strokeColor")}">
    `));
    labelGroup.parentElement.appendChild(addOption("Stroke Alpha", `
      <input type="range" name="flags.${MODULE_ID}.strokeAlpha" value="${getDefault(noteConfig, "strokeAlpha")}" min="0" max="1" step="0.01">
    `));
    labelGroup.parentElement.appendChild(addOption("Stroke Thickness", `
      <input type="number" name="flags.${MODULE_ID}.strokeThickness" value="${getDefault(noteConfig, "strokeThickness")}" min="0" step="1">
    `));

    noteConfig.setPosition({ height: "auto" });
});

Hooks.once("canvasInit", () => {
  libWrapper.register("more-pin-options", "foundry.canvas.placeables.Note.prototype._applyRenderFlags", MorePinOptions._applyRenderFlags, "MIXED");
  libWrapper.register("more-pin-options", "foundry.canvas.placeables.Note.prototype._getTextStyle", MorePinOptions._getTextStyle, "MIXED");
  libWrapper.register("more-pin-options", "foundry.canvas.placeables.Note.prototype._drawControlIcon", MorePinOptions._drawControlIcon, "MIXED");
  libWrapper.register("more-pin-options", "foundry.canvas.placeables.Note.prototype._onHoverIn", MorePinOptions._onHoverIn, "MIXED");
  libWrapper.register("more-pin-options", "foundry.canvas.placeables.Note.prototype._onHoverOut", MorePinOptions._onHoverOut, "MIXED");
  console.log("more-pin-options | canvas init | libWrapper registered");
});

export class MorePinOptions {
  static _applyRenderFlags(wrapped, ...args) {
    let result = wrapped(...args);
    if (this.document.getFlag(MODULE_ID, "alwaysShowTooltip") ?? DEFAULT_FLAGS.alwaysShowTooltip) {
      this.tooltip.visible = true;
    }
    return result;
  }

  static _getTextStyle(wrapped, ...args) {
    const style = wrapped(...args);
    if (this.document.getFlag(MODULE_ID, "dropShadowEnabled") ?? DEFAULT_FLAGS.dropShadowEnabled) {
      style.dropShadowColor = this.document.getFlag(MODULE_ID, "dropShadowColor") ?? DEFAULT_FLAGS.dropShadowColor;
      style.dropShadowDistance = this.document.getFlag(MODULE_ID, "dropShadowDistance") ?? DEFAULT_FLAGS.dropShadowDistance;
      style.dropShadowAlpha = this.document.getFlag(MODULE_ID, "dropShadowAlpha") ?? DEFAULT_FLAGS.dropShadowAlpha;
      style.dropShadowBlur = this.document.getFlag(MODULE_ID, "dropShadowBlur") ?? DEFAULT_FLAGS.dropShadowBlur;
      style.dropShadowAngle = (this.document.getFlag(MODULE_ID, "dropShadowAngle") ?? DEFAULT_FLAGS.dropShadowAngle) * (Math.PI / 180); // Convert degrees to radians
    }
    style.stroke = hexToRgba(this.document.getFlag(MODULE_ID, "strokeColor") || (Color.from(style.fill || "#ffffff").hsv[2] > 0.6 ? "#000000" : "#FFFFFF"), this.document.getFlag(MODULE_ID, "strokeAlpha") ?? 1);
    style.strokeThickness = this.document.getFlag(MODULE_ID, "strokeThickness") ?? Math.max(Math.round(style.fontSize / 32), 4);
    return style;
  }

  static _drawControlIcon(wrapped, ...args) {
    const icon = wrapped(...args);
    const hasBackground = this.document.getFlag(MODULE_ID, "hasBackground") ?? DEFAULT_FLAGS.hasBackground;
    icon.bg.alpha = hasBackground ? 0.4 : 0;
    icon.border.alpha = hasBackground ? 1 : 0;
    return icon;
  }

  static _onHoverIn(wrapped, ...args) {
    const result = wrapped(...args);
    const hasBackground = this.document.getFlag(MODULE_ID, "hasBackground") ?? DEFAULT_FLAGS.hasBackground;
    if (!hasBackground) {
        this.controlIcon.border.alpha = 1;
    }
    return result;
  }

  static _onHoverOut(wrapped, ...args) {
    const result = wrapped(...args);
    const hasBackground = this.document.getFlag(MODULE_ID, "hasBackground") ?? DEFAULT_FLAGS.hasBackground;
    if (!hasBackground) {
        this.controlIcon.border.alpha = 0;
    }
    return result;
  }
}
