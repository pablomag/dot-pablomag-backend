import { Playground } from "../main/classes/Playground";
import { ElementFactory } from "../main/classes/factory/ElementFactory";
import { deleteImage } from "../main/utils/ImageUtils";

import { API_URL } from "./constants";

const url = window.location.pathname.toLowerCase();

if (url.startsWith("/post/list")) {
    const deleteButtons: any = document.querySelectorAll(".btn-delete");

    for (let deleteButton of deleteButtons) {
        deleteButton!.addEventListener(
            "click",
            async (event: any) => {
                const id = event.target.dataset.post;
                const image = event.target.dataset.image;
                if (id) {
                    await postDelete(id);
                    await deleteImage(image);
                }
            },
            false
        );
    }

    async function postDelete(id: string) {
        const url = `${API_URL}/api/post/delete/${id}`;
        try {
            await fetch(url, { method: "DELETE" });
            location.href = "/post/list";
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

if (url.startsWith("/post/create") || url.startsWith("/post/edit")) {
    const draggableElements = [].slice.call(
        document.querySelectorAll(".element__draggable")
    );

    draggableElements.forEach((element: HTMLElement) => {
        element.addEventListener("dragstart", ElementFactory.drag, false);
    });

    const previewButton = document.querySelector(".btn-preview");
    const submitButton = document.querySelector(".btn-submit");

    previewButton!.addEventListener("click", postPreview, false);
    submitButton!.addEventListener("click", postSubmit, false);

    Playground.init();

    function postPreview() {
        Playground.preparePost();
    }

    async function postSubmit() {
        const post = Playground.preparePost();
        if (post) {
            await Playground.submitPost(post);
        }
    }
}
