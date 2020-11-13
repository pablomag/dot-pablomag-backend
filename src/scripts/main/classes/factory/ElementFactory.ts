import { HeroElement } from "./../elements/HeroElement";
import { TitleElement } from "./../elements/TitleElement";
import { SubtitleElement } from "./../elements/SubtitleElement";
import { TextElement } from "./../elements/TextElement";
import { TipElement } from "./../elements/TipElement";
import { CodeElement } from "./../elements/CodeElement";

export const elementTypes = {
    HERO: "HERO",
    TITLE: "TITLE",
    SUBTITLE: "SUBTITLE",
    TEXT: "TEXT",
    TIP: "TIP",
    CODE: "CODE",
};

const defaultValues = {
    HERO: "https://unsplash.it/1920",
    TITLE: "New empty post, click edit to start editing",
    SUBTITLE: "New subtitle here",
    TEXT: `
Lorem <strong>ipsum dolor sit amet</strong>, consectetur adipisicing elit.
Aperiam aut consequuntur debitis dignissimos doloribus ea eius in incidunt ipsam labore minus nam,
omnis quibusdam reiciendis repellat, repudiandae, saepe soluta vel!
`,
    TIP: "<strong>TIP: </strong>This is a valuable tip",
    CODE: `
if (condition)
{
    print('sakamana');
} else {
    echo('error here')
}
`,
};

export class ElementFactory {
    static drag(event: any): void {
        event.dataTransfer.setData("text", event.target.id);
    }

    static prevent(event: any): void {
        event.preventDefault();
    }

    static create(event: any): Boolean {
        event.preventDefault();
        event.stopPropagation();

        const value = event.dataTransfer.getData("value");
        const type = event.dataTransfer.getData("text");
        const id = type.toLowerCase();

        if (
            (type === elementTypes.HERO || type === elementTypes.TITLE) &&
            event.target.classList.contains("post-content")
        ) {
            return false;
        }

        if (
            type !== elementTypes.HERO &&
            type !== elementTypes.TITLE &&
            !event.target.classList.contains("post-content")
        ) {
            return false;
        }

        let element: HTMLElement | null = <HTMLElement>{};
        let defaultValue = "";

        switch (type) {
            case elementTypes.HERO:
                defaultValue = defaultValues.HERO;
                const heroElement = new HeroElement(id, value || defaultValue);
                element = heroElement.create();
                break;
            case elementTypes.TITLE:
                defaultValue = defaultValues.TITLE;
                const titleElement = new TitleElement(
                    id,
                    value || defaultValue
                );
                element = titleElement.create();
                break;
            case elementTypes.SUBTITLE:
                defaultValue = defaultValues.SUBTITLE;
                const subtitleElement = new SubtitleElement(
                    id,
                    value || defaultValue
                );
                element = subtitleElement.create();
                break;
            case elementTypes.TEXT:
                defaultValue = defaultValues.TEXT;
                const textElement = new TextElement(id, value || defaultValue);
                element = textElement.create();
                break;
            case elementTypes.TIP:
                defaultValue = defaultValues.TIP;
                const tipElement = new TipElement(id, value || defaultValue);
                element = tipElement.create();
                break;
            case elementTypes.CODE:
                defaultValue = defaultValues.CODE;
                const codeElement = new CodeElement(id, value || defaultValue);
                element = codeElement.create();
                break;
            default:
                element = null;
                break;
        }

        if (element) {
            event.target.appendChild(element);
        }

        return true;
    }
}
