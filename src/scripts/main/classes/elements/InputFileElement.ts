import { ControlsElement } from "./ControlsElement";
import { types } from "./../../utils/TextUtils";

export class InputFileElement extends ControlsElement {
    constructor(id: number, type: string, value: string) {
        super(id, type, value);
    }

    create() {
        const input: any = document.createElement(types.INPUT);

        input.value = this.value;
        input.type = "file";
        input.style.display = "none";
        input.classList.add("input", "input--file");
        input.accept = "image/png, image/jpeg";
        input.id = `input-${this.type}-${this._id}`;

        input.setAttribute("draggable", "false");
        input.addEventListener("blur", this.hideElement, false);
        input.addEventListener("keydown", this.preventKeys, false);
        input.addEventListener("keyup", this.refreshElement, false);
        input.addEventListener("change", this.uploadFile, false);

        return input;
    }
}
