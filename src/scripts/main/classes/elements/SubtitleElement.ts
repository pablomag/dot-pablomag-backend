import { BaseElement } from "./BaseElement";
import { types } from "./../../utils/TextUtils";

export class SubtitleElement extends BaseElement {
    id: number;
    constructor(type: string, value: string) {
        const id = BaseElement.generateUniqueID();

        super(id, type, value);

        this.id = id;
    }

    create(): HTMLElement {
        const count = BaseElement.countElementsByClass("subtitle");

        const parent = {
            type: types.DIV,
            id: `${this.type}-${count}-${this.id}`,
            classes: ["subtitle"],
            controls: ["remove", "edit", "input"],
        };

        const children = [
            {
                type: types.PARAGRAPH,
                classes: ["post-subtitle"],
                value: this.value,
            },
        ];

        return this.render(parent, children);
    }
}
