/// <reference path="../../powerbi-free/ZoomChartsTimeChartFree/src/visual.ts" />

module powerbi.extensibility.visual {    
    interface IChartSeriesProperties {
        show: boolean;
        name: string;
        type: "columns" | "line" | "area";
        valueLabelsEnabled: boolean;
        _defaultColor: { solid: { color: string; } };
        lineColor: { solid: { color: string; } };
        fillColor: { solid: { color: string; } };
        lineColorOpacity: number;
        fillColorOpacity: number;
        lineMarker: "" | "square" | "rhombus" | "triangle" | "triangle2" | "circle";
        lineMarkerSize: number;
        lineSmoothing: boolean;
        lineWidth: number;
        lineType: "solid" | "dotted" | "dashed";
        stack: string;
        valueAxis: "primary" | "secondary";
        zIndex: number;
        legendMarkerShape: null | "square" | "rhombus" | "triangle" | "triangle2" | "circle";
    }

    interface IChartSeriesValueLabelProperties extends IFontSettings, IValueLabelSettings, IBackgroundSettings {
        decimals: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }

    interface IChartVisualProperties {
        legend: IFontSettings & {
            show: boolean;
            position: "left" | "right" | "top" | "bottom";
            markerSize: number;
            markerShape: "square" | "rhombus" | "triangle" | "triangle2" | "circle";
            width: number;
            height: number;
        };
        valueAxis1: IFontSettings & ITitleFontSettings & IGridlineSettings & {
            show: boolean;
            side: "left" | "right";
            title: string;
            zeroLine: "visible" | "center" | "floating";
            logScale: boolean;
            axisSize: number;
            valueType: "numeric" | "percentage";
            valueDecimal: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
            percentageDecimal: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
            valueShortening: boolean;
            showValueAffixes: boolean;
            valuePrefix: string;
            valueSuffix: string;
            showGridlines: boolean;
        };
        valueAxis2: IFontSettings & ITitleFontSettings & {
            show: boolean;
            side: "left" | "right";
            title: string;
            zeroLine: "visible" | "center" | "floating";
            logScale: boolean;
            axisSize: number;
            valueType: "numeric" | "percentage";
            valueDecimal: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
            percentageDecimal: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
            valueShortening: boolean;
            showValueAffixes: boolean;
            valuePrefix: string;
            valueSuffix: string;
        };
        timeAxis: IFontSettings & IGridlineSettings & {
            show: boolean;
            maxUnitWidth: number;
            minUnitWidth: number;
            showGridlines: boolean;
        };
        holidayHighlight: IHolidayHighlightStyle & {
            show: boolean;
        };
        thresholds: IThresholdCapabilities & {
            show: boolean;
            showThreshold2: boolean;
            showThreshold3: boolean;
        };
        stacks: {
            mode: "normal" | "proportional" | "based";
        };
        toolbar: {
            logScale: boolean;
            darkMode: boolean;
        };
        popup: {
            show: boolean;
            decimals: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        };
        displayUnits: {
             initialDisplayUnit: "1 ms" | "1 s" | "5 s" | "1 m" | "15 m" | "1 h" | "6 h" | "1 d" | "1 w" | "1 M" | "3 M" | "1 y" | "2 y" | "3 y" | "5 y" | "10 y" | "auto";
             '1_ms': boolean;
             '1_s': boolean;
             '5_s': boolean;
             "1_m": boolean;
             "15_m": boolean;
             "1_h": boolean;
             "6_h": boolean;
             "1_d": boolean;
             "1_w": boolean;
             "1_M": boolean;
             "3_M": boolean;
             "1_y": boolean;
             "2_y": boolean;
             "3_y": boolean;
             "5_y": boolean;
             "10_y": boolean;
        };

        advanced: {
            leftPadding: number,
            rightPadding: number,
            locale: null | "lv",
        };
        fillSettings: IFillSettings;
        license: ILicenseSettings;
        paid: {show: boolean};

        series1: IChartSeriesProperties;
        series2: IChartSeriesProperties;
        series3: IChartSeriesProperties;
        series4: IChartSeriesProperties;
        series5: IChartSeriesProperties;
        series6: IChartSeriesProperties;
        series7: IChartSeriesProperties;
        series8: IChartSeriesProperties;
        series9: IChartSeriesProperties;
        series10: IChartSeriesProperties;
        series11: IChartSeriesProperties;
        series12: IChartSeriesProperties;
        seriesValueLabels1: IChartSeriesValueLabelProperties;
        seriesValueLabels2: IChartSeriesValueLabelProperties;
        seriesValueLabels3: IChartSeriesValueLabelProperties;
        seriesValueLabels4: IChartSeriesValueLabelProperties;
        seriesValueLabels5: IChartSeriesValueLabelProperties;
        seriesValueLabels6: IChartSeriesValueLabelProperties;
        seriesValueLabels7: IChartSeriesValueLabelProperties;
        seriesValueLabels8: IChartSeriesValueLabelProperties;
        seriesValueLabels9: IChartSeriesValueLabelProperties;
        seriesValueLabels10: IChartSeriesValueLabelProperties;
        seriesValueLabels11: IChartSeriesValueLabelProperties;
        seriesValueLabels12: IChartSeriesValueLabelProperties;
    }

