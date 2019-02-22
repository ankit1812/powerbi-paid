/// <reference path="../../powerbi-free/ZoomChartsNetChartFree/src/visual.ts" />

module powerbi.extensibility.visual {
    interface IChartCategoryProperties extends ILabelAndValueFontSettings {
        show: boolean;
        name: string;
        shape: "default" | "circle" | "rectangle" | "droplet";
        showImages: boolean;
        colorMode: "default" | "auto" | "fixed" | "dynamic";
        fillColor: { solid: { color: string; } };
        relativeSizes: boolean;
        minRadius: number;
        maxRadius: number;
        valueLocation: "inside" | "outside";
        labelLocation: "inside" | "outside";
        labelFormat: "default" | "name+(value)" | "value+(name)" | "name+value" | "value+name";
        valueAutoShortener: boolean;
        valueDecimals: "default" | "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }


    interface IChartVisualProperties {
        
        license: ILicenseSettings;
        paid: {show: boolean};
        legend: IFontSettings & {
            show: boolean;
            position: "left" | "right" | "top" | "bottom";
            markerSize: number;
            height: number;
            width: number;
        };
        nodes: {
            shape: "circle" | "rectangle" | "droplet";
            showImages: boolean;
            colorMode: "auto" | "fixed" | "dynamic";
            fillColor: { solid: { color: string; } };
            minRadius: number;
            maxRadius: number;
            valueLocation: "inside" | "outside";
            labelLocation: "inside" | "outside";
            labelFormat: "name+(value)" | "value+(name)" | "name+value" | "value+name";
            valueAutoShortener: boolean;
            valueDecimals: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        };
        links: IFontSettings & {
            dashed: boolean;
            fromDecoration: "" | "arrow" | "circle";
            toDecoration: "" | "arrow" | "circle";
            colorMode: "auto" | "fixed" | "dynamic";
            fillColor: { solid: { color: string; } };
            minWidth: number;
            maxWidth: number;
            linkLabelBackgroundColor: { solid: { color: string; } };
            linkLabelBackgroundOpacity: number;
            linkLabelBorderColor: { solid: { color: string; } };
            rotateLabelWithLink: boolean;
        };
        insideLabels: IFontSettings & {
            show: boolean;
            backgroundColor: { solid: { color: string; } };
            backgroundOpacity: number;
            fontSizeMode: "auto" | "fixed";
            borderRadius: number;
            padding: number;
        };
        outsideLabels: IFontSettings & {
            show: boolean;
            backgroundColor: { solid: { color: string; } };
            backgroundOpacity: number;
            fontSizeMode: "auto" | "fixed";
            borderRadius: number;
            padding: number;
        };
        
        category1: IChartCategoryProperties;
        category2: IChartCategoryProperties;
        category3: IChartCategoryProperties;
        category4: IChartCategoryProperties;
        category5: IChartCategoryProperties;
        category6: IChartCategoryProperties;
        category7: IChartCategoryProperties;
        category8: IChartCategoryProperties;
        category9: IChartCategoryProperties;
    /*    categoriesValueLabels1: IChartCategoryValueLabelProperties;
        categoriesValueLabels2: IChartCategoryValueLabelProperties;
        categoriesValueLabels3: IChartCategoryValueLabelProperties;
        categoriesValueLabels4: IChartCategoryValueLabelProperties;
        categoriesValueLabels5: IChartCategoryValueLabelProperties;
        categoriesValueLabels6: IChartCategoryValueLabelProperties;
        categoriesValueLabels7: IChartCategoryValueLabelProperties;
        categoriesValueLabels8: IChartCategoryValueLabelProperties;
        categoriesValueLabels9: IChartCategoryValueLabelProperties;
        */
    }

    export class Visual2 extends Visual {
        private defaultProperties: IChartVisualProperties;
        private customProperties: IChartVisualProperties;
        private currentCategories: ZoomCharts.Dictionary<boolean> = Object.create(null);
        public lastOptions: VisualUpdateOptions = null;
        public columnIndexes: IChartMetadataColumnIndexesObject = null;

