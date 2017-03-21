import { shallow } from "enzyme"; // enzyme's api doesn't provide innerHTML for svg. use "React.addons.TestUtils"
import { createElement } from "react";

import { SeriesConfig } from "../../TimeSeries.d";
import { TimeSeries, TimeSeriesProps } from "../TimeSeries";

import { NVD3LineChart } from "../NVD3LineChart";

describe("TimeSeries", () => {

    const getDate = (date: string) => new Date(date).getDate();
    const seriesConfig: SeriesConfig[] = [ { color: "blue", fill: true, name: "data1" } ];
    const dataStore = {
        series: {
            data1: [
                { x: getDate("24-Apr-2007"), y: 93.24 },
                { x: getDate("2-Jan-2008"), y: 194.84 },
                { x: getDate("1-Jan-2009"), y: 85.35 },
                { x: getDate("1-Jan-2010"), y: 210.73 }
            ]
        }
    };

    const createProps: TimeSeriesProps = {
        dataStore,
        height: 500,
        heightUnit: "pixels",
        seriesConfig,
        width: 900,
        widthUnit: "pixels",
        xAxisFormat: "yyyy",
        xAxisLabel: "",
        yAxisFormatDecimalPrecision: 2,
        yAxisLabel: "y-axis"
    };

    const chart = shallow(createElement(TimeSeries, createProps));

    it("should render NVD3LineChart component", () => {
        expect(chart.find(NVD3LineChart).length).toEqual(1) ;
    });

    it("should render NVD3LineChart component with correct props", () => {
        const componentProps = chart.find(NVD3LineChart).props();
        expect(componentProps.height).toBe(500);
        expect(componentProps.width).toBe(900);
        expect(componentProps.datum[0].area).toEqual(true);
        expect(componentProps.datum[0].color).toBe("blue");
        expect(componentProps.datum[0].key).toBe("data1");
    });

    it("should render chart component with without data", () => {
        const nonDataProps: TimeSeriesProps = {
            dataStore : { series: {} },
            height: 500,
            heightUnit: "pixels",
            seriesConfig,
            width: 900,
            widthUnit: "pixels",
            xAxisFormat: "yyyy",
            xAxisLabel: "",
            yAxisFormatDecimalPrecision: 2,
            yAxisLabel: "y-axis"
        };
        const emptyChart = shallow(createElement(TimeSeries, nonDataProps));

        const props = emptyChart.find(NVD3LineChart).props();
        expect(props.datum[0].values).toEqual([]);
    });

    describe ("with auto dimensions", () => {
        const chartProps: TimeSeriesProps = {
            dataStore, height: 500, heightUnit: "auto", seriesConfig, width: 900, widthUnit: "auto"
        };
        const lineChart = shallow(createElement(TimeSeries, chartProps));

        it("should not pass height", () => {
            expect(lineChart.first().props().height).toBeUndefined();
        });

        it("should not pass width", () => {
            expect(lineChart.first().props().width).toBeUndefined();
        });
    });
});