    interface displayUnitsMapping {
        '1_ms': string;
        '1_s': string;
        '5_s': string;
        "1_m": string;
        "15_m": string;
        "1_h": string;
        "6_h": string;
        "1_d": string;
        "1_w": string;
        "1_M": string;
        "3_M": string;
        "1_y": string;
        "2_y": string;
        "3_y": string;
        "5_y": string;
        "10_y": string;
    }

    export class Visual2 extends Visual {
        private defaultProperties: IChartVisualProperties;
        private customProperties: IChartVisualProperties;
        private currentSeries: ZoomCharts.Dictionary<boolean> = Object.create(null);
        private lastOptions: VisualUpdateOptions = null;
        private displayUnitsMapping: displayUnitsMapping;
        public initialDisplayUnitSet: boolean = false;
        private toolbarSettings: any;// = null;
        private darkMode: any;
        private MAX_THRESHOLD_COUNT: number = 3;

        constructor(options: VisualConstructorOptions) {
            super(options);
            version = "v1.3.0.0";
            releaseDate = "Mar 20, 2019";
            visualType = "advanced-timeseries-visual";
            visualName= "Advanced TimeSeries Visual";

            this.setLegendState = false;

            this.defaultProperties = {
                legend: {
                    show: false,
                    position: "bottom",
                    height: 0,
                    width: 0,
                    markerSize: 20,
                    markerShape: null,
                    fontColor: { solid: { color: "#000" } },
                    fontSize: 12,
                    fontFamily: "",
                    fontStyle: "",
                },
                valueAxis1: {
                    show: true,
                    side: "left",
                    fontColor: { solid: { color: "#000" } },
                    fontSize: 12,
                    fontFamily: "",
                    fontStyle: "",
                    title: null,
                    titleFontColor: { solid: { color: "#000" } },
                    titleFontSize: 16,
                    titleFontFamily: "",
                    titleFontStyle: "",
                    zeroLine: "visible",
                    logScale: false,
                    axisSize: 0,
                    valueType: "numeric",
                    valueDecimal: "auto",
                    percentageDecimal: "auto",
                    valueShortening: true,
                    showValueAffixes: false,
                    valuePrefix: "",
                    valueSuffix: "",
                    showGridlines: true,
                    lineType: "solid",
                    lineWidth: 1,
                    gridlineColor: { solid: { color: "#FFF" } },
                    gridlineOpacity: 20
                },
                valueAxis2: {
                    show: false,
                    side: "right",
                    fontColor: { solid: { color: "#000" } },
                    fontFamily: "",
                    fontStyle: "",
                    fontSize: 12,
                    title: null,
                    titleFontColor: { solid: { color: "#000" } },
                    titleFontSize: 16,
                    titleFontFamily: "",
                    titleFontStyle: "",
                    zeroLine: "visible",
                    logScale: false,
                    axisSize: 0,
                    valueType: "numeric",
                    valueDecimal: "auto",
                    percentageDecimal: "auto",
                    valueShortening: true,
                    showValueAffixes: false,
                    valuePrefix: "",
                    valueSuffix: "",
                },
                timeAxis: {
                    show: true,
                    fontColor: { solid: { color: "#000" } },
                    fontFamily: "",
                    fontStyle: "",
                    fontSize: 12,
                    maxUnitWidth: 200,
                    minUnitWidth: 1,
                    showGridlines: true,
                    lineType: "solid",
                    lineWidth: 1,
                    gridlineColor: { solid: { color: "#000" } },
                    gridlineOpacity: 10
                },
                holidayHighlight: {
                    show: true,
                    fillColor: { solid: { color: "#E6E6E6" } },
                    fillOpacity: 20,
                    lineWidth: 0,
                    lineType: "solid",
                    lineColor: { solid: { color: "#FFF" } },
                    lineOpacity: 100
                },
                thresholds: {
                    show: false,
                    thresholdType1: "line",
                    thresholdLineValue1: "0",
                    thresholdAreaFrom1: "",
                    thresholdAreaTo1: "",
                    thresholdValueAxis1: "primary",
                    thresholdPosition1: "above",
                    thresholdFillColor1: { solid: { color: "#FF8598" } },
                    thresholdFillColorOpacity1: 20,
                    thresholdLineColor1: { solid: { color: "#FF0000" } },
                    thresholdLineColorOpacity1: 50,
                    thresholdLineWidth1: 1,

                    showThreshold2: false,
                    thresholdType2: "line",
                    thresholdLineValue2: "0",
                    thresholdAreaFrom2: "",
                    thresholdAreaTo2: "",
                    thresholdValueAxis2: "primary",
                    thresholdPosition2: "above",
                    thresholdFillColor2: { solid: { color: "#FF8598" } },
                    thresholdFillColorOpacity2: 20,
                    thresholdLineColor2: { solid: { color: "#FF0000" } },
                    thresholdLineColorOpacity2: 50,
                    thresholdLineWidth2: 1,

                    showThreshold3: false,
                    thresholdType3: "line",
                    thresholdLineValue3: "0",
                    thresholdAreaFrom3: "",
                    thresholdAreaTo3: "",
                    thresholdValueAxis3: "primary",
                    thresholdPosition3: "above",
                    thresholdFillColor3: { solid: { color: "#FF8598" } },
                    thresholdFillColorOpacity3: 20,
                    thresholdLineColor3: { solid: { color: "#FF0000" } },
                    thresholdLineColorOpacity3: 50,
                    thresholdLineWidth3: 1,
                },
                stacks: {
                    mode: "normal",
                },
                toolbar: {
                    logScale: true,
                    darkMode: false,
                },
                popup: {
                    show: true,
                    decimals: "auto"
                },
                displayUnits: {
                    initialDisplayUnit: "auto",
                    '1_ms': false,
                    '1_s': false,
                    '5_s': false,
                    "1_m": true,
                    "15_m": false,
                    "1_h": true,
                    "6_h": true,
                    "1_d": true,
                    "1_w": true,
                    "1_M": true,
                    "3_M": true,
                    "1_y": true,
                    "2_y": false,
                    "3_y": false,
                    "5_y": false,
                    "10_y": false
                },
                advanced: {
                    leftPadding: 3,
                    rightPadding: 3,
                    locale: null,
                },
                license: {
                    key: "",
                    hash:"",
                    info: true
                },
                paid: {
                    show: false
                },
                fillSettings: {
                    gradient: "solid",
                    gradientMode: "horizontal",
                    gradientColor: {solid: {color: "#000"}},
                    opacity: 100,
                    gradientStep: 50,
                    baseColorLightnessAdjustment: 40,
                    baseColorHueAdjustment: 50,
                    baseColorSaturationAdjustment: 50
                },

                series1: this.getDefaultSeriesConfig(1),
                series2: this.getDefaultSeriesConfig(2),
                series3: this.getDefaultSeriesConfig(3),
                series4: this.getDefaultSeriesConfig(4),
                series5: this.getDefaultSeriesConfig(5),
                series6: this.getDefaultSeriesConfig(6),
                series7: this.getDefaultSeriesConfig(7),
                series8: this.getDefaultSeriesConfig(8),
                series9: this.getDefaultSeriesConfig(9),
                series10: this.getDefaultSeriesConfig(10),
                series11: this.getDefaultSeriesConfig(11),
                series12: this.getDefaultSeriesConfig(12),
                seriesValueLabels1: this.getDefaultSeriesValueLabelConfig(1),
                seriesValueLabels2: this.getDefaultSeriesValueLabelConfig(2),
                seriesValueLabels3: this.getDefaultSeriesValueLabelConfig(3),
                seriesValueLabels4: this.getDefaultSeriesValueLabelConfig(4),
                seriesValueLabels5: this.getDefaultSeriesValueLabelConfig(5),
                seriesValueLabels6: this.getDefaultSeriesValueLabelConfig(6),
                seriesValueLabels7: this.getDefaultSeriesValueLabelConfig(7),
                seriesValueLabels8: this.getDefaultSeriesValueLabelConfig(8),
                seriesValueLabels9: this.getDefaultSeriesValueLabelConfig(9),
                seriesValueLabels10: this.getDefaultSeriesValueLabelConfig(10),
                seriesValueLabels11: this.getDefaultSeriesValueLabelConfig(11),
                seriesValueLabels12: this.getDefaultSeriesValueLabelConfig(12),
            };

            this.displayUnitsMapping = {
                '1_ms': "millisecond",
                '1_s': "second",
                '5_s': "5 seconds",
                "1_m": "minute",
                "15_m": "15 minutes",
                "1_h": "hour",
                "6_h": "6 hours",
                "1_d": "day",
                "1_w": "week",
                "1_M": "month",
                "3_M": "quarter",
                "1_y": "year",
                "2_y": "2 years",
                "3_y": "3 years",
                "5_y": "5 years",
                "10_y": "decade",
            }

            if (this.chart) this.updateProperties();
        }

