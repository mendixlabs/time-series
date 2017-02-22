export default ModelProps;

export interface ModelProps {
    xAxisLabel?: string;
    xAxisFormat?: string;
    yAxisLabel?: string;
    yAxisFormatDecimalPrecision?: number;
    seriesConfig?: SeriesConfig[];
    width?: number;
    widthUnit?: WidthUnit;
    height?: number;
    heightUnit?: HeightUnit;
    yAxisDomainMinimum?: string;
    yAxisDomainMaximum?: string;
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
