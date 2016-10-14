
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
    useInteractiveGuidelines?: boolean;
    showLegend?: boolean;
    xAxisLabel?: string;
    xAxisFormat?: string;
    staggerLabels?: boolean;
    yAxisLabel?: string;
    yAxisFormat?: string;
    seriesConfig?: SeriesConfig[];
    width?: number;
    widthUnits?: WidthUnits;
    height?: number;
    heightUnits?: HeightUnits;
}

export type WidthUnits = "auto" | "pixels" | "percent";
export type HeightUnits = "auto" | "pixels" | "percent";
export type SeriesSource = "xpath" | "microflow";