        private getDefaultSeriesValueLabelConfig(i: number): IChartSeriesValueLabelProperties {
            return {
                valueLabelPosition: "insideTopAuto",
                valueLabelAngle: 0,
                valueLabelBorderRadius: 0,
                valueLabelPadding: 1,
                fontColor: { solid: { color: "#000" } },
                fontSize: 14,
                fontFamily: "",
                fontStyle: "",
                backgroundColor: { solid: { color: "#FFF" } },
                backgroundColorOpacity: 40,
                backgroundLineColor: { solid: { color: "#FFF" } },
                backgroundLineColorOpacity: 40,
                backgroundLineWidth: 1,
                backgroundShadowColor: { solid: { color: "#FFF" } },
                backgroundShadowColorOpacity: 100,
                backgroundShadowBlur: 0,
                backgroundShadowPlacement: false,
                backgroundShadowOffsetXDirection: "up",
                backgroundShadowOffsetX: 0,
                backgroundShadowOffsetYDirection: "right",
                backgroundShadowOffsetY: 0,
                decimals: "auto"
            };
        }

        private getDefaultSeriesConfig(i: number): IChartSeriesProperties {
            let color = this.colors.getColor("zc-fc-color-" + i.toFixed(0)).value;
            return {
                show: true,
                name: null,
                type: "columns",
                valueLabelsEnabled: false,
                _defaultColor: { solid: { color: color } },
                lineColor: { solid: { color: color } },
                lineColorOpacity: 100,
                lineWidth: 2,
                lineType: "solid",
                lineSmoothing: true,
                lineMarker: "",
                lineMarkerSize: 16,
                fillColor: { solid: { color: color } },
                fillColorOpacity: 100,
                stack: "s" + i.toFixed(0),
                valueAxis: "primary",
                zIndex: 10,
                legendMarkerShape: null,
            };
        }

