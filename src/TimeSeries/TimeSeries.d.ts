/// <reference path="../../node_modules/mendix-client/mendix-client/mendix.d.ts" />
/// <reference path="../../node_modules/mendix-client/mendix-client/mxui.d.ts" />
/// <reference path="../../node_modules/mendix-client/mendix-client/mx.d.ts" />

export default ModelProps;

export interface Data {
    xPoint: number;
    yPoint: number;
}

export interface SeriesConfig {
    seriesEntity?: string;
    seriesSource?: SeriesSource;
    entityConstraint?: string;
    dataSourceMicroflow?: string;
    seriesXAttribute?: string;
    seriesYAttribute?: string;
    seriesKey?: string;
    seriesData?: Data[];
    seriesColor?: string;
    seriesFill?: boolean;
}

export interface ModelProps {
    showXAxis?: boolean;
    showYAxis?: boolean;
    useInteractiveGuideline?: boolean;
    showLegend?: boolean;
    xAxisLabel?: string;
    xAxisFormat?: string;
    staggerLabels?: boolean;
    yAxisLabel?: string;
    yAxisFormat?: string;
    seriesConfig?: SeriesConfig[];
    width?: number;
    widthUnit?: WidthUnit;
    height?: number;
    heightUnit?: HeightUnit;
}

export type WidthUnit = "auto" | "pixels";
export type HeightUnit = "auto" | "pixels";
export type SeriesSource = "xpath" | "microflow";
