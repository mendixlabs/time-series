import { Component, createElement } from "react";

import { Alert } from "./components/Alert";
import { TimeSeries } from "./components/TimeSeries";
import { DataStore } from "./TimeSeries";
import TimeSeriesContainer, { TimeSeriesContainerProps } from "./components/TimeSeriesContainer";

import * as css from "./ui/TimeSeries.css";
import * as nvd3CSS from "nvd3/build/nv.d3.css";

const parseDate = () => {
    if (!window.mx) {
        window.mx = {
            parser: {
                formatValue: (value: number) => `${formatDate(value)}`
            }
        } as any;
    }
};

const formatDate = (datetime: Date | number | string) => {
    const date = new Date(datetime);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [ year, month, day ].join("-");
};

parseDate();
// tslint:disable class-name
export class preview extends Component<TimeSeriesContainerProps, {}> {
    componentWillMount() {
        this.addPreviewStyle("widget-timeseries");
    }

    render() {
        const alertMessage = TimeSeriesContainer.validateProps(this.props);
        if (alertMessage) {
            return createElement(Alert, { message: alertMessage });
        } else {
            return createElement(TimeSeries, {
                class: this.props.class,
                dataStore: this.getData(this.props),
                height: this.props.height,
                heightUnit: this.props.heightUnit,
                seriesConfig: this.props.seriesConfig,
                style: TimeSeriesContainer.parseStyle(this.props.style),
                width: this.props.width,
                widthUnit: this.props.widthUnit,
                xAxisFormat: this.props.xAxisFormat,
                xAxisLabel: this.props.xAxisLabel,
                yAxisDomainMaximum: this.props.yAxisDomainMaximum,
                yAxisDomainMinimum: this.props.yAxisDomainMinimum,
                yAxisFormatDecimalPrecision: this.props.yAxisFormatDecimalPrecision,
                yAxisLabel: this.props.yAxisLabel
            });
        }
    }

    private getData(props: TimeSeriesContainerProps): DataStore {
        const dataStore: DataStore = { series: { } };
        props.seriesConfig.map((series, index) => {
            dataStore.series[series.name] = [
                { x: new Date(2017, 2, 15).getTime(), y: 100 + (20 * index) },
                { x: new Date(2017, 3, 15).getTime(), y: 400 + (20 * index) },
                { x: new Date(2017, 4, 15).getTime(), y: 200 + (20 * index) },
                { x: new Date(2017, 5, 15).getTime(), y: 350 + (20 * index) }
            ];
        });
        return dataStore;
    }

    // private validateProps(props: TimeSeriesContainerProps): string {
    //     let errorMessage = "";
    //     const incorrectSeriesNames = props.seriesConfig
    //         .filter(series => series.sourceType === "microflow" && !series.dataSourceMicroflow)
    //         .map(incorrect => incorrect.name)
    //         .join(", ");

    //     if (incorrectSeriesNames) {
    //         errorMessage += `series : ${incorrectSeriesNames}` +
    //             ` - data source type is set to 'Microflow' but 'Source - microflow' is missing \n`;
    //     }

    //     try {
    //         dateFormat(new Date() , props.xAxisFormat);
    //     } catch (error) {
    //         errorMessage += `Formatting for the x-axis : (${props.xAxisFormat}) is invalid \n\n`;
    //     }

    //     if (props.yAxisDomainMinimum && isNaN(Number(props.yAxisDomainMinimum))) {
    //         errorMessage += `Y-axis Domain minimum value (${props.yAxisDomainMinimum}) is not a number`;
    //     }
    //     if (props.yAxisDomainMaximum && isNaN(Number(props.yAxisDomainMaximum))) {
    //         errorMessage += `Y-axis Domain maximum value (${props.yAxisDomainMaximum}) is not a number`;
    //     }

    //     return errorMessage && `Configuration error :\n\n ${errorMessage}`;

    // }

    // private parseStyle(style = ""): { [key: string]: string } {
    //     try {
    //         return `width:100%; ${style}`.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
    //             const pair = line.split(":");
    //             if (pair.length === 2) {
    //                 const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
    //                 styleObject[name] = pair[1].trim();
    //             }
    //             return styleObject;
    //         }, {});
    //     } catch (error) {
    //         // tslint:disable-next-line no-console
    //         console.error("Failed to parse style", style, error);
    //     }

    //     return {};
    // }

    private addPreviewStyle(styleId: string) {
        // This workaround is to load style in the preview temporary till mendix has a better solution
        const iFrame = document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
        const iFrameDoc = iFrame.contentDocument;
        if (!iFrameDoc.getElementById(styleId)) {
            const styleTarget = iFrameDoc.head || iFrameDoc.getElementsByTagName("head")[0];
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.setAttribute("id", styleId);
            styleElement.appendChild(document.createTextNode(css));
            styleElement.appendChild(document.createTextNode(nvd3CSS));
            styleTarget.appendChild(styleElement);
        }
    }

}