        protected createChart(zc: typeof ZoomCharts) {
            super.createChart(zc, (settings:any)=>{
                return addTimeChartInfoToolbar(settings, this);
            });
        }

        protected createSeries(options: VisualUpdateOptions, legendState: boolean = null) {
            super.createSeries(options, legendState);

            for (let k of Object.keys(this.currentSeries)) {
                this.currentSeries[k] = false;
            }
            for (let s of this.series) {
                this.currentSeries[s.id] = true;
            }
        }

        protected updateSeries(istr: string, series: ZoomCharts.Configuration.TimeChartSettingsSeriesLines | ZoomCharts.Configuration.TimeChartSettingsSeriesColumns) {

            let defaultConfig: IChartSeriesProperties = this.defaultProperties["series" + istr];
            let customConfig: IChartSeriesProperties = null;
            let config: IChartSeriesProperties = defaultConfig;
            if (this.customProperties) {
                customConfig = this.customProperties["series" + istr];

                if (customConfig) {
                    if (!customConfig.lineColor) customConfig.lineColor = defaultConfig._defaultColor;
                    if (!customConfig.fillColor) customConfig.fillColor = defaultConfig._defaultColor;
                }

                config = mergePropertiesIntoNew(customConfig, config, 0);
            }

            if (!config.show) {
                series.enabled = false;
                return;
            }

            series.extra.zIndex = config.zIndex;
            series.name = secureString(config.name || series.name);
            series.stack = config.stack;
            series.valueAxis = config.valueAxis;

            let lineSeries = <ZoomCharts.Configuration.TimeChartSettingsSeriesLines>series;
            let columnSeries = <ZoomCharts.Configuration.TimeChartSettingsSeriesColumns>series;

            let gradient = null;
            let fc = null;

            if (config.type === "area") {
                lineSeries.type = "line";
                lineSeries.style.lineColor = deriveColor(this.ZC.ZoomCharts, config.lineColor, config.lineColorOpacity);
                lineSeries.style.fillColor = deriveColor(this.ZC.ZoomCharts, config.fillColor, config.fillColorOpacity);
                lineSeries.style.lineWidth = config.lineWidth;
                lineSeries.style.marker = {
                    shape: <"circle">config.lineMarker || null,
                    width: config.lineMarkerSize
                };
                lineSeries.style.smoothing = !!config.lineSmoothing;
                fc = lineSeries.style.fillColor;
                delete (<any>series.style).gradient;
            } else if (config.type === "line") {
                series.type = "line";
                series.style.lineColor = deriveColor(this.ZC.ZoomCharts, config.lineColor, config.lineColorOpacity);
                series.style.fillColor = null;
                series.style.lineWidth = config.lineWidth;
                series.style.lineDash = getLineDash(config);
                lineSeries.style.marker = {
                    shape: <"circle">config.lineMarker || null,
                    width: config.lineMarkerSize,
                };
                lineSeries.style.smoothing = !!config.lineSmoothing;
                delete (<any>series.style).gradient;
            } else {
                series.type = "columns";
                series.style.lineColor = null;
                series.style.fillColor = deriveColor(this.ZC.ZoomCharts, config.fillColor, config.fillColorOpacity);
                fc = series.style.fillColor;
            }
            if (config.type === "area" || config.type == "columns") {
                let props = this.currentProps;
                if (props.fillSettings.gradient === "gradient"){
                    let color = this.ZC.ZoomCharts.Internal.Base.Colors.parse(props.fillSettings.gradientColor.solid.color);
                    gradient = [
                        [0, fc],
                        [props.fillSettings.gradientStep/100, fc],
                        [1, "rgba(" + color.R + "," + color.G + "," + color.B + ","+ props.fillSettings.opacity/100 +")"]
                    ];
                } else if (props.fillSettings.gradient === "derived") {
                    let coefH = (props.fillSettings.baseColorHueAdjustment - 50) / 50;
                    let coefS = (props.fillSettings.baseColorSaturationAdjustment - 50) / 50;
                    let coefL = (props.fillSettings.baseColorLightnessAdjustment - 50) / 50;
                    let color = this.ZC.ZoomCharts.Internal.Base.Colors.parse(fc);
                    let hsl = rgb2hsl(color.R, color.G, color.B);

                    let hslAdjusted = [
                        hsl[0] + coefH,
                        Math.max(0, Math.min(1,hsl[1] + coefS)),
                        Math.max(0, Math.min(1,hsl[2] + coefL))
                    ];
                    if (hslAdjusted[0] < 0){
                        hslAdjusted[0] += 1;
                    } else if (hslAdjusted[0] > 1){
                        hslAdjusted[0] -= 1;
                    }
                    let rgb = hsl2rgb(
                    hslAdjusted[0], hslAdjusted[1], hslAdjusted[2]
                    );

                    gradient = [
                        [0, fc],
                        [props.fillSettings.gradientStep/100, fc],
                        [1, "rgba(" + Math.round(rgb[0]) + "," + Math.round(rgb[1]) + "," + Math.round(rgb[2]) + ","+ props.fillSettings.opacity/100 +")"]
                    ];
                }
                series.style.fillGradient = gradient;
                if (gradient){
                    series.style.fillGradientMode = props.fillSettings.gradientMode?props.fillSettings.gradientMode:"horizontal";
                } else {
                    series.style.fillGradientMode = null;
                }
            }
            if (config.valueLabelsEnabled) {
                let vconfig: IChartSeriesValueLabelProperties = mergePropertiesIntoNew(this.customProperties["seriesValueLabels" + istr], this.defaultProperties["seriesValueLabels" + istr], 0);
                series.valueLabels = {
                    enabled: true,
                    minFontSize: 4,
                    position: vconfig.valueLabelPosition,
                    style: {
                        textStyle: { 
                            font: getFont(vconfig),
                            fillColor: vconfig.fontColor.solid.color
                        },
                        backgroundStyle: {
                            fillColor: deriveColor(this.ZC.ZoomCharts, vconfig.backgroundColor, vconfig.backgroundColorOpacity),
                            lineColor: deriveColor(this.ZC.ZoomCharts, vconfig.backgroundLineColor, vconfig.backgroundLineColorOpacity),
                            lineWidth: vconfig.backgroundLineWidth,
                            shadowColor: deriveColor(this.ZC.ZoomCharts, vconfig.backgroundShadowColor, vconfig.backgroundShadowColorOpacity),
                            shadowBlur: vconfig.backgroundShadowBlur
                        },
                        angle: vconfig.valueLabelAngle,
                        borderRadius: vconfig.valueLabelBorderRadius,
                        padding: vconfig.valueLabelPadding
                    },
                    contentsFunction: (v) => {
                        if (!v == null) return "";
                        let valueStr = null;
                        if(vconfig.decimals != "auto") {
                            valueStr = v.toFixed(vconfig.decimals);
                        } else {
                            valueStr = powerbi.extensibility.utils.formatting.valueFormatter.format(v, series.extra.format);
                        }
                        return valueStr;

                    }
                };
                series.valueLabels = setShadowOffsetSettings(series.valueLabels, vconfig);
            }
            series.style.legend.marker.shape = config.legendMarkerShape;
        }

