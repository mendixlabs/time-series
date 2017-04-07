export default ModelProps;

export interface ModelProps {
    xAxisLabel?: string;
    xAxisFormat?: string;
    yAxisLabel?: string;
    yAxisFormatDecimalPrecision?: number;
    seriesConfig: SeriesConfig[];
    width: number;
    widthUnit: WidthUnit;
    height: number;
    heightUnit: HeightUnit;
    yAxisDomainMinimum?: string;
    yAxisDomainMaximum?: string;
}

export interface SeriesConfig {
    entity: string;
    sourceType: DataSource;
    xAttribute: string ;
    yAttribute: string;
    name: string;
    entityConstraint?: string;
    dataSourceMicroflow?: string;
    color?: string;
    fill: boolean;
}

export type WidthUnit = "percentage" | "pixels";

export type HeightUnit = "percentageOfWidth" | "percentageOfParent" | "pixels";

export type DataSource = "xpath" | "microflow";

export interface DataPoint {
    x: number;
    y: number;
}

export interface DataStore {
    series: { [key: string]: DataPoint[] };
}
