/**
 * https://keycode.info/
 */
export const keyCodes = {
    CTRL_PRESSED: false,
    LEFT_CTRL: "ControlLeft",
    KEY_TAB: "Tab",
    KEY_B: "KeyB",
    KEY_I: "KeyI",
    KEY_M: "KeyM",
    KEY_ENTER: "Enter",
    NUMPAD_ENTER: "NumpadEnter",
};

export const types = {
    BOLD: "strong",
    ITALIC: "i",
    STRIP: "strip",
    NEW_LINE: "br",
    SPACE: "&nbsp;",
    PARAGRAPH: "p",
    DIV: "div",
    HTML: "html",
    IMAGE: "img",
    INPUT: "input",
    TEXTAREA: "textarea",
    H1: "h1",
};

function getSelection(target: any) {
    if (target.selectionStart !== undefined) {
        const start = target.selectionStart;
        const end = target.selectionEnd;

        const text = target.value.substring(start, end);

        return { text, start, end };
    }
    return target.selectionStart;
}

function replaceSelectedText(target: any, selection: any) {
    const fullText = target.value;
    target.value =
        fullText.slice(0, selection.start) +
        selection.text +
        fullText.slice(selection.end);
}

export function modifyText(target: HTMLInputElement, type: string) {
    const selection = getSelection(target);
    if (selection.text.length < 1) {
        return;
    }

    selection.text = `<${type}>${selection.text}</${type}>`;
    if (type === "strip") {
        selection.text = selection.text.replace(/<[^>]+>/g, "");
    }

    replaceSelectedText(target, selection);
}
