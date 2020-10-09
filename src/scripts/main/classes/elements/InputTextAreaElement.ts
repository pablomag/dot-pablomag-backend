import { BaseElement } from "./BaseElement";
import { ControlsElement } from "./ControlsElement";
import { types } from "./../../utils/TextUtils";

export class InputTextAreaElement extends ControlsElement {
    constructor(id: number, type: string, value: string) {
        super(id, type, value);
    }

    create() {
        const count = BaseElement.countElementsByClass(this.type);
        const input: any = document.createElement(types.TEXTAREA);

        input.value = this.value;
        input.style.display = "none";
        input.classList.add("input", "textarea");
        input.id = `input-${this.type}-${count}-${this._id}`;

        input.setAttribute("draggable", "false");
        input.addEventListener("blur", this.hideElement, false);
        input.addEventListener("keydown", this.preventKeys, false);
        input.addEventListener("keyup", this.refreshElement, false);

        return input;
    }
}
