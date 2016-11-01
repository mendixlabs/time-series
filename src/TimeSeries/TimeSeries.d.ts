
// WARNING do not make manual Changes to this file.
// widget.d.ts files is auto generated from the params in the widget.xml
// use > 'grunt xsltproc' or > 'grunt watch' to generate a new file

export default ModelProps;

export interface ModelProps {
    xAxisLabel?: string;
    xAxisFormat?: string;
    yAxisLabel?: string;
    yAxisFormat?: string;
    seriesConfig?: SeriesConfig[];
    width?: number;
    widthUnit?: WidthUnit;
    height?: number;
    heightUnit?: HeightUnit;
}

export interface SeriesConfig {
    entity?: string;
    sourceType?: SeriesConfigSourceType;
    xAttribute?: string;
    yAttribute?: string;
    name?: string;
    entityConstraint?: string;
    dataSourceMicroflow?: string;
    color?: string;
    fill?: boolean;
}

export type WidthUnit = "auto" | "pixels";

export type HeightUnit = "auto" | "pixels";

export type SeriesConfigSourceType = "xpath" | "microflow";