        constructor(options: VisualConstructorOptions) {
            super(options);
            version = "v1.1.1.1";
            releaseDate = "Jan 24, 2019";
            visualType = "advanced-graph-visual";
            visualName= "Advanced Graph Visual";

            this.defaultProperties = {
                license: {
                    key: "",
                    hash:"",
                    info: true
                },
                paid: {
                    show: false
                },
                legend: {
                    show: false,
                    position: "bottom",
                    height: 0,
                    width: 225,
                    markerSize: 16,
                    fontColor: { solid: { color: "#000" } },
                    fontSize: 12,
                    fontFamily: "",
                    fontStyle: "",
                },
                nodes: {
                    shape: "circle",
                    showImages: true,
                    colorMode: "dynamic",
                    fillColor:  { solid: { color: "#8AD4EB" } },
                    minRadius: 10,
                    maxRadius: 100,
                    valueLocation: "inside",
                    labelLocation: "outside",
                    labelFormat: "name+(value)",
                    valueAutoShortener: true,
                    valueDecimals: "auto",
                },
                links: {
                    dashed: false,
                    fromDecoration: "",
                    toDecoration: "",
                    colorMode: "dynamic",
                    fillColor:  { solid: { color: "#000" } },
                    minWidth: 1,
                    maxWidth: 20,
                    fontColor: { solid: { color: "#000" } },
                    fontSize: 12,
                    fontFamily: "",
                    fontStyle: "",
                    linkLabelBackgroundColor: { solid: { color: "#fff" } },
                    linkLabelBackgroundOpacity: 100,
                    linkLabelBorderColor: { solid: { color: "grey" } },
                    rotateLabelWithLink: false
                },
                insideLabels: {
                    show: true,
                    fontColor: { solid: { color: "#000" } },
                    fontSizeMode: "auto",
                    fontSize: 12,
                    fontFamily: "",
                    fontStyle: "",
                    backgroundColor: { solid: { color: "#fff" } },
                    backgroundOpacity: 0,
                    borderRadius: 50,
                    padding: 2
                },
                outsideLabels: {
                    show: true,
                    fontColor: { solid: { color: "#000" } },
                    fontSizeMode: "auto",
                    fontSize: 12,
                    fontFamily: "",
                    fontStyle: "",
                    backgroundColor: { solid: { color: "#fff" } },
                    backgroundOpacity: 50,
                    borderRadius: 50,
                    padding: 2
                },

                category1: this.getDefaultCategoriesConfig(1),
                category2: this.getDefaultCategoriesConfig(2),
                category3: this.getDefaultCategoriesConfig(3),
                category4: this.getDefaultCategoriesConfig(4),
                category5: this.getDefaultCategoriesConfig(5),
                category6: this.getDefaultCategoriesConfig(6),
                category7: this.getDefaultCategoriesConfig(7),
                category8: this.getDefaultCategoriesConfig(8),
                category9: this.getDefaultCategoriesConfig(9),
                /*
                categoriesValueLabels1: this.getDefaultCategoriesValueLabelConfig(1),
                categoriesValueLabels2: this.getDefaultCategoriesValueLabelConfig(2),
                categoriesValueLabels3: this.getDefaultCategoriesValueLabelConfig(3),
                categoriesValueLabels4: this.getDefaultCategoriesValueLabelConfig(4),
                categoriesValueLabels5: this.getDefaultCategoriesValueLabelConfig(5),
                categoriesValueLabels6: this.getDefaultCategoriesValueLabelConfig(6),
                categoriesValueLabels7: this.getDefaultCategoriesValueLabelConfig(7),
                categoriesValueLabels8: this.getDefaultCategoriesValueLabelConfig(8),
                categoriesValueLabels9: this.getDefaultCategoriesValueLabelConfig(9),*/
                
            };
        }

