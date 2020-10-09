import { IMG_SERVICE_URI, IMG_SERVICE_PORT } from "./../../../constants";

const imageServiceUrl = `${IMG_SERVICE_URI}:${IMG_SERVICE_PORT}`;

export async function uploadImage(formData: FormData) {
    const url = `${imageServiceUrl}/image/upload`;
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    return response.json();
}

export async function deleteImage(image: string) {
    const url = `${imageServiceUrl}/image/delete`;
    const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
    });

    return response.json();
}
