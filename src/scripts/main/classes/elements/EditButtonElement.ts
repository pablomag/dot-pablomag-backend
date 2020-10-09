import { ControlsElement } from "./ControlsElement";
import { types } from "./../../utils/TextUtils";

export class EditButtonElement extends ControlsElement {
    create() {
        const button = document.createElement(types.DIV);

        button.classList.add(
            "fas",
            "fa-pen-square",
            "button-element",
            "button-element__edit"
        );
        button.addEventListener("click", this.editElement, false);
        button.id = `button-edit-${this._id}`;

        return button;
    }
}
