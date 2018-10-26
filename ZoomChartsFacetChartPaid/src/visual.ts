/// <reference path="../../powerbi-free/ZoomChartsFacetChartFree/src/visual.ts" />
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

    interface IChartSeriesValueLabelProperties extends IFontSettings {
        decimals: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }

    interface IChartVisualProperties {
        legend: IPieLegendSettings,
        useColors: {
            show: boolean;
        };
        data: {
            dataSorting: "ascending" | "descending" | "default" | "unordered";
        };
        valueAxis1: IFontSettings & ITitleFontSettings & {
            show: boolean;
            side: "left" | "right";
            title: string;
            zeroLine: "visible" | "center" | "floating";
            logScale: boolean;
            valueType: "numeric" | "percentage";
            valueShortening: boolean;
            showValueAffixes: boolean;
            valuePrefix: string;
            valueSuffix: string;
        };
        valueAxis2: IFontSettings & ITitleFontSettings & {
            show: boolean;
            side: "left" | "right";
            title: string;
            zeroLine: "visible" | "center" | "floating";
            logScale: boolean;
            valueType: "numeric" | "percentage";
            valueShortening: boolean;
            showValueAffixes: boolean;
            valuePrefix: string;
            valueSuffix: string;
        };
        facetAxis: IFontSettings & ITitleFontSettings & {
            show: boolean;
            maxUnitWidth: number;
            size: number;
            title: string;
            titleEnabled: boolean;
            labelAngle: string | number;
        };
        stacks: {
            mode: "normal" | "proportional" | "based";
        };
        
        toolbar: {
            logScale: boolean;
        };

        popup: {
            show: boolean;
            decimals: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        };

        advanced: {
            leftPadding: number,
            rightPadding: number
        };
        fillSettings: IFillSettings;

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

    export class Visual2 extends Visual {
        private defaultProperties: IChartVisualProperties;
        private toolbarSettings: any;
        private currentProps: any;
        private customProperties: IChartVisualProperties;
        private currentSeries: ZoomCharts.Dictionary<boolean> = Object.create(null);
        private currentSortField:any = null;

        constructor(options: VisualConstructorOptions) {
            super(options);

            version = "v1.1.0.3";
            releaseDate = "Oct 23, 2018";
            visualName = "Advanced Column, Line, Area Visual";

            this.defaultProperties = {
                useColors: {
                    show: false
                },
                data: {
                    dataSorting: "default",
                },
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
                    floating: false
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
                    valueType: "numeric",
                    valueShortening: true,
                    showValueAffixes: false,
                    valuePrefix: "",
                    valueSuffix: "",
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
                    valueType: "numeric",
                    valueShortening: true,
                    showValueAffixes: false,
                    valuePrefix: "",
                    valueSuffix: "",
                },
                facetAxis: {
                    show: true,
                    labelAngle: "0",
                    size: 200,
                    maxUnitWidth: 400,
                    fontColor: { solid: { color: "#000" } },
                    fontFamily: "",
                    fontStyle: "",
                    fontSize: 12,
                    titleEnabled: false,
                    title: null,
                    titleFontColor: { solid: { color: "#000" } },
                    titleFontSize: 16,
                    titleFontFamily: "",
                    titleFontStyle: "",
                },
                stacks: {
                    mode: "normal"
                },

                popup: {
                    show: true,
                    decimals: "auto"
                },
                
                toolbar: {
                    logScale: true,
                },
                advanced: {
                    leftPadding: 3,
                    rightPadding: 3,
                },
                fillSettings: {
                    gradient: "solid",
                    gradientMode: "horizontal",
                    gradientColor: {solid: {color: "#000"}},
                    opacity: 100,
                    gradientStep: 80,
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

            if (this.chart) this.updateProperties();
        }

        private getDefaultSeriesValueLabelConfig(i: number): IChartSeriesValueLabelProperties {
            return {
                fontColor: { solid: { color: "#000" } },
                fontSize: 14,
                fontFamily: "",
                fontStyle: "",
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
        @logExceptions()
        protected createChart(zc: typeof ZoomCharts) {
            super.createChart(zc, (settings:any)=>{
                return addFacetChartInfoToolbar(settings, this);
            });
        }

        @logExceptions()
        protected createSeries(options: VisualUpdateOptions, legendState: boolean = null) {
            super.createSeries(options, legendState);

            for (let k of Object.keys(this.currentSeries)) {
                this.currentSeries[k] = false;
            }
            for (let s of this.series) {
                this.currentSeries[s.id] = true;
            }
        }
        @logExceptions()
        protected updateSeries(istr: string, series: ZoomCharts.Configuration.FacetChartSettingsSeriesLines | ZoomCharts.Configuration.FacetChartSettingsSeriesColumns) {

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

            let lineSeries = <ZoomCharts.Configuration.FacetChartSettingsSeriesLines>series;
            let columnSeries = <ZoomCharts.Configuration.FacetChartSettingsSeriesColumns>series;
            let gradient = null;
            let fc = null;
            if (config.type === "area") {
                series.type = "line";
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
                columnSeries.type = "columns";
                columnSeries.style.lineColor = null;
                columnSeries.style.fillColor = deriveColor(this.ZC.ZoomCharts, config.fillColor, config.fillColorOpacity);
                fc = columnSeries.style.fillColor;
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
                    style: {
                        textStyle: {
                            font: getFont(vconfig),
                            fillColor: vconfig.fontColor.solid.color
                        }
                    },
                    contentsFunction: (v) => {
                        if (!v == null) return "";
                        let valueStr:any = null;
                        if(vconfig.decimals != "auto") {
                            valueStr = v.toFixed(vconfig.decimals);
                        } else {
                            valueStr = powerbi.extensibility.utils.formatting.valueFormatter.format(v, series.extra.format);
                        }
                        return valueStr;
                    }
                };
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
                s10: { type: props.stacks.mode },
                s11: { type: props.stacks.mode },
                s12: { type: props.stacks.mode }
            };
        }

        private updateProperties(options?: VisualUpdateOptions) {
            if (options) {
                let config = <IChartVisualProperties><any>options.dataViews[0].metadata.objects;
 
                //This overrided useColors.show value coming from PBI cache
                //if (config && config.useColors && this.series.length !== 1) {
                //    config.useColors.show = false;
                //}
                this.customProperties = { ...config }; //Spread operator copies properties of config to the new object
                //otherwise: consider that deleting properties of PBI cached objects will cause problems restoring them.
            }

            if (this.chart) {
                let props = mergePropertiesIntoNew(this.customProperties, this.defaultProperties);
                this.currentProps = props;
 
                let faLabelFont = getFont(props.facetAxis);
                let faTitleFont = getTitleFont(props.facetAxis)
                
                this.setLegendState = props.legend.show;

                let faSize = 50;

                if ((<any>this.chart)._impl.assetsLoaded) {
                    if (parseInt(<any>props.facetAxis.labelAngle) === 0) {
                        faSize = 35 + 1.22 * this.ZC.ZoomCharts.Internal.Base.Graphics.getTextHeight(null, faLabelFont);
                        if (props.facetAxis.titleEnabled) {
                            faSize += 1.2 * this.ZC.ZoomCharts.Internal.Base.Graphics.getTextHeight(null, faTitleFont);
                        }
                        faSize = Math.ceil(faSize);
                    } else {
                        faSize = props.facetAxis.size;
                    }
                }


                let settings:any = {
                    advanced: {
                        highDPI: 2
                    },
                    chartTypes: {
                        columns: <ZoomCharts.Configuration.FacetChartSettingsSeriesColumns> {
                            style: {
                                padding: [
                                    props.advanced.leftPadding,
                                    props.advanced.rightPadding
                                ]
                            }
                        }
                    },
                    items: {
                        styleFunction: (i, id) => {
                            if (props.useColors.show)
                                i.values[0].style.fillColor = id.style.fillColor;
                        }
                    },
                    facetAxis: {
                        enabled: props.facetAxis.show,
                        size: faSize,
                        maxUnitWidth: props.facetAxis.maxUnitWidth,
                        labels: {
                            angle: parseFloat("" + props.facetAxis.labelAngle),
                            interLabelSpacing: 0,
                            allowOverflow: false,
                            textStyle: {
                                font: faLabelFont,
                                fillColor: props.facetAxis.fontColor && props.facetAxis.fontColor.solid.color
                            },
                        },
                        title: {
                            enabled: props.facetAxis.titleEnabled,
                            useFacetName: !props.facetAxis.title,
                            text: secureString(props.facetAxis.title),
                            margin: 0,
                            textStyle: {
                                font: faTitleFont,
                                fillColor: props.facetAxis.titleFontColor && props.facetAxis.titleFontColor.solid.color
                            }
                        }
                    },
                    stacks: this.createStackConfig(props),

                    info: {
                        enabled: props.popup.show,
                        valueFormatterFunction: (values, series) => {
                            if (!values) return "-";
                            let value = values[series.data.aggregation];
                            if(props.popup.decimals != "auto") {
                                value = value.toFixed(props.popup.decimals);
                            }
                            return powerbi.extensibility.utils.formatting.valueFormatter.format(
                                value,
                                series.extra.format);
                            
                        }
                    },
                    valueAxis: {
                        "primary": {
                            enabled: props.valueAxis1.show,
                            side: props.valueAxis1.side,
                            title: secureString(props.valueAxis1.title),
                            zeroLine: props.valueAxis1.zeroLine,
                            logScale: props.valueAxis1.logScale,
                            style: {
                                valueLabel: {
                                    textStyle: {
                                        font: getFont(props.valueAxis1),
                                        fillColor: props.valueAxis1.fontColor && props.valueAxis1.fontColor.solid.color
                                    }
                                },
                                title: {
                                    textStyle: {
                                        font: getTitleFont(props.valueAxis1),
                                        fillColor: props.valueAxis1.titleFontColor && props.valueAxis1.titleFontColor.solid.color
                                    }
                                }
                            },
                            valueFormatterFunction: (value: number, unitName: string, unitValue: number, name: string) => {
                                let str = name;
                                let v = name;

                                 //case if we need to calculate percentage instead of numeric value:
                                 if(props.valueAxis1.valueType == "percentage") {
                                    //if no shortening:
                                    if(!props.valueAxis1.valueShortening) {
                                        value *= 100;
                                        str = value + " %";
                                        v = str;
                                    } else {
                                        //if shortening: (actually this would be rare case, but still...)
                                        str = v = ((value / unitValue) * 100) + " " + unitName + " %";
                                    }                                   
                                } else {
                                    if(!props.valueAxis1.valueShortening) {
                                        str = value + "";
                                        v = str;
                                    }
                                }

                                if(props.valueAxis1.showValueAffixes) {
                                    str = props.valueAxis1.valuePrefix ? props.valueAxis1.valuePrefix + " " + v : v;
                                    str += props.valueAxis1.valueSuffix ? " " + props.valueAxis1.valueSuffix : "";
                                }
                                return str;
                            }
                        },
                        "secondary": {
                            enabled: props.valueAxis2.show,
                            side: props.valueAxis2.side,
                            title: secureString(props.valueAxis2.title),
                            zeroLine: props.valueAxis2.zeroLine,
                            logScale: props.valueAxis2.logScale,
                            style: {
                                valueLabel: {
                                    textStyle: {
                                        font: getFont(props.valueAxis2),
                                        fillColor: props.valueAxis2.fontColor && props.valueAxis2.fontColor.solid.color
                                    }
                                },
                                title: {
                                    textStyle: {
                                        font: getTitleFont(props.valueAxis2),
                                        fillColor: props.valueAxis2.titleFontColor && props.valueAxis2.titleFontColor.solid.color
                                    }
                                }
                            },
                            valueFormatterFunction: (value: number, unitName: string, unitValue: number, name: string) => {
                                let str = name;
                                let v = name;

                                //case if we need to calculate percentage instead of numeric value:
                                if(props.valueAxis2.valueType == "percentage") {
                                    //if no shortening:
                                    if(!props.valueAxis2.valueShortening) {
                                        value *= 100;
                                        str = value + " %";
                                        v = str;
                                    } else {
                                        //if shortening: (actually this would be rare case, but still...)
                                        str = v = ((value / unitValue) * 100) + " " + unitName + " %";
                                    }                                   
                                } else {
                                    if(!props.valueAxis2.valueShortening) {
                                        str = value + "";
                                        v = str;
                                    }
                                }

                                if(props.valueAxis2.showValueAffixes) {
                                    str = props.valueAxis2.valuePrefix ? props.valueAxis2.valuePrefix + " " + v : v;
                                    str += props.valueAxis2.valueSuffix ? " " + props.valueAxis2.valueSuffix : "";
                                }
                                return str;
                            }
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
                
                settings = addPieChartLegendSettings(settings, props);
                let sortField = null; //default
                if(props.data.dataSorting == "ascending" || props.data.dataSorting == "descending") {
                    sortField = (props.data.dataSorting == "ascending") ? "-value" : "value";
                } else {
                    sortField = (a,b)=>{return a.extra.index - b.extra.index};
                }
                /* without preloaded, data goes away.. */
                settings.data = {sortField: sortField, preloaded: this.pendingData};
                this.chart.updateSettings(settings);
            }
        }

        @logExceptions()
        public update(options: VisualUpdateOptions) {
            if (options.dataViews && options.dataViews.length) {
                this.updateProperties(options);
            }
            super.update(options);
        }

        @logExceptions()
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            const objectName = options.objectName;

            if (objectName.substr(0, 6) === "colors") {
                if (this.series.length !== 1
                    || !this.customProperties
                    || !this.customProperties.useColors
                    || !this.customProperties.useColors.show)
                    return [];
                const depth = parseInt(objectName.substr(6), 10);
                let result: VisualObjectInstance[] = [];
                Data.enumerateSlices(objectName, depth - 1, this.pendingData, result, {});
                return result;
            }

            let props = mergePropertiesIntoNew(this.customProperties, this.defaultProperties);
            let validValues: {
                [propertyName: string]: string[] | ValidationOptions;
            } = void 0;

            if (objectName.substr(0, 17) === "seriesValueLabels") {
                const nostr = objectName.substr(17);
                if (!this.currentSeries["s" + nostr])
                    return [];

                const relseries = <IChartSeriesProperties>props["series" + nostr];
                if (!relseries.show || !relseries.valueLabelsEnabled)
                    return [];
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

            if (objectName === "facetAxis") {
                if (props.facetAxis.labelAngle === 0 || props.facetAxis.labelAngle === "0") {
                    delete vals["size"];
                }

                validValues = {
                    size: { numberRange: { min: 20, max: 300 } },
                    maxUnitWidth: { numberRange: { min: 0, max: 1000 } },
                };
            }

            if (objectName === "legend") {
                validValues = {
                    markerSize: { numberRange: { min: 0, max: 50 } },
                    width: { numberRange: { min: 0, max: 5000 } },
                    height: { numberRange: { min: 0, max: 5000 } },
                };
            }

            if (objectName === "advanced") {
                validValues = {
                    leftPadding: { numberRange: { min: 0, max: 10 } },
                    rightPadding: { numberRange: { min: 0, max: 10 } },
                };
            }

            if( objectName === "valueAxis1") {
                if (!props.valueAxis1.showValueAffixes) {
                    delete props.valueAxis1.valuePrefix;
                    delete props.valueAxis1.valueSuffix;
                }
            }
            if( objectName === "valueAxis2") {
                if (!props.valueAxis2.showValueAffixes) {
                    delete props.valueAxis2.valuePrefix;
                    delete props.valueAxis2.valueSuffix;
                }
            }

            return [{
                objectName: objectName,
                properties: <any>vals,
                validValues: validValues,
                selector: null
            }];
        }
    }
}
