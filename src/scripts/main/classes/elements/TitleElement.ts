import { BaseElement } from "./BaseElement";
import { types } from "./../../utils/TextUtils";

export class TitleElement extends BaseElement {
    id: number;
    constructor(type: string, value: string) {
        const id = BaseElement.generateUniqueID();

        super(id, type, value);

        this.id = id;
    }

    create(): HTMLElement | null {
        if (BaseElement.elementExists("sticky-title")) {
            return null;
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