        protected createChart(zc: typeof ZoomCharts) {
            super.createChart(zc, (settings:any)=>{
                return addNetChartInfoToolbar(settings, this, "GraphChart");
            });
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

                let legendOnSide = props.legend.position === "left" || props.legend.position === "right";

                let linkColor = props.links.fillColor ? props.links.fillColor.solid.color : null;
                if(props.links.colorMode == "auto") {
                    linkColor = "#000";
                }

                //currently disabled as maxWidth is disabled, as soon as link width would be dynamic, following can be used: 
                let linkWidth = props.links.maxWidth < props.links.minWidth ? props.links.minWidth : Math.min(props.links.minWidth, props.links.maxWidth);
                let self = this;

                let settings = {
                    legend: {
                        enabled: props.legend.show,
                        height: legendOnSide ? null : props.legend.height,
                        width: legendOnSide ? props.legend.width : null,
                        text: {
                            font: getFont(props.legend),
                            fillColor: props.legend.fontColor.solid.color
                        },
                        marker: {
                            size: props.legend.markerSize
                        },
                        panel: {
                            side: props.legend.position
                        }
                    },
                    style: {
                        node: {
                            imageCropping: true,
                            display: props.nodes.shape,
                            fillColor: props.nodes.fillColor ? props.nodes.fillColor.solid.color : null,
                        },
                        link: {
                            fillColor: linkColor,
                            fromDecoration: props.links.fromDecoration ? props.links.fromDecoration : null,
                            toDecoration: props.links.toDecoration ? props.links.toDecoration : null,
                            lineDash: props.links.dashed ? [10,10] : [100,0],
                            radius: linkWidth
                        },
                        linkLabel: {
                            textStyle: {
                                font: getFont(props.links),
                                fillColor: props.links.fontColor.solid.color,
                            },
                            backgroundStyle:{
                                fillColor: deriveColor(this.ZC.ZoomCharts, props.links.linkLabelBackgroundColor, props.links.linkLabelBackgroundOpacity),
                                lineColor: props.links.linkLabelBorderColor.solid.color
                            },
                            rotateWithLink: props.links.rotateLabelWithLink
                        },
                        nodeStyleFunction: (n) => {
                            return this.nodeStyle(n, props);
                        },
                        linkStyleFunction: (l) => {
                            return this.linkStyle(l, props);
                        }
                    },
                    events: {
                        onClick: (e, args) => {
                            if(args.clickCredits) {
                                e.preventDefault();
                                this.host.launchUrl(args.credits.url);
                            }
                        }
                    },
                    nodeMenu: {
                        contentsFunction: (data:any, node:any, callback:any)=>{
                            let val:string = "";

                            if(data.extra.popup) {
                                val = data.extra.popup;
                            } else {
                                val = "Name: " + secureString(data.extra.name) + "<br>";
                                val += "Value: " + powerbi.extensibility.utils.formatting.valueFormatter.format(
                                    data.extra.value,
                                    self.formatString);
                            }

                            callback(val);
                            return val;
                        }
                    }
                    /*,
                    info: {
                        enabled:true,
                        nodeContentsFunction: function(nodeData, node, callback) {
                            let html = null;
                            //console.log(this.host.tooltipService);
                            if(nodeData.extra.tooltip) {
                                html = nodeData.extra.tooltip;
                            }
                            return html;
                        }
                    }*/
                };
                settings = addNetChartLegendSettings(settings, props);
                settings = toggleInfoButton(this, settings, props);
                this.chart.updateSettings(settings);
            }
        }

        private getDefaultCategoriesConfig(i: number): IChartCategoryProperties {
            let color = "#01b8aa";
            return {
                show: false,
                name: null,
                shape: "default",
                showImages: true,
                colorMode: "default",
                fillColor: { solid: { color: color } },
                relativeSizes: false,
                minRadius: 10,
                maxRadius: 100,
                valueLocation: "inside",
                labelLocation: "outside",
                labelFormat: "default",
                valueAutoShortener: true,
                valueDecimals: "default",

                customInsideLabel: false,
                insideLabelsFontColor: { solid: { color: "#000" } },
                insideLabelsFontSizeMode: "default",
                fontSize: 12,
                insideLabelsFontFamily: "",
                insideLabelsFontStyle: "",
                insideLabelsBackgroundColor: { solid: { color: "#fff" } },
                insideLabelsBackgroundOpacity: 0,

                customOutsideLabel: false,
                outsideLabelsFontColor: { solid: { color: "#000" } },
                outsideLabelsFontSizeMode: "default",
                textSize: 12,
                outsideLabelsFontFamily: "",
                outsideLabelsFontStyle: "",
                outsideLabelsBackgroundColor: { solid: { color: "#fff" } },
                outsideLabelsBackgroundOpacity: 50,

            }
        }


