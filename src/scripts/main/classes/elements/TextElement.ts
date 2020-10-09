import { BaseElement } from "./BaseElement";
import { types } from "./../../utils/TextUtils";

export class TextElement extends BaseElement {
    id: number;
    constructor(type: string, value: string) {
        const id = BaseElement.generateUniqueID();

        super(id, type, value);

        this.id = id;
    }

    create(): HTMLElement {
        const count = BaseElement.countElementsByClass("text");

        const parent = {
            type: types.DIV,
            id: `${this.type}-${count}-${this.id}`,
            classes: ["text"],
            controls: ["remove", "edit", "input-area"],
        };

        const children = [
            {
                type: types.PARAGRAPH,
                classes: ["post-text"],
                value: this.value,
            },
        ];

        return this.render(parent, children);
    }
}
