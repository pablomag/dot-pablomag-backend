import { BaseElement } from "./BaseElement";
import { types } from "./../../utils/TextUtils";

export class HeroElement extends BaseElement {
    id: number;
    constructor(type: string, value: string) {
        const id = BaseElement.generateUniqueID();

        super(id, type, value);

        this.id = id;
    }

    create(): HTMLElement | null {
        if (BaseElement.elementExists(this.type)) {
            return null;
        }

        const parent = {
            type: types.DIV,
            id: `${this.type}-${this.id}`,
            classes: [this.type],
            controls: ["remove", "edit", "search", "file"],
        };

        const children = [
            {
                type: types.IMAGE,
                classes: ["unclickable"],
                source: this.value,
            },
        ];

        return this.render(parent, children);
    }
}