        @logExceptions()
        public update(options: VisualUpdateOptions) {
            if (options.dataViews && options.dataViews.length) {
                this.lastOptions = options;
                this.updateProperties(options);
            }

            console.log("Data update called", options);
            super.update(options);
        }

        @logExceptions()
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            const objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];

            let props2 = mergePropertiesIntoNew(this.customProperties, this.defaultProperties);
            //for some reason we need to clone merged props here as in some cases we need defaultProperties intact, but they appear to be overriden.
            let props = JSON.parse(JSON.stringify(props2));

            let validValues: {
                [propertyName: string]: string[] | ValidationOptions;
            } = void 0;
            let vals = props[objectName];

            if (vals == null) {
                console.warn("enumerateObjectInstances - unknown name", options);
                return [];
            }

            //globally disabled inside labels
            let insideLabelsOn = true;
            if (!props.insideLabels.show) {
                delete vals.customInsideLabel;
                insideLabelsOn = false;
            }

            //globally disabled outside labels
            let outsideLabelsOn = true;
            if (!props.outsideLabels.show) {
                delete vals.customOutsideLabel;
                outsideLabelsOn = false;
            }

            //category1/2/3/...
            if (objectName.substr(0, 8) === "category") {
                let index = parseInt(objectName.substr(8), 11);
                let result: VisualObjectInstance[] = [];

                //Check to see if current nodes category exists
                if (!this.currentCategories[index]) {
                    return [];
                }

                let co = props["category"+index];
                if(!co.relativeSizes){
                    delete vals.minRadius;
                    delete vals.maxRadius;
                }

                if(co.colorMode == "dynamic") {
                    delete vals.fillColor;
                } else if (co.colorMode === "fixed") {
                    //
                } else {
                    delete vals.fillColor;
                }

                //no Field for images, so don't show 'Show Images' switch:
                if(!this.columnIndexes.imageColumnIndex) {
                    delete vals.showImages;
                }

                //show labelFormat only if both category label locations match.
                if(co.valueLocation != co.labelLocation) {
                    delete vals.labelFormat;
                }

                //if no inside labels for category:
                if(co.valueLocation != "inside" && co.labelLocation != "inside") {
                    delete vals.customInsideLabel;
                }
                //if no outside labels for category:
                if(co.valueLocation != "outside" && co.labelLocation != "outside") {
                    delete vals.customOutsideLabel;
                }

                //if no inside labels globally or category doesn't use custom inside labels, 
                //delete all inside lables for category
                if(!co.customInsideLabel || !insideLabelsOn) {
                    delete vals.fontSize;
                    delete vals.insideLabelsFontFamily;
                    delete vals.insideLabelsFontSizeMode;
                    delete vals.insideLabelsFontStyle;
                    delete vals.insideLabelsFontColor;
                    delete vals.insideLabelsBackgroundColor;
                    delete vals.insideLabelsBackgroundOpacity;
                }
                //... same for outside labels:
                if(!co.customOutsideLabel || !outsideLabelsOn) {
                    delete vals.textSize;
                    delete vals.outsideLabelsFontFamily;
                    delete vals.outsideLabelsFontSizeMode;
                    delete vals.outsideLabelsFontStyle;
                    delete vals.outsideLabelsFontColor;
                    delete vals.outsideLabelsBackgroundColor;
                    delete vals.outsideLabelsBackgroundOpacity;
                }

                //if no inside labels and no outside labels, then don't show value/label locations
                //and other fields related to values/labels
                if(!insideLabelsOn && !outsideLabelsOn) {
                    delete vals.valueLocation;
                    delete vals.labelLocation;
                    delete vals.labelFormat;
                    delete vals.valueAutoShortener;
                    delete vals.valueDecimals;
                }


                //If auto shortener enabled, hide value decimals as they won't be used
                //in this case
                if(co.valueAutoShortener) {
                    delete vals.valueDecimals;
                }
                validValues = {
                    minRadius: { numberRange: { min: 0, max: 200 } },
                    maxRadius: { numberRange: { min: 0, max: 200 } },
                    insideLabelsBackgroundOpacity: { numberRange: { min: 0, max: 100 } },
                    outsideLabelsBackgroundOpacity: { numberRange: { min: 0, max: 100 } },
                };

                result.push(<VisualObjectInstance>{
                    objectName: objectName,
                    validValues: validValues,
                    properties: <any>vals,
                    selector: null 
                });
                return result;
            }

