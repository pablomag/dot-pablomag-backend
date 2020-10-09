import { ControlsElement } from "./ControlsElement";
import { types } from "./../../utils/TextUtils";

export class RemoveButtonElement extends ControlsElement {
    create(): HTMLElement {
        const button = document.createElement(types.DIV);

        button.classList.add(
            "fas",
            "fa-minus-square",
            "button-element",
            "button-element__remove"
        );
        button.addEventListener("click", this.removeElement, false);

        return button;
    }
}
