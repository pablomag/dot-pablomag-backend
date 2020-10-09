import { BaseElement } from "./BaseElement";
import { types } from "./../../utils/TextUtils";

export class TitleElement extends BaseElement {
    id: number;
    constructor(type: string, value: string) {
        const id = BaseElement.generateUniqueID();

        super(id, type, value);

        this.id = id;
    }

    create(): HTMLElement {
        if (BaseElement.elementExists("sticky-title")) {
            return new HTMLElement();
        }

        const count = BaseElement.countElementsByClass("post-title");

        const parent = {
            type: types.DIV,
            id: `${this.type}-${count}-${this.id}`,
            classes: ["sticky-title", "stuck-title"],
            controls: ["remove", "edit", "input"],
        };

        const children = [
            {
                type: types.H1,
                classes: ["post-title"],
                value: this.value,
            },
        ];

        return this.render(parent, children);
    }
}