        private createStackConfig(props: IChartVisualProperties): ZoomCharts.Dictionary<ZoomCharts.Configuration.LinearChartSettingsStack> {
            return {
                default: { type: props.stacks.mode },
                s1: { type: props.stacks.mode },
                s2: { type: props.stacks.mode },
                s3: { type: props.stacks.mode },
                s4: { type: props.stacks.mode },
                s5: { type: props.stacks.mode },
                s6: { type: props.stacks.mode },
                s7: { type: props.stacks.mode },
                s8: { type: props.stacks.mode },
                s9: { type: props.stacks.mode },
            };
        }

        private updateProperties(options?: VisualUpdateOptions) {
            if (options) {
                let config = <IChartVisualProperties><any>options.dataViews[0].metadata.objects;
                
                this.customProperties = { ...config }; //Spread operator copies properties of config to the new object
                //otherwise: consider that deleting properties of PBI cached objects will cause problems restoring them.
        
            }

            if (this.chart) {
                let props = mergePropertiesIntoNew(this.customProperties, this.defaultProperties);
                props = handlePaidPopups(this, props);
                this.currentProps = props;
                this.setLegendState = props.legend.show;
                let settings:any = {
                    chartTypes: {
                        columns: <ZoomCharts.Configuration.TimeChartSettingsSeriesColumns> {
                            style: {
                                padding: [
                                    props.advanced.leftPadding,
                                    props.advanced.rightPadding
                                ]
                            }
                        }
                    },
                    timeAxis: {
                        enabled: props.timeAxis.show,
                        style: {
                            majorTimeLabel: {
                                font: getFont(props.timeAxis),
                                fillColor: props.timeAxis.fontColor.solid.color
                            },
                            minorTimeLabel: {
                                font: getFont(props.timeAxis),
                                fillColor: props.timeAxis.fontColor.solid.color
                            }
                        },
                        maxUnitWidth: props.timeAxis.maxUnitWidth ? props.timeAxis.maxUnitWidth : Math.max(2, this.series.length) * 100,
                        minUnitWidth: props.timeAxis.minUnitWidth,
                        showHolidays: props.holidayHighlight.show,
                        vgrid: props.timeAxis.showGridlines
                    },
                    stacks: this.createStackConfig(props),
                    valueAxis: {
                        "primary": {
                            enabled: props.valueAxis1.show,
                            side: props.valueAxis1.side,
                            title: secureString(props.valueAxis1.title),
                            zeroLine: props.valueAxis1.zeroLine,
                            logScale: props.valueAxis1.logScale,
                            hgrid: props.valueAxis1.showGridlines,
                            size: (props.valueAxis1.axisSize > 0 ? props.valueAxis1.axisSize : null),
                            style: {
                                valueLabel: {
                                    textStyle: {
                                        font: getFont(props.valueAxis1),
                                        fillColor: props.valueAxis1.fontColor.solid.color
                                    }
                                },
                                title: {
                                    textStyle: {
                                        font: getTitleFont(props.valueAxis1),
                                        fillColor: props.valueAxis1.titleFontColor.solid.color
                                    }
                                }
                            },
                            thresholds: [],
                            valueFormatterFunction: (value: number, unitName: string, unitValue: number, name: string) => {
                                return valueFormatter(value, unitName, unitValue, name, "valueAxis1", props, this.primaryAxisFormatString);
                            }
                        },
                        "secondary": {
                            enabled: props.valueAxis2.show,
                            side: props.valueAxis2.side,
                            title: secureString(props.valueAxis2.title),
                            zeroLine: props.valueAxis2.zeroLine,
                            logScale: props.valueAxis2.logScale,
                            size: (props.valueAxis2.axisSize > 0 ? props.valueAxis2.axisSize : null),
                            style: {
                                valueLabel: {
                                    textStyle: {
                                        font: getFont(props.valueAxis2),
                                        fillColor: props.valueAxis2.fontColor.solid.color
                                    }
                                },
                                title: {
                                    textStyle: {
                                        font: getTitleFont(props.valueAxis2),
                                        fillColor: props.valueAxis2.titleFontColor.solid.color
                                    }
                                }
                            },
                            thresholds: [],
                            valueFormatterFunction: (value: number, unitName: string, unitValue: number, name: string) => {
                                return valueFormatter(value, unitName, unitValue, name, "valueAxis2", props, this.secondaryAxisFormatString);
                            }
                        }
                    },
                    info: {
                        enabled: props.popup.show,
                        valueFormatterFunction: (values, series) => {
                            if (!values) return "-";
                            let value = values[series.data.aggregation];
                            if(props.popup.decimals != "auto") {
                                let valueStr = value.toFixed(props.popup.decimals);
                                value = parseFloat(valueStr);
                            }
                            return powerbi.extensibility.utils.formatting.valueFormatter.format(
                                value,
                                series.extra.format);
                        }
                    },
                };

      
                if (!this.toolbarSettings){
                    this.toolbarSettings = this.defaultProperties.toolbar;
                }
                if (this.toolbarSettings.logScale != props.toolbar.logScale){
                    settings.toolbar = {
                        logScale: props.toolbar.logScale
                    };
                    this.toolbarSettings = settings.toolbar;
                }
                if (this.darkMode != props.toolbar.darkMode){
                    this.darkMode = props.toolbar.darkMode;
                    let chart:any = this.chart;
                    let dom:HTMLElement = chart._impl.shell.domLayer.container;
                    if (props.toolbar.darkMode){
                        if (!dom.className.match(/DVSL-dark/)){
                            dom.className += " DVSL-dark";
                        }
                    } else {
                        if (dom.className.match(/DVSL-dark/)){
                            dom.className = dom.className.replace(/ DVSL-dark/, "");
                        }
                    } 
                }

                settings.valueAxis.primary.style.hgrid = setGridlineSettings(settings.valueAxis.primary.style.hgrid, props, "valueAxis1", this);
                settings.timeAxis.style.vgrid = setGridlineSettings(settings.timeAxis.style.vgrid, props, "timeAxis", this);
                settings = setHolidayHighlightSettings(settings, props, this);
                settings = setThresholdSettings(settings, props, this);
                settings = addPieChartLegendSettings(settings, props);
                settings = toggleInfoButton(this, settings, props);

                this.chart.updateSettings(settings);
            }
        }

