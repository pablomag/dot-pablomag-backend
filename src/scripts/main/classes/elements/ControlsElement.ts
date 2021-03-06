import fakeDOM from "./../FakeDOM";

import {
    deleteImage,
    uploadImage,
    searchImages,
    downloadImage,
} from "./../../utils/ImageUtils";

import { IMG_SERVICE_URL } from "./../../constants";

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

    searchElement() {
        const wrapper = document.createElement(types.DIV);
        const panel = document.createElement(types.DIV);
        const main = document.querySelector("main");

        wrapper.classList.add("panel-wrapper");
        panel.classList.add("panel-img-search");

        main!.appendChild(wrapper);

        const template = `
            <div class="search-wrapper">
                <input type="text" id="imageSearch" class="input-controls input--search">
                <div id="btnSearch" class="btn btn--search" value="search">Search</div>
                <div id="searchResultText" class="search-result--text">Enter a keyword to search images related to it</div>
            </div>
            <div id="searchResultCanvas" class="search-result--canvas"></div>
            <div id="searchLoadingOverlay" class="search-result--loader search-result--loader--hidden">
                <div class="loader--container">
                    <div class="loader" title="loading">
                        <svg
                            version="1.1"
                            id="loader-1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="40px"
                            height="40px"
                            viewBox="0 0 40 40"
                            enableBackground="new 0 0 40 40"
                        >
                            <path
                                opacity="0.2"
                                fill="#000"
                                d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                                s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                                c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
                            />
                            <path
                                fill="#000"
                                d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                                C22.32,8.481,24.301,9.057,26.013,10.047z"
                            >
                                <animateTransform
                                    attributeType="xml"
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 20 20"
                                    to="360 20 20"
                                    dur="0.5s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                    </div>
                </div>
            </div>`;

        panel!.innerHTML = template;
        wrapper!.appendChild(panel);

        const doSearch = async () => {
            const imgSearch: any = document.getElementById("imageSearch");
            const keyword = imgSearch.value;
            const searchResultText: any = document.getElementById(
                "searchResultText"
            );

            const result = await searchImages(keyword);
            const { images } = result;

            const urls: string[] = [];
            images.forEach((image: any) => {
                const imgData: any = {
                    id: image.id,
                    alt_description: image.alt_description,
                    thumb: image.urls.thumb,
                    full: image.urls.full,
                    regular: image.urls.regular,
                    download: image.links.download,
                    user: {
                        id: image.user.id,
                        name: image.user.name,
                        username: image.user.username,
                    },
                };
                urls.push(imgData);
            });

            populateImages(urls);

            searchResultText.innerHTML = result.message;
        };

        const deleteOldImage = async () => {
            const element: any = document.querySelector(".hero");
            const imageSrc = element.firstElementChild.src;
            const oldImage = imageSrc.substr(imageSrc.lastIndexOf("/") + 1);

            const deleted = await deleteImage(oldImage);
            if (deleted) {
                console.log(deleted.message);
            }
        };

        const selectAndDownload = async (event: any, images: any) => {
            let imageSelected: any;
            for (const image of images) {
                if (image.id === event.target.id) {
                    imageSelected = image;
                }
            }

            const loader: any = document.getElementById("searchLoadingOverlay");
            loader.classList.remove("search-result--loader--hidden");

            await deleteOldImage();

            const result = await downloadImage(imageSelected);
            const { filename } = result;
            if (filename) {
                const path = `${IMG_SERVICE_URL}/images/desktop/${filename}`;

                const heroElement: any = document.querySelector(".hero");
                heroElement.firstElementChild.src = path;
                fakeDOM.edit(heroElement.id, path);

                loader.classList.add("search-result--loader--hidden");
                wrapper.remove();
            }
        };

        const populateImages = (images: any) => {
            const searchResultCanvas: any = document.getElementById(
                "searchResultCanvas"
            );
            searchResultCanvas.innerHTML = "";

            const appName = ".pablomag";
            for (const image of images) {
                const imageElement = `
                    <div class="image--thumb">
                        <figure>
                            <img id="${image.id}" src="${image.thumb}" alt="${image.alt_description}"
                                data-user="${image.user.name}"
                            >
                        </figure>
                        <p class="image--credit">
                            Photo by <a href="https://unsplash.com/@${image.user.username}?utm_source=${appName}&utm_medium=referral">${image.user.name}</a> on <a href="https://unsplash.com/?utm_source${appName}&utm_medium=referral">Unsplash</a>
                        </p>
                    </div>
                `;
                searchResultCanvas.innerHTML += imageElement;
            }

            for (const image of images) {
                const imageLinkElement: any = document.getElementById(image.id);
                imageLinkElement.addEventListener(
                    "click",
                    (event: any) => selectAndDownload(event, images),
                    false
                );
            }
        };

        const btnSearch: any = document.getElementById("btnSearch");
        btnSearch.addEventListener("click", doSearch, false);
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
            const path = `${IMG_SERVICE_URL}/images/desktop/${uploaded.image}`;

            element.firstElementChild.src = path;
            fakeDOM.edit(element.id, path);

            const deleted = await deleteImage(oldImage);
            if (deleted) {
                console.log(deleted.message);
            }
        }
    }
}