            //other:
            if (objectName == 'legend') {
                if(isEmptyObject(this.currentCategories)) {
                    return [];
                }

                let legendOnSide = props.legend.position === "left" || props.legend.position === "right";
                if (legendOnSide) {
                    delete vals.height;
                } else {
                    delete vals.width;
                }

                validValues = {
                    markerSize: { numberRange: { min: 0, max: 50 } },
                    width: { numberRange: { min: 225, max: 1000 } },
                    height: { numberRange: { min: 0, max: 1000 } },
                };
            } else if (objectName == "nodes") {
                if(props.nodes.colorMode == "dynamic") {
                    delete vals.fillColor;
                } else if (props.nodes.colorMode == "fixed") {
                    //
                } else {
                    //auto
                    delete vals.fillColor;
                }

                //no Field for images, so don't show 'Show Images' switch:
                if(!this.columnIndexes.imageColumnIndex) {
                    delete vals.showImages;
                }

                //show labelFormat only if both category label locations match.
                if(props.nodes.valueLocation != props.nodes.labelLocation) {
                    delete vals.labelFormat;
                }

                //if no inside labels and no outside labels, then don't show value/label locations
                //and other fields related to values/labels
                if(!insideLabelsOn && !outsideLabelsOn) {
                    delete vals.valueLocation;
                    delete vals.labelLocation;
                    delete vals.labelFormat;
                    delete vals.valueAutoShortener;
                    delete vals.valueDecimals;
                }

                //If auto shortener enabled, hide value decimals as they won't be used
                //in this case
                if(props.nodes.valueAutoShortener) {
                    delete vals.valueDecimals;
                }

                validValues = {
                    minRadius: { numberRange: { min: 0, max: 200 } },
                    maxRadius: { numberRange: { min: 0, max: 200 } },
                };
            } else if (objectName == "links") {
                if (props.links.colorMode === "fixed") {
                    //
                } else {
                    delete vals.fillColor;
                }

                //No Field is set for link labels, so don't show related settings:
                if(!this.columnIndexes.linkLabelColumnIndex) {
                    delete vals.linkLabelBackgroundColor;
                    delete vals.linkLabelBackgroundOpacity;
                    delete vals.linkLabelBorderColor;
                    delete vals.rotateLabelWithLink;
                    delete vals.fontStyle;
                    delete vals.fontSize;
                    delete vals.fontFamily;
                    delete vals.fontColor;
                }

                validValues = {
                    minWidth: { numberRange: { min: 0, max: 20 } },
                    maxWidth: { numberRange: { min: 0, max: 20 } },
                    linkLabelBackgroundOpacity: { numberRange: { min: 0, max: 100 } },
                };
            } else if(objectName == "insideLabels") {
                if(props.insideLabels.fontSizeMode == "auto") {
                    delete vals.fontSize;
                }

                validValues = {
                    backgroundOpacity: { numberRange: { min: 0, max: 100 } },
                    borderRadius: { numberRange: { min: 0, max: 50 } },
                    padding: { numberRange: { min: 0, max: 20 } }
                };

            } else if (objectName == "outsideLabels") {
                if(props.outsideLabels.fontSizeMode == "auto") {
                    delete vals.fontSize;
                }

                validValues = {
                    backgroundOpacity: { numberRange: { min: 0, max: 100 } },
                    borderRadius: { numberRange: { min: 0, max: 50 } },
                    padding: { numberRange: { min: 0, max: 20 } }
                };
            } 

