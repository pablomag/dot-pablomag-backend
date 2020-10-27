import { IMG_SERVICE_URL } from "./../../../constants";

const imageServiceUrl = `${IMG_SERVICE_URL}`;

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

export async function searchImages(keyword: string) {
    const url = `${imageServiceUrl}/image/search/${keyword}`;
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.json();
}

export async function downloadImage(image: object) {
    const url = `${imageServiceUrl}/image/download`;
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
        body: JSON.stringify({ image }),
    });
    return response.json();
}
