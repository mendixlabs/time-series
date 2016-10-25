import { ReactWrapper, mount } from "enzyme";
import * as React from "react";

import { NVD3LineChart } from "../NVD3LineChart";

import { SeriesConfig } from "../../../TimeSeries.d";
import { TimeSeries, WidgetProps } from "../TimeSeries";

describe("TimeSeries component", () => {
    it("should test", () => {
        expect(true).toBe(true);
    });

});



describe("Test suite for TimeSeries component", () => {
    let TimeSeriesWrapper: ReactWrapper<WidgetProps, {} > ;
    const dataStore: any = { series: {} };

    const getDate = (date: string) => { return new Date(date).getDate(); };
    const seriesConfig: SeriesConfig[] = [ {} ];
    seriesConfig.push({ seriesFill: true, seriesKey: "data1" });

    dataStore.series[seriesConfig[0].seriesKey] = [ { x: getDate("24-Apr-07"), y: 93.24 },
        { x: getDate("2-Jan-08"), y: 194.84 },
        { x: getDate("1-Jan-09"), y: 85.35 },
        { x: getDate("1-Jan-10"), y: 210.73 } ];
    const createProps: WidgetProps = {
        widgetId: "Test.TimeSeries.widget.TimeSeries",
        seriesConfig,
        height: 500,
        width: 900,
        heightUnit: "pixels",
        widthUnit: "auto",
        dataStore,
        dataLoaded: true
        };

    TimeSeriesWrapper = mount(<TimeSeries { ...createProps }/>);

    it("should have the correct height", () => {
        expect(TimeSeriesWrapper.props().height).toBe(500);
    });

    it("should have the correct width", () => {
        expect(TimeSeriesWrapper.props().width).toBe(900);
    });
    it("should have the correct dataStore", () => {
        expect(TimeSeriesWrapper.props().dataStore).toEqual(dataStore);
    });

    it("transform dataProp into datum", () => {
        const datum = TimeSeries.prototype.getDatum(seriesConfig, dataStore)[0];
        expect(datum.area).toEqual(seriesConfig[0].seriesFill);
        expect(datum.color).toBe(seriesConfig[0].seriesColor);
        expect(datum.key).toBe(seriesConfig[0].seriesKey);
    });

    it("Should contain TimeSeries tag", () => {
        expect(TimeSeriesWrapper.find("TimeSeries").length).toEqual(1);
        expect(TimeSeriesWrapper.find("NVD3LineChart").length).toEqual(1);
        expect(TimeSeriesWrapper.childAt(0).some("svg")).toEqual(true);
    });

    it("Checking if component NVD3LineChart has div with class 'nv-chart'", () => {
        spyOn(NVD3LineChart.prototype, "componentDidMount");
        TimeSeriesWrapper = mount(<TimeSeries { ...createProps }/>);
        expect(NVD3LineChart.prototype.componentDidMount).toHaveBeenCalledTimes(1);
    });

    xit("Should verify that the height it correct.", () => {
        // TODO: Implement this test.
    });



});







