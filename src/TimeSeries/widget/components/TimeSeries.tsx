
import * as React from "TimeSeries/lib/react";

import NVD3Chart from "../../lib/react-nvd3";
import * as d3 from "TimeSeries/lib/d3";

import { Data, ModelProps } from "../../TimeSeries.d";

export interface Serie {
    values?: Data[];
    key?: any;
    color?: string;
    isArea?: boolean;
}
export interface WidgetProps extends ModelProps {
    widgetId: string;
    seriesData?: Serie[];
    dataLoaded?: boolean;
}
export class TimeSeries extends React.Component<WidgetProps, {}> {
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

        // const xEncoding = d3.time.scale().range([ 0, this.props.width ]);
        // const yEncoding = d3.scale.linear().range([ this.props.height, 0 ]);

        if (props.dataLoaded) {
            logger.debug(props.widgetId + ".render dataLoaded");
            chart = React.createElement(NVD3Chart, {
                datum,
                duration: 1,
                height: this.props.heightUnits === "auto" ? undefined : this.props.height,
                showLegend: props.showLegend,
                showXAxis: props.showXAxis,
                showYAxis: props.showYAxis,
                type: "lineChart",
                useInteractiveGuideline: props.useInteractiveGuidelines,
                width: this.props.widthUnits === "auto" ? undefined : this.props.width,
                x: "xPoint",
                xAxis: {
                    axisLabel: this.props.xAxisLabel,
                    // scale: xEncoding,
                    showMaxMin: true,
                    tickFormat: (dataPoint: any) => {
                        return d3.time.format(xFormat)(new Date(dataPoint));
                    },
                },
                // xDomain: d3.extent(datum[0].values, (d: any) => {
                //     return d.xPoint;
                //    }),
                xScale: d3.time.scale(),
                y: "yPoint",
                yAxis: {
                    axisLabel: this.props.yAxisLabel,
                   // scale: yEncoding,
                    tickFormat: (dataPoint: any) => {
                        if (yFormat) {
                            return d3.format(yFormat)(dataPoint);
                        } else {
                            return dataPoint;
                        }
                    },
                }
               // yDomain: [ 0, d3.max(datum[0].values, (d: any) => {
               //     return d.yPoint;
               // }) ],
            });
        }
        return (<div>{chart}</div>);
    }
    private getDatum(): Serie[] {
        return this.props.seriesConfig.map(serieConfig => ({
            area: serieConfig.isArea,
            color: serieConfig.serieColor ? serieConfig.serieColor : undefined,
            key: serieConfig.serieKey,
            values: serieConfig.serieData,
        }));
    }
}
