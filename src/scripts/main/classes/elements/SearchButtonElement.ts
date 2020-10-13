import { ControlsElement } from "./ControlsElement";
import { types } from "../../utils/TextUtils";

export class SearchButtonElement extends ControlsElement {
    create() {
        const button = document.createElement(types.DIV);

        button.classList.add(
            "fas",
            "fa-search",
            "button-element",
            "button-element__search"
        );
        button.addEventListener("click", this.searchElement, false);
        button.id = `button-search-${this._id}`;

        return button;
    }
}
