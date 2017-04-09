import { Component, DOM } from "react";

export class CustomWrapper extends Component<{ style?: string; class?: string; }, {}> {

    render() {
        return DOM.div({ className: this.props.class, style: this.parseStyle() }, this.props.children);
    }

    private parseStyle(): {[key: string]: string} {
            try {
                let style = `width:100%;`;
                if (this.props.style) {
                    style = `${(style + this.props.style).replace(/\n|\s/g, "").replace(/(-.)/g,
                        (match) => match[1].toUpperCase())}`;
                }

                return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
                    const pair = line.split(":");
                    if (pair.length === 2) {
                        styleObject[pair[0]] = pair[1];
                    }
                    return styleObject;
                }, {});
            } catch (error) {
                console.log("Failed to parse style", this.props.style, error);
            }
            return {};
    }

}
