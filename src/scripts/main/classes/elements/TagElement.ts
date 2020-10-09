import { keyCodes, types } from "./../../utils/TextUtils";

export class TagElement {
    static tags: string[] = [];
    static addTagInput: HTMLElement | null = document.getElementById(
        "TAG-INPUT"
    );
    static tagWrapper: HTMLElement | null = document.getElementById(
        "TAG-WRAPPER"
    );

    static init() {
        TagElement.addTagInput!.addEventListener(
            "keyup",
            TagElement.addTag,
            false
        );
    }

    private static addTag(event: KeyboardEvent) {
        if (
            event.code === keyCodes.KEY_ENTER ||
            event.code === keyCodes.NUMPAD_ENTER
        ) {
            const tag = (<HTMLInputElement>TagElement.addTagInput).value;
            if (!tag) {
                return;
            }

            const tagElement = document.createElement(types.PARAGRAPH);

            tagElement.addEventListener("click", TagElement.removeTag, false);
            tagElement.classList.add("sidebar-tags");
            tagElement.innerHTML = tag;

            TagElement.tagWrapper!.appendChild(tagElement);

            TagElement.tags.push(tag);

            (<HTMLInputElement>TagElement.addTagInput).value = "";
        }
    }

    private static removeTag(event: any) {
        event.target.remove();

        const tagToRemove: string = event.target.innerHTML.toLowerCase();

        TagElement.tags = TagElement.tags.filter(
            (tag: string) => tag !== tagToRemove
        );
    }
}
