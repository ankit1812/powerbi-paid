/// <reference path="../../powerbi-free/ZoomChartsPieChartFree/src/visual.ts" />
module powerbi.extensibility.visual {
    interface IChartVisualProperties {
        donut: {
            radius: number;
            innerRadius: number;
            gauge: boolean;
            theme3d: boolean;
            others: boolean;
            maxSlicesVisible: number;
            dataSorting: "ascending" | "descending" | "auto";
        },
        legend: IPieLegendSettings,
        labels: IFontSettings & {
            show: boolean;
            colorInside: { solid: { color: string; } };
            colorOutside: { solid: { color: string; } };
            mode: "name" | "value" | "perc" | "name+value" | "name+perc" | "value+perc" | "name+value+perc";
            placement: "inside" | "outside";
            insideLabel: "always" | "auto" | "append";
            decimals: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
            decimalsPercentage: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
            connectorLength: number;
            connectorColor: { solid: { color: string; } };
            connectorWidth: number;
        },
        popup: {
            show: boolean;
            decimals: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
            decimalsPercentage: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        },
        fillSettings: IFillSettings,
        license: ILicenseSettings,
        paid: {show: boolean}

    }

    export class Visual2 extends Visual {
        private defaultProperties: IChartVisualProperties;
        private customProperties: IChartVisualProperties;
        private currentInfoButtonStatus: boolean;
        private licenseCheckStatus:boolean;
        private licenseDateStatus:boolean;
        constructor(options: VisualConstructorOptions) {
            super(options);

            version = "v1.1.0.14";
            releaseDate = "Oct 26, 2018";
            this.currentInfoButtonStatus = true;

            this.defaultProperties = {
                donut: {
                    radius: 60,
                    innerRadius: 30,
                    gauge: false,
                    theme3d: false,
                    others: true,
                    maxSlicesVisible: 15,
                    dataSorting: "auto",
                },
                legend: {
                    show: false,
                    position: "left",
                    height: 0,
                    width: 0,
                    markerSize: 16,
                    markerShape: "square",
                    fontColor: { solid: { color: "#000" } },
                    fontSize: 12,
                    fontFamily: "",
                    fontStyle: "",
                    floating: false
                },
                labels: {
                    show: true,
                    placement: "outside",
                    colorOutside: { solid: { color: "#000" } },
                    colorInside: { solid: { color: "#fff" } },
                    fontSize: 12,
                    fontFamily: "",
                    fontStyle: "",
                    mode: "name+perc",
                    insideLabel: "always",
                    decimals: "auto",
                    decimalsPercentage: "auto",
                    connectorLength: 20,
                    connectorColor: { solid: { color: "#000"}},
                    connectorWidth: 1,
                },
                popup: {
                    show: true,
                    decimals: "auto",
                    decimalsPercentage: "auto"
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
                    gradientColor: {solid: {color: "#000"}},
                    opacity: 100,
                    gradientStep: 50,
                    baseColorLightnessAdjustment: 40,
                    baseColorHueAdjustment: 50,
                    baseColorSaturationAdjustment: 50
                }
            };
            
            if (this.chart) this.updateProperties();
        }
        @logExceptions()
        protected createChart(zc: any){
            let self = this;
            super.createChart(zc, (settings:any)=>{
                return addPieChartInfoToolbar(settings, this);
            });
        }
        @logExceptions()
        private updateProperties(options?: VisualUpdateOptions) {
            if (options) {
                let config = <IChartVisualProperties><any>options.dataViews[0].metadata.objects;
                
                this.customProperties = { ...config }; //Spread operator copies properties of config to the new object
                //otherwise: consider that deleting properties of PBI cached objects will cause problems restoring them.
            }

            if (this.chart) {
                let props = mergePropertiesIntoNew(this.customProperties, this.defaultProperties);
                let license_status = validateLicense(this, props);
                console.log("Status", license_status);
                if (!props.paid.show){
                    props = this.defaultProperties; 
                    hidePaid(this.target);
                } else {
                    if (license_status != "licensed"){
                        displayPaid(this.target, this.host);
                    } else {
                        hidePaid(this.target);
                    }
                }

                let labelFont = getFont(props.labels);
                let legendOnSide = props.legend.position === "left" || props.legend.position === "right" || !props.legend.position;


                props.labels.insideLabel = props.labels.placement === "inside" ? "auto" : null;
                let sortField:any = null;
                if (props.donut.dataSorting != "auto"){
                    sortField =  (props.donut.dataSorting== "ascending") ? "-value" : "value";
                } else {
                    sortField = (a,b)=>{return a.extra.sortIndex - b.extra.sortIndex;}
                }


                let settings = {
                    theme: props.donut.theme3d ? this.ZC.PieChart.themes.raised : this.ZC.PieChart.themes.flat,
                    data: [{
                        sortField: sortField,
                        preloaded: this.pendingData
                    }],
                    pie: {
                        radius: props.donut.radius / 100,
                        innerRadius: props.donut.innerRadius / 100,
                        adaptiveRadius: true,
                        startAngle: props.donut.gauge ? -Math.PI : (-Math.PI / 2),
                        endAngle: props.donut.gauge ? 0 : (Math.PI * 3 / 2),
                    },
                    interaction: {
                        others: { 
                            enabled: props.donut.others,
                            maxSlicesVisible: props.donut.maxSlicesVisible
                        }
                    },
                    labels: {
                        enabled: props.labels.show,
                        insideLabel: props.labels.insideLabel,
                        connectorLength: props.labels.connectorLength,
                        connectors: (props.labels.connectorLength == 0) ? false : true
                    },
                    info: {
                        enabled: props.popup.show,
                        contentsFunction: (data, slice) => {
                            let f = this.formatter;
                            if (!f) return "";


                            let value = data.value;
                            if(props.popup.decimals != "auto") {
                                value = value.toFixed(props.popup.decimals);
                            }
                            value = f.format(value);
                            value = secureString(value);

                            let percent = slice.percent;
                            if (props.popup.decimalsPercentage != "auto") {
                                percent = percent.toFixed(props.popup.decimalsPercentage);
                            }
                            percent = f.format(percent);
                            percent = secureString(percent);

                            let content:string = secureString(data.name)
                            + " - " 
                            + value
                            + " (" 
                            + percent
                            + "%)";
                            return content;
                        }
                    },
                    slice: {
                        connectorStyle: {
                            lineColor: props.labels.connectorColor.solid.color,
                            lineWidth: props.labels.connectorWidth
                        },
                        style: {
                            label: {
                                textStyle: {
                                    fillColor: props.labels.colorOutside ? props.labels.colorOutside.solid.color : "#000",
                                    font: labelFont
                                }
                            },
                            insideLabel: {
                                textStyle: {
                                    fillColor: props.labels.colorInside ? props.labels.colorInside.solid.color : "#fff",
                                    font: labelFont
                                }
                            }

                        },
                        styleFunction: (s, d) => {
                            let t = "";
                            let p = s.percent;
                            let v = d.value;
                            if(props.labels.decimals != "auto") {
                                v = parseFloat(v);
                                v = v.toFixed(props.labels.decimals);
                            }
                            v = this.formatter.format(v);

                            if(props.labels.decimalsPercentage != "auto") {
                                p = parseFloat(p);
                                p = p.toFixed(props.labels.decimalsPercentage);
                            }
                            p = this.formatter.format(p) + "%";


                            switch (props.labels.mode) {
                                case "name":
                                    t = d.name;
                                    break;
                                case "perc":
                                    t = p;
                                    break;
                                case "value":
                                    t = v;
                                    break;
                                default:
                                case "name+perc":
                                    t = d.name + " " + p;
                                    break;
                                case "name+value":
                                    t = d.name + " " + v;
                                    break;
                                case "name+value+perc":
                                    t = d.name + " " + v + " (" + p + ")";
                                    break;
                                case "value+perc":
                                    t = v + " (" + p + ")";
                                    break;
                            }

                            switch (props.labels.placement) {
                                case "inside":
                                    s.label.text = null;
                                    s.insideLabel.text = d.nameLegend = secureString(t);
                                    break;
                                case "outside":
                                    s.label.text = d.nameLegend = secureString(t);
                                    s.insideLabel.text = null;
                                    break;
                            }

                            if (props.fillSettings.gradient === "gradient"){
                                let color = this.ZC.ZoomCharts.Internal.Base.Colors.parse(props.fillSettings.gradientColor.solid.color);
                                s.fillGradient = [
                                    [0, s.fillColor],
                                    [props.fillSettings.gradientStep/100, s.fillColor],
                                    [1, "rgba(" + color.R + "," + color.G + "," + color.B + ","+ props.fillSettings.opacity/100 +")"]
                                ];
                            } else if (props.fillSettings.gradient === "derived") {
                                let coefH = (props.fillSettings.baseColorHueAdjustment - 50) / 50;
                                let coefS = (props.fillSettings.baseColorSaturationAdjustment - 50) / 50;
                                let coefL = (props.fillSettings.baseColorLightnessAdjustment - 50) / 50;
                                let color = this.ZC.ZoomCharts.Internal.Base.Colors.parse(s.fillColor);
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

                                s.fillGradient = [
                                    [0, s.fillColor],
                                    [props.fillSettings.gradientStep/100, s.fillColor],
                                    [1, "rgba(" + Math.round(rgb[0]) + "," + Math.round(rgb[1]) + "," + Math.round(rgb[2]) + ","+ props.fillSettings.opacity/100 +")"]
                                ];
                            } else {
                                s.fillGradient = null;
                            }

                        }
                    },
                }
                settings = addPieChartLegendSettings(settings, props);
                settings = toggleInfoButton(this, settings, props);
                //sortField won't be updated if replaceData isn't called. No idea why as in SDK it is working fine.
                //this.chart.replaceData(this.pendingData);
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
            let props = mergePropertiesIntoNew(this.customProperties, this.defaultProperties);

            if (objectName.substr(0, 6) === "colors") {
                if (!props.paid.show) {
                    return null;
                }
                const depth = parseInt(objectName.substr(6), 10);
                let result: VisualObjectInstance[] = [];
                Data.enumerateSlices(objectName, depth - 1, this.pendingData, result, {});
                return result;
            }

            let validValues: {
                [propertyName: string]: string[] | ValidationOptions;
            } = void 0;
            let vals = props[objectName];

            if (vals == null) {
                console.warn("enumerateObjectInstances - unknown name", options);
                return [];
            }
            if (objectName !== "paid"){
                if (!props.paid.show) {
                    return null;
                }
           }

            let vkeys = Object.keys(vals);
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

            if (objectName === "donut") {
                validValues = {
                    radius: { numberRange: { min: 20, max: 100 } },
                    innerRadius: { numberRange: { min: 0, max: 95 } },
                    maxSlicesVisible: { numberRange: { min: 0, max: 100 } },
                };
            }

            if (objectName === "labels") {
                if (props.labels.placement === "inside") {
                    delete vals.colorOutside;
                    delete vals.connectorLength;
                    delete vals.connectorColor;
                    delete vals.connectorWidth;
                } else {
                    delete vals.colorInside;
                }

                validValues = {
                    connectorLength: { numberRange: { min: 0, max: 100 } },
                    connectorWidth: { numberRange: { min: 1, max: 10 } },
                };
            }

            if (objectName === "legend") {
                validValues = {
                    markerSize: { numberRange: { min: 0, max: 50 } },
                    width: { numberRange: { min: 0, max: 5000 } },
                    height: { numberRange: { min: 0, max: 5000 } },
                };
            }

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

            return [{
                objectName: objectName,
                properties: <any>vals,
                validValues: validValues,
                selector: null
            }];
        }
    }
}
