import { BaseElement } from "./BaseElement";

export class CodeElement extends BaseElement {
    id: number;

    constructor(type: string, value: string) {
        const id = BaseElement.generateUniqueID();

        super(id, type, value);

        this.id = id;
    }

    create() {
        const count = BaseElement.countElementsByClass("code-block");

        const parent = {
            type: "div",
            id: `${this.type}-${count}-${this.id}`,
            classes: ["code", "code-block"],
            controls: ["remove", "edit", "input-area"],
        };

        const children = [
            {
                type: "i",
                classes: ["far", "fa-copy", "code-block-copy"],
            },
            {
                type: "pre",
                child: {
                    type: "code",
                    value: this.value,
                },
            },
        ];

        return this.render(parent, children);
    }
}
