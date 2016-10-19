# Time Series

Plot and track your data across different time periods on an nv.d3 powered chart.

## Features and limitations

* Date formatting on x-axis
* Formatting of numbers on y-axis
* Interactive guidelines
* Different line color
* Filling of series area

## Dependencies

* Mendix 6

## Properties
* X-axis
  * X-axis label; Label for the x-axis
  * X-axis time format; Formats of date on x-axis (use NVD3 date formatting)
  * Enable stagger-labels; Display values on x-axis so they all fit
* Y-axis
  * Y-axis label; Label for the y-axis
  * Y-axis data format; Format of data on y-axis
* Series config
  * Data series
     - Data source
        - Data entity; The entity containing series points
        - SourceType; XPath or microflow
        - X-axis data; Attribute containing dates for x-axis
        - Y-axis data; Attribute containing data for y-axis
        - Series key; Used in the legend to interact with the chart
     - XPath
        - Constraint; Constraint on the data from data-entity
     - Source - microflow
        - Data source microflow; Returns a series' coordinates
     - Appearance
        - Series color; Color of the series line in the chart
        - Fill series area; Should series area be filled
* Appearance
  * Chart width; Width of the chart
  * Width unit; Measurement for width pixels or auto
  * Chart height; Height of the chart
  * Height unit; Measurement for height pixels or auto

## Source

Source and [sample project](https://github.com/mendixlabs/time-series/tree/master/test) at GitHub

Please contribute fixes and extensions at
https://github.com/mendixlabs/time-series/


## Known bugs

Please report any issues via the github issue tracker:
https://github.com/mendixlabs/time-series/issues 

