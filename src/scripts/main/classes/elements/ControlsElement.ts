import fakeDOM from "./../FakeDOM";

import { deleteImage, uploadImage } from "./../../utils/ImageUtils";
import { IMG_SERVICE_URI, IMG_SERVICE_PORT } from "./../../../../constants";
import { keyCodes, types, modifyText } from "../../utils/TextUtils";

export class ControlsElement {
    _id: number;
    type: string;
    value: string;

    constructor(id: number, type: string, value: string) {
        this._id = id;
        this.type = type;
        this.value = value;
    }

    editElement(event: any) {
        const element = event.target.parentElement;
        const parent = element!.parentElement;
        const id = `input-${parent!.id}`;

        const input = document.getElementById(id);

        input!.style.display = "block";
        input!.focus();
    }

    removeElement(event: any) {
        const parent = event.target.parentElement;
        const element = parent!.parentElement;

        if (element!.classList.contains("protected")) {
            element!.classList.add("deleted");
        } else {
            fakeDOM.remove(element!.id);
            element!.remove();
        }
    }

    hideElement(event: any) {
        event.target.style.display = "none";
    }

    refreshElement(event: {
        code: string;
        preventDefault: () => void;
        target: any;
    }) {
        if (keyCodes.CTRL_PRESSED === true) {
            event.preventDefault();

            switch (event.code) {
                case keyCodes.KEY_B:
                    modifyText(event.target, types.BOLD);
                    break;
                case keyCodes.KEY_I:
                    modifyText(event.target, types.ITALIC);
                    break;
                case keyCodes.KEY_M:
                    modifyText(event.target, types.STRIP);
                    break;
                default:
                    break;
            }

            keyCodes.CTRL_PRESSED = false;
        } else {
            if (
                event.code === keyCodes.KEY_ENTER ||
                event.code === keyCodes.NUMPAD_ENTER
            ) {
                modifyText(event.target, types.NEW_LINE);
            }
        }

        const parentId = event.target.id.replace("input-", "");

        let parent = event.target.parentElement;
        while (
            parent!.id !== parentId &&
            String(parent!.tagName).toLowerCase() !== types.HTML
        ) {
            parent = parent!.parentElement;
        }

        if (String(parent!.tagName).toLowerCase() === types.HTML) {
            return;
        }

        const element = parent!.querySelector(".last-child");
        const value = event.target.value;

        const escapedValue = value.replace(
            /\t/g,
            `${types.SPACE}${types.SPACE}`
        );

        let id = element!.id;

        if (element) {
            element.innerHTML = escapedValue;

            id = !id ? parent!.id : id;

            fakeDOM.edit(id, escapedValue);
        }
    }

    preventKeys(event: {
        code: string;
        preventDefault: () => void;
        target: any;
    }) {
        if (event.code === keyCodes.LEFT_CTRL) {
            event.preventDefault();

            keyCodes.CTRL_PRESSED = true;
        }

        if (event.code === keyCodes.KEY_TAB) {
            event.preventDefault();

            const element = event.target;
            const text = "\t";
            if (typeof element.selectionStart === "number") {
                const val = element.value;
                const selectionStart = element.selectionStart || 0;
                const selectionEnd = element.selectionEnd || 0;

                element.value =
                    val.slice(0, selectionStart) +
                    text +
                    val.slice(selectionEnd);
                element.selectionEnd = element.selectionStart =
                    selectionStart + text.length;
            } else if (typeof (<any>document).selection !== "undefined") {
                const textRange = (<any>document).selection.createRange();

                textRange.text = text;
                textRange.collapse(false);
                textRange.select();
            }
        }
    }

    async uploadFile(event: any) {
        const files = event.target.files;
        const file = files[0];

        const formData = new FormData();
        const blob = new Blob([file], { type: file.type });

        formData.append("image", blob);

        const element = event.target.parentElement.parentElement;
        const imageSrc = element.firstElementChild.src;
        const oldImage = imageSrc.substr(imageSrc.lastIndexOf("/") + 1);

        const uploaded = await uploadImage(formData);

        if (uploaded) {
            const imageServiceUrl = `${IMG_SERVICE_URI}:${IMG_SERVICE_PORT}`;
            const path = `${imageServiceUrl}/images/${uploaded.image}`;

            element.firstElementChild.src = path;
            fakeDOM.edit(element.id, path);

            const deleted = await deleteImage(oldImage);

            if (deleted) {
                console.log(deleted.message);
            }
        }
    }
}