        @logExceptions()
        public update(options: VisualUpdateOptions) {
            let props = mergePropertiesIntoNew(this.customProperties, this.defaultProperties);
            if (options.dataViews && options.dataViews.length) {
                let dv = options.dataViews[0];
                let catCount = 0;

                if (typeof(dv.categorical) != "undefined" &&
                        typeof(dv.categorical.categories) != "undefined"){
                    catCount = dv.categorical.categories.length;  
                }
                if (catCount > 2){
                    paid_mode_required = true;
                } else {
                    paid_mode_required = false;
                }

                if (typeof(dv.categorical) != "undefined" &&
                        typeof(dv.categorical.values) != "undefined"){
                    catCount = 0;
                    for (let x = 0; x < dv.categorical.values.length; x++){
                        let c = dv.categorical.values[x];
                        for (let y in c.source.roles){
                            if (c.source.roles.hasOwnProperty(y)){
                                catCount++;
                            }
                        }
                    }
                }
                if (catCount > 2){
                    paid_mode_required = true;
                }

                this.updateProperties(options);
            }

            super.update(options);
        }

        @logExceptions()
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            const objectName = options.objectName;

            let props = mergePropertiesIntoNew(this.customProperties, this.defaultProperties);
            let validValues: {
                [propertyName: string]: string[] | ValidationOptions;
            } = void 0;

