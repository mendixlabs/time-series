import { StatelessComponent, createElement } from "react";

export const Alert: StatelessComponent<{ message?: string; }> = (props) =>
    props.message
        ? createElement("div", { className: `alert alert-danger widget-time-series-alert` }, props.message)
        : null;

Alert.displayName = "Alert";
