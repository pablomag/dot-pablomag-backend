import { elementTypes } from "./factory/ElementFactory";

class fakeDOM {
    static instance: any;
    _data: any[];
    constructor() {
        if (!fakeDOM.instance) {
            this._data = [];

            fakeDOM.instance = this;
        }

        return fakeDOM.instance;
    }

    add(item: any) {
        if (item.type === elementTypes.HERO) {
            item.value = this.trimUrl(item);
        }
        if (item.type === elementTypes.SUBTITLE) {
            item.value = item.value.toUpperCase();
        }

        this._data.push(item);
    }

    edit(id: string, value: string) {
        const item = this._data[this.index(id)];

        item.value =
            item.type === elementTypes.SUBTITLE ? value.toUpperCase() : value;

        if (item.type === elementTypes.HERO) {
            item.value = this.trimUrl(item);
        }

        this._data[this.index(id)] = item;
    }

    remove(id: string) {
        this._data.splice(this.index(id), 1);
    }

    swap(sourceId: any, targetId: string) {
        const source = this.index(sourceId);
        const target = this.index(targetId);

        [this._data[source], this._data[target]] = [
            this._data[target],
            this._data[source],
        ];
    }

    trimId(id: string) {
        const index = id.lastIndexOf("-");

        return id.substr(index, id.length);
    }

    trimUrl(item: { value: string }) {
        const index = item.value.lastIndexOf("/") + 1;

        return item.value.substr(index, item.value.length);
    }

    index(id: string) {
        if (id.includes("-")) {
            id = this.trimId(id);
        }

        for (let i = 0; i < this._data.length; i++) {
            if (id.includes(this._data[i]._id)) {
                return i;
            }
        }
        return -1;
    }

    get(id: string) {
        return this._data[this.index(id)];
    }

    getPostTitle() {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].type === elementTypes.TITLE) {
                return this._data[i].value;
            }
        }
        return null;
    }

    getPostImage() {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].type === elementTypes.HERO) {
                return this._data[i].value;
            }
        }
        return null;
    }
}

const instance = new fakeDOM();

Object.freeze(instance);

export default instance;