            if (objectName !== "paid"){
                if (!props.paid.show) {
                    return null;
                }
            }
            if (objectName.substr(0, 17) === "seriesValueLabels") {
                const nostr = objectName.substr(17);
                if (!this.currentSeries["s" + nostr])
                    return [];

                const relseries = <IChartSeriesProperties>props["series" + nostr];
                if (!relseries.show || !relseries.valueLabelsEnabled)
                    return [];

                const seriesLabels = <IChartSeriesValueLabelProperties>props[objectName];
                if (!seriesLabels.backgroundShadowPlacement) {
                    delete seriesLabels.backgroundShadowOffsetXDirection;
                    delete seriesLabels.backgroundShadowOffsetYDirection;
                    delete seriesLabels.backgroundShadowOffsetX;
                    delete seriesLabels.backgroundShadowOffsetY;
                }

                validValues = {
                    valueLabelAngle: { numberRange: { min: 0, max: 360 } },
                    valueLabelBorderRadius: { numberRange: { min: 0, max: 50 } },
                    valueLabelPadding: { numberRange: { min: 0, max: 20 } },
                    backgroundColorOpacity: { numberRange: { min: 0, max: 100 } },
                    backgroundLineColorOpacity: { numberRange: { min: 0, max: 100 } },
                    backgroundLineWidth: { numberRange: { min: 0, max: 10 } },
                    backgroundShadowColorOpacity: { numberRange: { min: 0, max: 100 } },
                    backgroundShadowBlur: { numberRange: { min: 0, max: 10 } },
                    backgroundShadowOffsetX: { numberRange: { min: 0, max: 10 } },
                    backgroundShadowOffsetY: { numberRange: { min: 0, max: 10 } }
                };
            }

            if (objectName.length < 9 && objectName.substr(0, 6) === "series") {
                const nostr = objectName.substr(6);
                if (!this.currentSeries["s" + nostr])
                    return [];

                const sc = <IChartSeriesProperties>props["series" + nostr];
                if (sc.type === "line") {
                    delete sc.fillColor;
                    delete sc.fillColorOpacity;
                } else if (sc.type === "columns") {
                    delete sc.lineColor;
                    delete sc.lineWidth;
                    delete sc.lineColorOpacity;
                    delete sc.lineMarker;
                    delete sc.lineMarkerSize;
                    delete sc.lineSmoothing;
                    delete sc.lineType;
                } else if(sc.type === "area") {
                    delete sc.lineType;
                }


                if (!sc.lineMarker) {
                    delete sc.lineMarkerSize;
                }

                validValues = {
                    lineWidth: { numberRange: { min: (!sc.lineMarker && sc.type === "line") ? 1 : 0, max: 16 } },
                    lineMarkerSize: { numberRange: {min: 1, max: 50} },
                    lineColorOpacity: { numberRange: {min:0 , max: 100} },
                    fillColorOpacity: {numberRange: {min:0, max: 100}},
                    zIndex: { numberRange: {min: 0, max: 20} },
                };
            }

            if (!props[objectName]) {
                console.warn("enumerateObjectInstances - unknown name", options);
                return [];

            }

            let vals = props[objectName];
            let vkeys = Object.keys(vals);

