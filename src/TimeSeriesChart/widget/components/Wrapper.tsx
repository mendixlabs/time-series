
import * as React from "TimeSeriesChart/lib/react";

import NVD3Chart from "../../lib/react-nvd3";
import * as d3 from "TimeSeriesChart/lib/d3";

// import * as NVD3Chart from "TimeSeriesChart/lib/react-nvd3";
import { ModelProps } from "../../TimeSeriesChart.d";

export interface Data {
    xPoint: number;
    yPoint: number;
}
export interface Serie {
    values?: Data[];
    key?: any;
    color?: string;
    area?: boolean;
}
export interface WidgetProps extends ModelProps {
    widgetId: string;
    seriesData?: Serie[];
    dataLoaded?: boolean;
}
export class Wrapper extends React.Component<WidgetProps, {}> {
    public static defaultProps: WidgetProps = {
        widgetId: "",
    };

    public constructor(props: WidgetProps) {
        super(props);
        logger.debug(this.props.widgetId + ".constructor");
        this.getDatum = this.getDatum.bind(this);
    }

    public componentWillMount() {
        logger.debug(this.props.widgetId + " .componentWillMount");
        this.checkConfig();
    }
    private checkConfig() {
        // TODO add validation on config if needed.
    }
    public render() {
        logger.debug(this.props.widgetId + ".render");
        let chart = <div>Loading ...</div>;
        const props = this.props;
        const datum = this.getDatum();
        const xFormat = props.xAxisFormat ? props.xAxisFormat : "%d-%b-%y";
        const yFormat = props.yAxisFormat ? props.yAxisFormat : "";
        // TODO: correct return types for values: not currently used
        // const height_ = this.getValueFromUnits(props.height, props.heightUnits);
        // const width_ = this.getValueFromUnits(props.width, props.widthUnits);

        const xEncoding = d3.time.scale().range([ 0, this.props.width ]);
        const yEncoding = d3.scale.linear().range([ this.props.height, 0 ]);

        if (props.dataLoaded) {
            logger.debug(props.widgetId + ".render dataLoaded");
            chart = React.createElement(NVD3Chart, {
                datum,
                duration: 300,
                height: this.props.height,
                showLegend: props.showLegend,
                showXAxis: props.showXAxis,
                showYAxis: props.showYAxis,
                type: "lineChart",
                useInteractiveGuideline: props.useInteractiveGuidelines,
                width: this.props.width,
                x: "xPoint",
                xAxis: {
                    axisLabel: this.props.xAxisLabel,
                    scale: xEncoding,
                    showMaxMin: true,
                    tickFormat: (dataPoint: any) => {
                        return d3.time.format(xFormat)(new Date(dataPoint));
                    },
                },
                xDomain: d3.extent(datum[0].values, (d: any) => {
                     return d.xPoint;
                    }),
                xScale: d3.time.scale(),
                y: "yPoint",
                yAxis: {
                    axisLabel: this.props.yAxisLabel,
                    scale: yEncoding,
                    tickFormat: (dataPoint: any) => {
                        if (yFormat) {
                            return d3.format(yFormat)(dataPoint);
                        } else {
                            return dataPoint;
                        }
                    },
                },
                yDomain: [ 0, d3.max(datum[0].values, (d: any) => {
                    return d.yPoint;
                }) ],
            });
        }
        return (<div>{chart}</div>);
    }
    // TODO get your data from seriesConfig, seriesData, model configuration (Need to be combined)
    private getDatum() {
        logger.debug(this.props.widgetId + ".getDatum");
        const seriesConfig = this.props.seriesConfig;
        let returnDatum: Serie[] = [];
        for (let count = 0; count < seriesConfig.length; count++) { // replace with seriesConfig.map((serieConfig)=>{})
            let serieConfig = seriesConfig[count];
            let serie: Serie = {
                key: serieConfig.serieKey,
                values: serieConfig.serieData,
            };
            if (serieConfig.serieColor) {
                serie.color = serieConfig.serieColor;
            }
            if (serieConfig.area) {
                serie.area = serieConfig.area;
            }
            returnDatum.push(serie);
        }
        logger.debug(this.props.widgetId + ".getDatum Data: ");
        logger.debug(returnDatum);
        return returnDatum;
    }

    /**
     * Processes the heights and width values depending on type of units
     */
     /*private getValueFromUnits(value: number, type: WidthUnits | HeightUnits): number | string {
        if (type === "auto") {
            return "";
        }
        return value;
    }*/
}
