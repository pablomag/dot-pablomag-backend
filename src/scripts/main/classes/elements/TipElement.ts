import { BaseElement } from "./BaseElement";
import { types } from "./../../utils/TextUtils";

export class TipElement extends BaseElement {
    id: number;
    constructor(type: string, value: string) {
        const id = BaseElement.generateUniqueID();

        super(id, type, value);

        this.id = id;
    }

    create(): HTMLElement {
        if (BaseElement.elementExists(this.type)) return new HTMLElement();

        const count = BaseElement.countElementsByClass("post-note");

        const parent = {
            type: types.DIV,
            id: `${this.type}-${count}-${this.id}`,
            classes: ["tip"],
            controls: ["remove", "edit", "input"],
        };

        const children = [
            {
                type: types.PARAGRAPH,
                classes: ["post-note"],
                value: this.value,
            },
        ];

        return this.render(parent, children);
    }
}