            objectEnumeration = [{
                objectName: objectName,
                properties: <any>vals,
                validValues: validValues,
                selector: null
            }];
            return objectEnumeration;
        }

        public linkStyle(l, props) {
            l.label = null;
            if(l.data.extra) {
                if(l.data.extra.linkLabel) {
                    l.label = l.data.extra.linkLabel;
                } else if(l.data.extra.linkValue) {
                    l.label = formatText(Math.round(l.data.extra.linkValue*100/100));
                }
            }
            if(l.data.extra.linkWidth) {
                let props_min = props.links.minWidth;
                let props_max = props.links.maxWidth;

                let lw = parseFloat(l.data.extra.linkWidth);
                if(!isNaN(lw)) {
                    let min = Math.min(lw, props_max);
                    lw = Math.max(min, props_min);
                } else {
                    lw = 1;
                }
                l.radius = lw;
            }
            
            let linkColorMode = props.links.colorMode;
            if(linkColorMode == "dynamic") {
                if(l.data.extra && l.data.extra.linkColor && isValidColor(l.data.extra.linkColor)) {
                    l.fillColor = l.data.extra.linkColor;
                } else {
                    //fallback to 'auto'
                    l.fillColor = this.defaultProperties.links.fillColor.solid.color;
                }
            }
            return l;
        }

        public nodeStyle(n, props) {
            let belonging_category = Data.getNodeBelongingCategory(this.currentCategories, n.data);
            let cprops = props;
            if(belonging_category) {
                cprops = belonging_category.props;
            }
            
            //if no extra, then there must be an error, don't style such nodes.
            if(!n.data.extra) {
                return;
            }

            let self = this;
            n.label = null;

            if (cprops.show == true && cprops.relativeSizes){
                let relativeMinRadius:any;
                let relativeMaxRadius:any;
                if(cprops.minRadius) {
                    relativeMinRadius = cprops.minRadius;
                }
                if(cprops.maxRadius) {
                    relativeMaxRadius = cprops.maxRadius;
                }
                n.radius = relativeMinRadius + (relativeMaxRadius - relativeMinRadius) * n.data.extra.relativeRatio;
            } else {
                n.radius = props.nodes.minRadius + (props.nodes.maxRadius - props.nodes.minRadius) * n.data.extra.absoluteRatio;
            }
            n.lineColor = null;
            n.shadowBlur = null;
            n.shadowColor = null;

            let current_fillColor = n.fillColor;

            let nodeColorMode = getProperValue(props, cprops, "nodes", "colorMode");

            if(nodeColorMode == "dynamic") {
                if(n.data.extra && n.data.extra.nodeColor) {
                    n.fillColor = n.data.extra.nodeColor;
                }
            }

            //check if color is valid and fallback to 'category' default:
            if (!isValidColor(n.fillColor)) {
                n.fillColor = current_fillColor;
            }

            if (n.selected){
                n.lineColor = "black";
                n.lineWidth = n.radius*0.3*self.zoom;
            } else if (n.hovered){
                n.lineColor = "rgba(0,0,0,0.5)";
                n.lineWidth = n.radius*0.3*self.zoom;
            } else if (this.current_selection.length){
                if (!this.cached_color_light[n.fillColor]){
                    let ccolor = n.fillColor;
                    if(isHexColor(n.fillColor)) {
                        ccolor = getRGBAColorFromHexColor(n.fillColor, "0.5");
                    } else if(isCSSColor(n.fillColor)) {
                        ccolor = getRGBAColorFromHexColor(getHexColorFromCssColor(n.fillColor), "0.5");
                    } else if(isRGBAColor) {
                        ccolor = n.fillColor.replace(/[^,]+(?=\))/, '0.5');
                    }
                    this.cached_color_light[n.fillColor] = ccolor;
                }
                n.fillColor = this.cached_color_light[n.fillColor];
            }

            //node images:
            let showImages = getProperValue(props, cprops, "nodes", "showImages");
            if(showImages) {
                n.image = n.data.extra && n.data.extra.image ? n.data.extra.image : null;
            } else {
                n.image = null;
            }


            //no items detected, so create those:
            if (typeof(n.data.extra.items) == "undefined"){
                n.data.extra.items = {};
                this.createInnerLabel(n, "", props, cprops);
                this.createOuterLabel(n, "", props, cprops);
            }


            //labels - hide/show/update:

            let label:string = "(empty)";
            let name = n.data.extra.name;
            if (name){
                label = name+"";
            }

            let valueAutoShortener = getProperValue(props, cprops, "nodes", "valueAutoShortener");
            let value = n.data.extra.value;
            if (valueAutoShortener) {
                value = (formatText(Math.round(n.data.extra.value*100)/100));
            } else {
                let valueDecimals:any = getProperValue(props, cprops, "nodes", "valueDecimals");
                if(valueDecimals != "auto") {
                    value = value.toFixed(valueDecimals);
                }
                //value = powerbi.extensibility.utils.formatting.valueFormatter.format(
                //    value,
                //    series.extra.format);
            }
            value = "" + value;

            //value and label location:
            let valueLocation = getProperValue(props, cprops, "nodes", "valueLocation"); 
            let labelLocation = getProperValue(props, cprops, "nodes", "labelLocation"); 
            
            let i1:any=null;
            let i2:any=null;
            if(valueLocation == labelLocation) {
                let format = getProperValue(props, cprops, "nodes", "labelFormat");
                label = this.formatLabelAndValue(value, name, format);

                if(valueLocation == "inside") {
                    i1 = this.updateInnerLabel(n, label, props, cprops);
                } else {
                    i1 = this.updateOuterLabel(n, label, props, cprops);
                }
            } else if(valueLocation == "inside") {
                i1 = this.updateOuterLabel(n, label, props, cprops);
                i2 = this.updateInnerLabel(n, value, props, cprops);
            } else if (valueLocation == "outside") {
                i1 = this.updateOuterLabel(n, value, props, cprops);
                i2 = this.updateInnerLabel(n, label, props, cprops);
            }

            n.items = [];
            if (i1) n.items.push(i1);
            if (i2) n.items.push(i2);
            
            return n;
        }

        public createInnerLabel(n, label, props, cprops) {
            let fontColor = getProperValue(props, cprops, "insideLabels", "fontColor", "insideLabelsFontColor", !cprops.customInsideLabel);
            let fontSizeMode = getProperValue(props, cprops, "insideLabels", "fontSizeMode", "insideLabelsFontSizeMode", !cprops.customInsideLabel);
            let font;
            if(fontSizeMode == "auto") {
                let fontSize = Math.round(n.radius/2);
                font = getProperFont(props, cprops, "insideLabels", fontSize, !cprops.customInsideLabel);
            } else { //"fixed"
                font = getProperFont(props, cprops, "insideLabels", null, !cprops.customInsideLabel);
            }

            let backgroundColor = getProperValue(props, cprops, "insideLabels", "backgroundColor", "insideLabelsBackgroundColor", !cprops.customInsideLabel);
            let backgroundOpacity = getProperValue(props, cprops, "insideLabels", "backgroundOpacity", "insideLabelsBackgroundOpacity", !cprops.customInsideLabel);

            n.data.extra.items.insideLabel = {
                px: 0,
                py: 0,
                text: String(label),
                textStyle: {
                    fillColor: fontColor.solid.color,
                    font: font //Math.round(n.radius/2) + "px Arial"
                },
                backgroundStyle: {
                    fillColor: deriveColor(this.ZC.ZoomCharts, backgroundColor, backgroundOpacity)
                },
                borderRadius: props.insideLabels.borderRadius,
                padding: props.insideLabels.padding,
                scaleWithZoom: true,
                hoverEffect: false
            };

            n.items.push(n.data.extra.items.insideLabel);
        }

        public createOuterLabel(n, label, props, cprops) {
            let fontColor = getProperValue(props, cprops, "outsideLabels", "fontColor", "outsideLabelsFontColor", !cprops.customOutsideLabel);
            let backgroundColor = getProperValue(props, cprops, "outsideLabels", "backgroundColor", "outsideLabelsBackgroundColor", !cprops.customOutsideLabel);
            let backgroundOpacity = getProperValue(props, cprops, "outsideLabels", "backgroundOpacity", "outsideLabelsBackgroundOpacity", !cprops.customOutsideLabel);
            
            let fontSizeMode = getProperValue(props, cprops, "outsideLabels", "fontSizeMode", "outsideLabelsFontSizeMode", !cprops.customOutsideLabel);
            let font;
            if(fontSizeMode == "auto") {
                let fontSize = Math.round(n.radius/2);
                font = getProperFont(props, cprops, "outsideLabels", fontSize, !cprops.customOutsideLabel);
            } else { //"fixed"
                font = getProperFont(props, cprops, "outsideLabels", null, !cprops.customOutsideLabel);
            }

            n.data.extra.items.outsideLabel = {
                px: 0,
                py: 1.33,
                text: String(label),
                textStyle: {
                    fillColor: fontColor.solid.color,
                    font: font
                },
                backgroundStyle: {
                    fillColor: deriveColor(this.ZC.ZoomCharts, backgroundColor, backgroundOpacity)
                },
                borderRadius: props.outsideLabels.borderRadius,
                padding: props.insideLabels.padding,
                scaleWithZoom: true,
                hoverEffect: false
            }
            n.items.push(n.data.extra.items.outsideLabel);
        }

        public updateInnerLabel(n, label, props, cprops) {
            let show = getProperValue(props, cprops, "insideLabels", "show", "showInsideLabels");
            if(!show) {
                return null;
            }

            let fontColor = getProperValue(props, cprops, "insideLabels", "fontColor", "insideLabelsFontColor", !cprops.customInsideLabel);
            let fontSizeMode = getProperValue(props, cprops, "insideLabels", "fontSizeMode", "insideLabelsFontSizeMode", !cprops.customInsideLabel);
            let font;
            if(fontSizeMode == "auto") {
                let fontSize = Math.round(n.radius/2);
                font = getProperFont(props, cprops, "insideLabels", fontSize, !cprops.customInsideLabel);
            } else { //"fixed"
                font = getProperFont(props, cprops, "insideLabels", null, !cprops.customInsideLabel);
            }

            let backgroundColor = getProperValue(props, cprops, "insideLabels", "backgroundColor", "insideLabelsBackgroundColor", !cprops.customInsideLabel);
            let backgroundOpacity = getProperValue(props, cprops, "insideLabels", "backgroundOpacity", "insideLabelsBackgroundOpacity", !cprops.customInsideLabel);

            let item = n.data.extra.items.insideLabel;
            item.text = String(label);
            item.textStyle.fillColor = fontColor.solid.color;
            item.textStyle.font = font;
            item.backgroundStyle.fillColor = deriveColor(this.ZC.ZoomCharts, backgroundColor, backgroundOpacity);
            item.borderRadius = props.insideLabels.borderRadius;
            item.padding = props.insideLabels.padding;
            item.py = 0;
            return item;
        }

        public updateOuterLabel(n, label, props, cprops) {
            let show = getProperValue(props, cprops, "outsideLabels", "show", "showOutsideLabels");
            if(!show) {
                return null;
            }

            let fontColor = getProperValue(props, cprops, "outsideLabels", "fontColor", "outsideLabelsFontColor", !cprops.customOutsideLabel);
            let backgroundColor = getProperValue(props, cprops, "outsideLabels", "backgroundColor", "outsideLabelsBackgroundColor", !cprops.customOutsideLabel);
            let backgroundOpacity = getProperValue(props, cprops, "outsideLabels", "backgroundOpacity", "outsideLabelsBackgroundOpacity", !cprops.customOutsideLabel);
            
            let fontSizeMode = getProperValue(props, cprops, "outsideLabels", "fontSizeMode", "outsideLabelsFontSizeMode", !cprops.customOutsideLabel);
            let font;
            if(fontSizeMode == "auto") {
                let fontSize = Math.round(n.radius/2);
                font = getProperFont(props, cprops, "outsideLabels", fontSize, !cprops.customOutsideLabel);
            } else { //"fixed"
                font = getProperFont(props, cprops, "outsideLabels", null, !cprops.customOutsideLabel);
            }
            let item = n.data.extra.items.outsideLabel;
            item.text = String(label);
            item.textStyle.fillColor = fontColor.solid.color;
            item.textStyle.font = font;
            item.backgroundStyle.fillColor = deriveColor(this.ZC.ZoomCharts, backgroundColor, backgroundOpacity);
            item.borderRadius = props.outsideLabels.borderRadius;
            item.padding = props.outsideLabels.padding;
            item.py = 1.33 + item.padding/n.radius;
            return item;
        }

        public formatLabelAndValue(value, name, format) {
            let label = "";
            if(format == "name+(value)") {
                label = name + " (" + value + ")"; 
            } else if(format == "value+(name)") {
                label = value + " (" + name + ")"; 
            } else if(format == "name+value") {
                label = name + ", " + value; 
            } else if(format == "value+name") {
                label = value + ", " + name; 
            }
            return label;
        }

    }
}
