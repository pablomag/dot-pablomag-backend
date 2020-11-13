import fakeDOM from "./../FakeDOM";

import { ElementFactory } from "./../factory/ElementFactory";

import { RemoveButtonElement } from "./RemoveButtonElement";
import { EditButtonElement } from "./EditButtonElement";
import { SearchButtonElement } from "./SearchButtonElement";
import { InputTextElement } from "./InputTextElement";
import { InputTextAreaElement } from "./InputTextAreaElement";
import { InputFileElement } from "./InputFileElement";

export class BaseElement {
    protected _id: number;
    protected type: string;
    protected value: string;

    constructor(id: number, type: string, value: string) {
        this._id = id;
        this.type = type;
        this.value = value;
    }

    persist() {
        const element = {
            _id: this._id,
            type: this.type.toUpperCase(),
            value: this.value,
        };

        fakeDOM.add(element);
    }

    render(
        parent: { type: string; id: string; classes: string[]; controls: any },
        children: any[]
    ) {
        const container = document.createElement(parent.type);

        parent.classes.forEach((cls: string) => container.classList.add(cls));

        container.addEventListener("dragstart", ElementFactory.drag, false);
        container.addEventListener("dragover", ElementFactory.prevent, false);
        container.addEventListener("drop", this.swap, false);

        container.classList.add("draggable", "swappable");
        container.setAttribute("draggable", "true");

        let lastChild: HTMLElement = <HTMLElement>{};

        function createElement(child: {
            type: any;
            value: string;
            source: string;
            classes: string[];
        }) {
            const element = document.createElement(child.type);

            if (child.value) {
                element.innerHTML = child.value.trim();
            }
            if (child.source) {
                element.src = child.source.trim();
            }

            if (child.classes) {
                child.classes.forEach((cls: string) =>
                    element.classList.add(cls)
                );
            }

            return element;
        }

        children.forEach((child) => {
            const element = createElement(child);

            if (child.child) {
                const childElement = createElement(child.child);

                element.appendChild(childElement);

                lastChild = childElement;
            } else {
                lastChild = element;
            }

            container.appendChild(element);
        });

        lastChild.classList.add("last-child");

        const controls = this.controls(parent.controls);

        container.appendChild(controls);
        container.id = parent.id;

        this.persist();

        return container;
    }

    swap(event: any): Boolean {
        event.preventDefault();
        event.stopPropagation();

        const sourceId = event.dataTransfer!.getData("text");
        let targetId = "";

        const targetPath = event.path;
        for (let i = 0; i < targetPath.length; i++)
            if (targetPath[i].id !== "" && targetPath[i].id !== undefined) {
                targetId = targetPath[i].id;
                break;
            }

        const sourceElement = document.getElementById(sourceId);
        const targetElement = document.getElementById(targetId);

        if (
            (sourceId.startsWith("hero") && !targetId.startsWith("title")) ||
            (sourceId.startsWith("title") && !targetId.startsWith("hero"))
        ) {
            return false;
        }

        if (
            !sourceId.startsWith("hero") &&
            !sourceId.startsWith("title") &&
            (targetId.startsWith("hero") || targetId.startsWith("title"))
        ) {
            return false;
        }

        const isSwappable =
            sourceElement &&
            sourceElement.classList.contains("swappable") &&
            targetElement &&
            targetElement.classList.contains("swappable");

        if (isSwappable) {
            const parentElement = targetElement!.parentNode;
            const targetNextElement = targetElement!.nextSibling;
            const sourceNextElement = sourceElement!.nextSibling;
            if (sourceElement === targetNextElement) {
                parentElement!.insertBefore(sourceElement!, targetElement!);
            } else {
                if (!sourceNextElement) {
                    parentElement!.insertBefore(targetElement!, sourceElement);
                } else {
                    parentElement!.insertBefore(
                        targetElement!,
                        sourceNextElement
                    );
                }
                parentElement!.insertBefore(sourceElement!, targetNextElement!);
            }

            fakeDOM.swap(sourceId, targetId);
        }

        return true;
    }

    controls(list: string[]) {
        const controls = document.createElement("div");
        controls.classList.add("controls");

        if (list.includes("remove")) {
            const removeButton = new RemoveButtonElement(
                this._id,
                this.type,
                this.value
            );
            controls.appendChild(removeButton.create());
        }

        if (list.includes("edit")) {
            const editButton = new EditButtonElement(
                this._id,
                this.type,
                this.value
            );
            controls.appendChild(editButton.create());
        }

        if (list.includes("search")) {
            const searchButton = new SearchButtonElement(
                this._id,
                this.type,
                this.value
            );
            controls.appendChild(searchButton.create());
        }

        if (list.includes("input")) {
            const inputTextElement = new InputTextElement(
                this._id,
                this.type,
                this.value
            );
            controls.appendChild(inputTextElement.create());
        }

        if (list.includes("input-area")) {
            const inputTextAreaElement = new InputTextAreaElement(
                this._id,
                this.type,
                this.value
            );
            controls.appendChild(inputTextAreaElement.create());
        }

        if (list.includes("file")) {
            const inputFileElement = new InputFileElement(
                this._id,
                this.type,
                this.value
            );
            controls.appendChild(inputFileElement.create());
        }

        return controls;
    }

    static countElementsByClass(className: string) {
        return document.getElementsByClassName(className).length;
    }

    static elementExists(id: string) {
        return document.querySelector(`.${id}`);
    }

    static generateUniqueID() {
        return Date.now() + Math.random();
    }
}
