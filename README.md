# TimeSeries
Author: Derrick Kwagala, Flock of Birds

Type: Mendix widget
Latest version: 0.1.0
Package file name: TimeSeries.mpk

## Description

Plot and track your data across different time periods on an nv.d3 powered chart.

## Features and limitations

* Date formatting on x-axis
* Formatting of numbers on y-axis
* Interactive guidelines
* Different line color
* Filling of serie area

## Dependencies

* Mendix 6 environment. Tested on 6.8.0

## Properties
* X-axis config
  * X-axis label; Label for the x-axis
  * X-axis data format; Formats of date on x-axis (use NVD3 date formatting)
  * Enable stagger-labels; Display values on x-axis so they all fit
* Y-axis config
  * Y-axis label; Label for the y-axis
  * Y-axis data format; Format of data on y-axis
* Series config
  * Series
     - Data source
        - Data entity; The entity containing serie points
        - Source; Type of source
        - X-Axis data; Attribute containing dates for x-axis
        - Y-Axis data; Attribute containing data for y-axis
        - Serie key; Used in the legend to interact with the chart
     - Source - XPath
        - Constraint; Constraint on the data from data-entity
     - Source - microflow
        - Data source microflow; Returns a serie's coordinates
     - Appearance
        - Serie color; Color of the serie line in the chart
        - Fill serie area; Should serie area be filled
* Appearance
  * Chart width; Width of the chart
  * Width units; Measurement for width pixels or auto
  * Chart height; Height of the chart
  * Height units; Measurement for Height pixels or auto

## Source

Source and [sample project](https://github.com/mendixlabs/time-series/tree/master/test) at GitHub

Please contribute fixes and extensions at
https://github.com/mendixlabs/time-series/


## Known bugs

* None so far. Please let me know when there are any issues or suggestions.

Please report any issues via the github issue tracker:
https://github.com/mendixlabs/time-series/issues 