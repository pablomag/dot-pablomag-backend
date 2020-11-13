import fakeDOM from "./../classes/FakeDOM";

import { ElementFactory } from "./factory/ElementFactory";
import { TagElement } from "./../classes/elements/TagElement";

import { API_URL, IMG_SERVICE_URL } from "./../constants";

const CREATE = "create";
const EDIT = "edit";

export class Playground {
    static action = CREATE;
    static slug = Playground.getSlugFromURL();

    static playground: HTMLElement | null = document.querySelector(
        ".post-create--playground"
    );

    static init() {
        Playground.playground!.addEventListener(
            "drop",
            ElementFactory.create,
            false
        );
        Playground.playground!.addEventListener(
            "dragover",
            ElementFactory.prevent,
            false
        );

        TagElement.init();

        if (Playground.slug !== EDIT && Playground.slug !== CREATE) {
            Playground.action = EDIT;
            Playground.loadPost().then();
        }
    }

    static async submitPost(post: any) {
        let url: string;
        if (Playground.action === CREATE) {
            url = `${API_URL}/api/post/save`;
        } else {
            url = `${API_URL}/api/post/edit/${Playground.slug}`;
        }

        post.fakeDOM = fakeDOM;

        await fetch(url, {
            method: "POST",
            body: JSON.stringify(post),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((response) =>
                console.log(
                    "Successful post submission:",
                    JSON.stringify(response)
                )
            )
            .catch((error) => console.error("Error submitting post:", error));
    }

    static preparePost() {
        const data = {
            image: fakeDOM.getPostImage(),
            title: fakeDOM.getPostTitle(),
            content: Playground.playground!.lastElementChild!.outerHTML,
            tags: TagElement.tags,
        };

        const errors = Playground.checkForErrors(data);
        if (errors.length !== 0) {
            let errorMessage: string = "";
            errors.forEach((error) => {
                if (error) {
                    errorMessage += `${error}\n`;
                }
            });

            // TODO: Change this ugly alert
            alert(errorMessage);

            const imgElement: any = document.querySelector(".hero");

            if (imgElement && imgElement.childNodes[0]) {
                imgElement.childNodes[0].src = `${IMG_SERVICE_URL}/images/desktop/${data.image}`;
            }

            return false;
        }

        let previewPost: any = Playground.playground!.cloneNode(true);
        previewPost = Playground.stripControlElements(previewPost);
        Playground.openPreviewWindow(previewPost);

        data.content = previewPost.lastElementChild.outerHTML;

        return data;
    }

    static openPreviewWindow(previewPost: any) {
        const previewPostTemplate = `
        <!doctype html>
        <html lang="en">
            <head>
                <title>Post preview</title>
                <link rel="stylesheet" type="text/css" href="/styles/main.css">
            </head>
            <body>
                ${previewPost!.outerHTML}
            </body>
        </html>`;

        const previewWindow: any = window.open(
            "",
            "POST PREVIEW",
            "width=580, height=920"
        );

        previewWindow!.document.write(previewPostTemplate);
    }

    static async loadPost(): Promise<any> {
        if (!Playground.slug) {
            return false;
        }

        try {
            const { post: item } = await Playground.getPostBySlug(
                Playground.slug
            );
            const { post, data } = item;
            if (!post) {
                return false;
            }

            const header = document.querySelector(".post-header");
            const content = document.querySelector(".post-content");

            header!.addEventListener("drop", ElementFactory.create, false);
            content!.addEventListener("drop", ElementFactory.create, false);

            for (let tag of post.tags) {
                (<any>TagElement.addTagInput!).value = tag;

                const event = new KeyboardEvent("keyup", { code: "Enter" });

                TagElement.addTagInput!.dispatchEvent(event);
            }

            for (let item of data) {
                const dataTransfer = new DataTransfer();

                const type = item.type;
                const value =
                    item.type === "HERO"
                        ? `${IMG_SERVICE_URL}/images/desktop/${item.value}`
                        : item.value;

                dataTransfer.setData("text", type);
                dataTransfer.setData("value", value);

                const event = new DragEvent("drop", {
                    dataTransfer: dataTransfer,
                });

                if (type === "HERO" || type === "TITLE") {
                    header!.dispatchEvent(event);
                } else {
                    content!.dispatchEvent(event);
                }
            }
        } catch (error) {
            console.log("Error while loadin post:", error);
        }
    }

    private static checkForErrors(data: any) {
        const { title, image, content } = data;

        const MIN_TAGS_REQUIRED = 1;
        const MIN_TITLE_LENGTH = 10;
        const MIN_IMG_NAME_LENGTH = -1;

        const errors: string[] = [];
        if (!TagElement.tags || TagElement.tags.length < MIN_TAGS_REQUIRED) {
            errors.push("Your post requires at least one tag");
        }
        if (!title || title.length < MIN_TITLE_LENGTH) {
            errors.push("Your post does not have a valid title");
        }
        if (!image || image.length < MIN_IMG_NAME_LENGTH) {
            errors.push("Your post does not seem to have a hero picture");
        }
        if (
            !content.includes('id="subtitle') ||
            !content.includes('id="text')
        ) {
            errors.push("Your post does not seem to have enough content");
        }

        return errors;
    }

    static stripControlElements(previewPost: any) {
        const controlsElements = [].slice.call(
            previewPost!.querySelectorAll(".controls")
        );
        controlsElements.forEach((element: HTMLElement) => element.remove());

        const unclickableElements = [].slice.call(
            previewPost!.querySelectorAll(".unclickable")
        );
        unclickableElements.forEach((element: HTMLElement) =>
            element.classList.remove("unclickable")
        );

        const draggableElements = [].slice.call(
            previewPost!.querySelectorAll(".draggable")
        );
        draggableElements.forEach((element: HTMLElement) =>
            element.classList.remove("draggable", "swappable")
        );

        const draggableAttribs = previewPost!.querySelectorAll(
            '*[draggable="true"]'
        );
        draggableAttribs.forEach((element: HTMLElement) =>
            element.removeAttribute("draggable")
        );

        const lastChildElements = [].slice.call(
            previewPost!.querySelectorAll(".last-child")
        );
        lastChildElements.forEach((element: HTMLElement) =>
            element.classList.remove("last-child")
        );

        const idAttribs = previewPost!.querySelectorAll(
            ".text, .hero, .sticky-title, .subtitle, .post-text, .code, .tip"
        );
        idAttribs.forEach((element: HTMLElement) => {
            element.removeAttribute("id");
        });

        return previewPost;
    }

    static getSlugFromURL() {
        const url = window.location.pathname.toLowerCase();
        const index = url.lastIndexOf("/") + 1;

        return url.substr(index, url.length);
    }

    static async getPostBySlug(slug: string) {
        const url = `${API_URL}/api/post/slug/${slug}`;

        return await fetch(url, { method: "GET" })
            .then((res) => res.json())
            .then((response) => {
                return response;
            })
            .catch((error) => console.error("Error:", error));
    }
}
