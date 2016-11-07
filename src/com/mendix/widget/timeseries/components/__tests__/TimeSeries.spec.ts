import { mount, shallow } from "enzyme"; // enzyme's api doesn't provide innerHTML for svg. use "React.addons.TestUtils"
import { createElement } from "react";

import { SeriesConfig } from "../../TimeSeries.d";
import { TimeSeries, WidgetProps } from "../TimeSeries";

describe("TimeSeries", () => {
    const dataStore: any = { series: {} };

    const getDate = (date: string) => { return new Date(date).getDate(); };
    const seriesConfig: SeriesConfig[] = [ { color: "blue", fill: true, name: "data1" } ];
    dataStore.series[seriesConfig[0].name] = [
        { x: getDate("24-Apr-2007"), y: 93.24 },
        { x: getDate("2-Jan-2008"), y: 194.84 },
        { x: getDate("1-Jan-2009"), y: 85.35 },
        { x: getDate("1-Jan-2010"), y: 210.73 }
    ];

    const createProps: WidgetProps = {
        dataStore,
        height: 500,
        heightUnit: "pixels",
        seriesConfig,
        width: 900,
        widthUnit: "pixels"
        };

    const chartShallow = shallow(createElement(TimeSeries, createProps));

    it("should render NVD3LineChart component", () => {
        expect(chartShallow.find("NVD3LineChart").length).toEqual(1) ;
    });

    it("should have the correct height passed as props to NVD3LineChart", () => {
        expect(chartShallow.find("NVD3LineChart").props().height).toBe(500);
        expect(chartShallow.find("NVD3LineChart").props().width).toBe(900);
    });

    it("should transform props into datum", () => {
        const datum = TimeSeries.processDatum(seriesConfig, dataStore)[0];
        expect(datum.area).toEqual(true);
        expect(datum.color).toBe("blue");
        expect(datum.key).toBe("data1");
    });
});