            for (let k1 of vkeys) {
                if (vals[k1] !== false)
                    continue;

                let k1i = k1.indexOf("Enabled");
                if (k1i > 0) {
                    let k1x = k1.substr(0, k1i);
                    for (let k2 of vkeys) {
                        if (k2 !== k1 && k2.substr(0, k1i) === k1x)
                            delete vals[k2];
                    }
                }
            }
            if (objectName === "fillSettings"){
                validValues = {
                    opacity: { numberRange: { min: 0, max: 100 } },
                    gradientStep: { numberRange: { min: 0, max: 100 } },
                    baseColorHueAdjustment: { numberRange: { min: 0, max: 100 } },
                    baseColorLightnessAdjustment: { numberRange: { min: 0, max: 100 } },
                    baseColorSaturationAdjustment: { numberRange: { min: 0, max: 100 } }
                };
                if (props.fillSettings.gradient == "solid"){
                    delete vals.opacity;
                    delete vals.gradientStep;
                    delete vals.gradientMode;
                }
                if (props.fillSettings.gradient != "gradient"){
                    delete vals.gradientColor;
                }
                if (props.fillSettings.gradient != "derived"){
                    delete vals.baseColorLightnessAdjustment;
                    delete vals.baseColorHueAdjustment;
                    delete vals.baseColorSaturationAdjustment;
                }
            }

            if (objectName === "displayUnits"){
                if (this.hasMeasure){
                    return [];
                }
            }

            if (objectName === "legend") {
                validValues = {
                    markerSize: { numberRange: { min: 0, max: 50 } },
                    width: { numberRange: { min: 0, max: 1000 } },
                    height: { numberRange: { min: 0, max: 1000 } },
                };
            }

            if (objectName === "timeAxis") {
                if (!props.timeAxis.showGridlines) {
                    delete props.timeAxis.lineType;
                    delete props.timeAxis.lineWidth;
                    delete props.timeAxis.gridlineColor;
                    delete props.timeAxis.gridlineOpacity;
                }

                validValues = {
                    maxUnitWidth: { numberRange: { min: 0, max: 1000 } },
                    minUnitWidth: { numberRange: { min: 0, max: 1000 } },
                    lineWidth: { numberRange: {min: 0, max: 10} },
                    gridlineOpacity: { numberRange: {min: 0 , max: 100} }
                };
            }

            if (objectName === "advanced") {
                validValues = {
                    leftPadding: { numberRange: { min: 0, max: 15 } },
                    rightPadding: { numberRange: { min: 0, max: 15 } },
                };

                //tmp:
                delete props.advanced.locale;
            }

            if( objectName === "valueAxis1") {
                if (!props.valueAxis1.showValueAffixes) {
                    delete props.valueAxis1.valuePrefix;
                    delete props.valueAxis1.valueSuffix;
                }

                if (!props.valueAxis1.showGridlines) {
                    delete props.valueAxis1.lineType;
                    delete props.valueAxis1.lineWidth;
                    delete props.valueAxis1.gridlineColor;
                    delete props.valueAxis1.gridlineOpacity;
                } else {
                    if (props.valueAxis1.lineType !== "dashed") {
                        delete props.valueAxis1.lineWidth;
                    }
                }

                if (props.valueAxis1.valueType === "numeric") {
                    delete props.valueAxis1.percentageDecimal;
                } else if (props.valueAxis1.valueType === "percentage") {
                    delete props.valueAxis1.valueDecimal;
                    delete props.valueAxis1.valueShortening;
                }

                validValues = {
                    lineWidth: { numberRange: {min: 0, max: 10} },
                    gridlineOpacity: { numberRange: {min: 0 , max: 100} },
                    axisSize: { numberRange: {min: 0 , max: 500} }
                };
            }
            if( objectName === "valueAxis2") {
                if (!props.valueAxis2.showValueAffixes) {
                    delete props.valueAxis2.valuePrefix;
                    delete props.valueAxis2.valueSuffix;
                }

                if (props.valueAxis2.valueType === "numeric") {
                    delete props.valueAxis2.percentageDecimal;
                } else if (props.valueAxis2.valueType === "percentage") {
                    delete props.valueAxis2.valueShortening;
                    delete props.valueAxis2.valueDecimal;
                }

                validValues = {
                    axisSize: { numberRange: {min: 0 , max: 500} }
                };
            }

            if (objectName === "holidayHighlight") {
                validValues = {
                    fillOpacity: { numberRange: {min: 0 , max: 100} },
                    lineOpacity: { numberRange: {min: 0 , max: 100} },
                    lineWidth: { numberRange: {min: 0 , max: 10} },
                };
            }

            if (objectName === "thresholds") {
                toggleThresholdValues(1, props);

                toggleThresholdSettings(2, props);
                toggleThresholdSettings(3, props);

                validValues = thresholdValidValues(props);
            }

            return [{
                objectName: objectName,
                properties: <any>vals,
                validValues: validValues,
                selector: null
            }];
        }

        @logExceptions()
        public getSelectedDisplayUnits(props) {
            let ks = props.displayUnits;
            let displayUnits = [];
            
            for (let k of Object.keys(ks)) {
                if(k == "initialDisplayUnit") {
                    continue;
                }
                let val = ks[k];
                let name = this.displayUnitsMapping[k];
                if(val === false) {
                    continue;
                }
                
                k = k.replace("_", " ");
                let unit = {unit: k, name: name};
                displayUnits.push(unit);
            }
            return displayUnits;
        }
    }
}
