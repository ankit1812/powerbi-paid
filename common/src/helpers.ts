module powerbi.extensibility.visual {
    
    export class customizationInformer {
        /* mock class which is not needed in the paid version */
        constructor(...args){
        }
    }
    export function addFreeVersionLogo(...args){
        /* mock function which is not needed in the paid version */
    }
    export function setupCustomizationInformer(...args){
        /* mock */
    }

    type TToolbarItemSide = "left"|"right"|"top"|"bottom";
    type TLicenseStatus = "licensed"|"unlicensed"|"invalid"|"trial"|"trialExpired"|"expired"|null;
    let license_status:TLicenseStatus = null;
    let license:string = null; // text part of the license
    let paid_mode:boolean = false;
    export let paid_mode_required:boolean = false;

    export function handlePaidPopups(visual:any, props:any){
        license_status = validateLicense(visual, props);
        
        if (!props.paid.show && !paid_mode_required){
            paid_mode = false;
            props = visual.defaultProperties; 
            hidePaid(visual.target);
            hideExpired(visual.target);
        } else {
            paid_mode = true;
            if (license_status != "licensed"){
                if (license_status == "expired" || license_status == "trialExpired"){
                    displayExpired(visual.target, visual.host);
                    hidePaid(visual.target);
                } else {
                    displayPaid(visual.target, visual.host);
                    hideExpired(visual.target);
                }
            } else {
                hidePaid(visual.target);
                hideExpired(visual.target);
            }
        }
        /* handle info popup class states */
        toggleFreemiumLicenseDetails();
        return props;
    }
    export function toggleFreemiumLicenseDetails(){
        let t = <string>license_status;
        let pm = paid_mode;
        if (pm == false) t = "free";
        let l:any = document.getElementsByClassName("zc-info-window-license-more");
        for (let x = 0; x < l.length; x++){
            if (l[x].className.indexOf("zc-" + t) > -1){
                l[x].style.display = "block";
                let y = l[x].getElementsByClassName("license");
                if (y.length > 0){

                    y[0].innerText = "License: " + license.replace(/(PBI.*)/, " Service tag: $1");
                }

            } else {
                l[x].style.display = "none";
            }
        }
        

    }

    function addBaseInfoToolbar(settings:any, visual:any){
        settings.toolbar.extraItems = [
            {
                title: "Info",
                label: "",
                showLabel: false,
                side: <TToolbarItemSide>"top",
                align: <TToolbarItemSide>"right",
                cssClass: "DVSL-bar-btn-info",
                onClick: function(e){
                    toggleFreemium(e, visual.target, visual.host, {});
                }
            }
        ];
        return settings;
    }
    export function addNetChartInfoToolbar(settings:any, visual:any){
        settings.toolbar = {
            enabled: true,
            export: false
        };
        return addBaseInfoToolbar(settings, visual);
    }
    export function addPieChartInfoToolbar(settings:any, visual:any){
        settings.toolbar = {
            enabled: true,
            export: false,
            back: false,
            location: "outside",
            side:<TToolbarItemSide>"top",
            align:<TToolbarItemSide>"left",
        };
        return addBaseInfoToolbar(settings, visual);
    }
    export function addFacetChartInfoToolbar(settings:any, visual:any){
        return addBaseInfoToolbar(settings, visual);
    }
    export function addTimeChartInfoToolbar(settings:any, visual:any){
        return addBaseInfoToolbar(settings, visual);
    }
    export function addPieChartLegendSettings(settings:any, props:any){
        settings = addLegendSettings(settings, props);
        settings.legend.marker.shape = props.legend.markerShape || null;
        return settings;
    }

    export function addLegendSettings(settings:any, props:any){
        settings.legend =  {
            enabled: props.legend.show,
            height: props.legend.height?props.legend.height:null,
            minHeight: props.legend.height?props.legend.height:null,
            width: props.legend.width?props.legend.width:null,
            minWidth: props.legend.width?props.legend.width:null,
            text: {
                font: getFont(props.legend),
                fillColor: props.legend.fontColor.solid.color
            },
            marker: {
                size: props.legend.markerSize,
            },
            panel: {
                side: props.legend.position,
                margin: 0,
                padding: 0,
                floating: props.legend.floating
            }
        }
        return settings;
    }

    export function addLocalizationSettings(settings:any, props:any) {
        settings.localization = {
            othersLabel: secureString(props.donut.othersLabel) || "Others",
            previousLabel: secureString(props.donut.previousLabel) || "Previous"
        }
        return settings;
    }

    // Function will rewrite slice fraction size, so that it would be 
    // an 'actual' size. There is no need to set values:
    //      - settings.maxOthersFraction = 1;
    //      - settings.minSliceFraction = 0;
    //      - settings.navigationFraction = 0;
    // because nothing is impeding and slices are drawn correctly.
    export function sliceSizingControl(slice:any, props: any) {
        if (props.donut.othersSizing === "actual") {
            slice.fraction = slice.percent / 100;
        }
        return slice;
    }

    export interface IGridlineSettings {
        lineType: "solid" | "dotted" | "dashed";
        lineWidth: number;
        gridlineColor: { solid: { color: string; } };
        gridlineOpacity: number;
    }

    export function setGridlineSettings(gridlineSettings:any, properties:any, provertyValue:string, visual:any) {
        let property: string = (!properties.hasOwnProperty(provertyValue) ? null : provertyValue);

        if (property === null) {
            return {};
        }

        let localGridlineSettings: IGridlineSettings = properties[property];
        if (property === "valueAxis1" && properties[property].lineType !== "dashed") {
            localGridlineSettings.lineWidth = 1;
        }

        gridlineSettings = {
            lineColor: deriveColor(visual.ZC.ZoomCharts, localGridlineSettings.gridlineColor, localGridlineSettings.gridlineOpacity),
            lineWidth: localGridlineSettings.lineWidth,
            lineDash: getLineDash(localGridlineSettings)
        }
        return gridlineSettings;
    }

    export interface IHolidayHighlightStyle {
        fillColor: { solid: { color: string } };
        fillOpacity: number;
        lineWidth: number;
        lineType: "solid" | "dotted" | "dashed";
        lineColor: { solid: { color: string } };
        lineOpacity: number;
    }

    export function setHolidayHighlightSettings(settings: any, props: any, visual: any) {
        settings.timeAxis.style.dateHolidays = {
            fillColor: deriveColor(visual.ZC.ZoomCharts, props.holidayHighlight.fillColor, props.holidayHighlight.fillOpacity),
            lineColor: deriveColor(visual.ZC.ZoomCharts, props.holidayHighlight.lineColor, props.holidayHighlight.lineOpacity),
            lineDash: getLineDash(props.holidayHighlight),
            lineWidth: props.holidayHighlight.lineWidth
        }
        return settings;
    }

    export function mergeProperties<T>(source: T, target: T, maxDepth = 1) {
        if (!source)
            return;

        for (let k of Object.keys(source)) {
            let sv = source[k];
            let tv = target[k];
            if (typeof tv === "object" && maxDepth > 0) {
                mergeProperties(sv, tv, maxDepth - 1);
            } else if (sv !== void 0) {
                target[k] = sv;
            }
        }
    }

    export function mergePropertiesIntoNew<T>(source: T, target: T, maxDepth = 1): T {
        if (!source)
            return target;
            
        let ntarget = <T>JSON.parse(JSON.stringify(target));
        this.mergeProperties(source, ntarget, maxDepth);
        return ntarget;
    }

    export interface ITitleFontSettings {
        titleFontSize: number;
        titleFontFamily: string;
        titleFontStyle: "" | "bold" | "italic" | "bold italic";
        titleFontColor: { solid: { color: string; } };
    }

    export interface IFontSettings {
        fontSize: number;
        fontFamily: string;
        fontStyle: "" | "bold" | "italic" | "bold italic";
        fontColor?: { solid: { color: string; } };
    }

    export interface ILegendSettings extends IFontSettings {
        show: boolean;
        position: "left" | "right" | "top" | "bottom";
        markerSize: number;
        height: number;
        width: number;
        floating: boolean;
    }
    export interface IFillSettings {
        gradient: string;
        gradientColor: {solid: { color: string; } };
        gradientMode?: null | "horizontal" | "vertical";
        opacity: number;
        gradientStep: number;
        baseColorLightnessAdjustment: number;
        baseColorHueAdjustment: number;
        baseColorSaturationAdjustment: number;
    }
    export interface ILicenseSettings {
        key: string;
        hash: string;
        info: boolean;
    }
    export interface IPieLegendSettings extends ILegendSettings {
        markerShape: "square" | "rhombus" | "triangle" | "triangle2" | "circle";
    }

    export interface ILabelAndValueFontSettings {
        customInsideLabel: boolean;
        fontSize: number;
        insideLabelsFontFamily: string;
        insideLabelsFontSizeMode: "default" | "auto" | "fixed";
        insideLabelsFontStyle: "" | "bold" | "italic" | "bold italic";
        insideLabelsFontColor?: { solid: { color: string; } };
        insideLabelsBackgroundColor: { solid: { color: string; } };
        insideLabelsBackgroundOpacity: number;

        customOutsideLabel:boolean;
        textSize: number;
        outsideLabelsFontSizeMode: "default" | "auto" | "fixed";
        outsideLabelsFontFamily: string;
        outsideLabelsFontStyle: "" | "bold" | "italic" | "bold italic";
        outsideLabelsFontColor?: { solid: { color: string; } };
        outsideLabelsBackgroundColor: { solid: { color: string; } };
        outsideLabelsBackgroundOpacity: number;
    }

    export function getFont(config: IFontSettings, LfontStyle?:string, LfontSize?:string, LfontFamily?:string) : string {
        let fontStyle = LfontStyle ? LfontStyle : "fontStyle";
        let fontSize = LfontSize ? LfontSize : "fontSize";
        let fontFamily = LfontFamily ? LfontFamily : "fontFamily";
        return config[fontStyle] + " " + config[fontSize] + "px " + (config[fontFamily] || "Segoe UI, Helvetica, Arial, sans-serif");
    }

    export function getTitleFont(config: ITitleFontSettings) : string {
        return config.titleFontStyle + " " + config.titleFontSize + "px " + (config.titleFontFamily || "Segoe UI, Helvetica, Arial, sans-serif");
    }

    export function deriveColor(zc: typeof ZoomCharts, color: { solid: { color: string; } }, opacity?: number) {
        if (!color || !color.solid || !color.solid.color)
            return null;

        if (!zc)
            return color.solid.color;

        if (opacity == null)
            opacity = 1;
        else
            opacity /= 100;

        opacity = Math.min(1, Math.max(0, opacity));

        return zc.Internal.Base.Colors.derive(color.solid.color, 1, opacity);
    }

    export function getLimitedRadius(radius, default_props, category_props) {
        let min = default_props.nodes.minRadius;
        let max = default_props.nodes.maxRadius;

        //apply category specific values only if category is present & enabled
        if(category_props && category_props.show == true) {
            if(category_props.minRadius) {
                min = category_props.minRadius;
            }
            if(category_props.maxRadius) {
                max = category_props.maxRadius;
            }
        }

        let r = (radius <= min) ? min : Math.min(radius, max);
        return r;
    }

    export function getProperValue(default_props, category_props, default_object, name:string, category_name?:string, only_default?:boolean) {
        //category_name should be used if 'name' doesn't match with the name in props.
        //Checking default props and category props for same name will be ok in most cases nodes.shape == category1.shapes
        //But insideLabels.show is not the same as category1.show.
        let cname = category_name ? category_name : name;

        let value;
        let default_value;
        if(default_props[default_object]) {
            if(typeof default_props[default_object][name] != "undefined") {
                value = default_props[default_object][name];
                default_value = value;
            }
        }

        if (category_props && category_props.show == true && !only_default) {
            if (typeof category_props[cname] != "undefined") {
                value = category_props[cname];
 
                //what if value is actually set to "default" and means to use value from default prop
                if(value == "default") {
                    value = default_value;
                }
            }
        }

        return value;
    }

    export function getProperFont(props: IFontSettings, cprops: IFontSettings, default_object: string, fixed_size?:number, only_default?:boolean) : string {
        let category_names = {
            size: "",
            style: "",
            family: ""
        };
        if(default_object == "insideLabels") {
            category_names = {
                size: "fontSize",
                style: "insideLabelsFontStyle",
                family: "insideLabelsFontStyle"
            };
        } else if(default_object == "outsideLabels") {
            category_names = {
                size: "textSize",
                style: "outsideLabelsFontStyle",
                family: "outsideLabelsFontStyle"
            };
        }

        let fontSize;
        if(fixed_size) {
            fontSize = fixed_size;
        } else {
            fontSize = getProperValue(props, cprops, default_object, "fontSize", category_names.size, only_default);
        }

        let fontStyle = getProperValue(props, cprops, default_object, "fontStyle", category_names.style, only_default);
        let fontFamily = getProperValue(props, cprops, default_object, "fontFamily", category_names.family, only_default);

        return fontStyle + " " + fontSize + "px " + (fontFamily || "Segoe UI, Helvetica, Arial, sans-serif");
    }


    export function isValidColor(color) {
        if(typeof color == "undefined") {
            return false;
        }
 
        let isCSS = isCSSColor(color);
        if(isCSS) {
            return true;
        } else {
            let isHex = isHexColor(color);
            if(isHex) {
                return true;
            } else {
                let isRGBA = isRGBAColor(color);
                if(isRGBA) {
                    return true;
                }
            }
        }
          
        return false;
    }

    export function isHexColor(color) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
    }

    export function isRGBAColor(color) {
        return /^(rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$)|(^^rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*,){3}\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$)/i.test(color);
    }

    export function isCSSColor(color) {
        if(color == "transparent") {
            return true;
        } else if(color == "") {
            return false; //default should be used, so no - not valid.
        }

        let CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

        let query = color.toLowerCase();
        let index = -1;
        let x = CSS_COLOR_NAMES.some(function(element, i) {
            if (query === element.toLowerCase()) {
                index = i;
                return true;
            }
        });
        return x;
    }

    export function getHexColorFromCssColor(color) {
        let colors = {
            ALICEBLUE: '#F0F8FF',
            ANTIQUEWHITE: '#FAEBD7',
            AQUA: '#00FFFF',
            AQUAMARINE: '#7FFFD4',
            AZURE: '#F0FFFF',
            BEIGE: '#F5F5DC',
            BISQUE: '#FFE4C4',
            BLACK: '#000000',
            BLANCHEDALMOND: '#FFEBCD',
            BLUE: '#0000FF',
            BLUEVIOLET: '#8A2BE2',
            BROWN: '#A52A2A',
            BURLYWOOD: '#DEB887',
            CADETBLUE: '#5F9EA0',
            CHARTREUSE: '#7FFF00',
            CHOCOLATE: '#D2691E',
            CORAL: '#FF7F50',
            CORNFLOWERBLUE: '#6495ED',
            CORNSILK: '#FFF8DC',
            CRIMSON: '#DC143C',
            CYAN: '#00FFFF',
            DARKBLUE: '#00008B',
            DARKCYAN: '#008B8B',
            DARKGOLDENROD: '#B8860B',
            DARKGRAY: '#A9A9A9',
            DARKGREY: '#A9A9A9',
            DARKGREEN: '#006400',
            DARKKHAKI: '#BDB76B',
            DARKMAGENTA: '#8B008B',
            DARKOLIVEGREEN: '#556B2F',
            DARKORANGE: '#FF8C00',
            DARKORCHID: '#9932CC',
            DARKRED: '#8B0000',
            DARKSALMON: '#E9967A',
            DARKSEAGREEN: '#8FBC8F',
            DARKSLATEBLUE: '#483D8B',
            DARKSLATEGRAY: '#2F4F4F',
            DARKSLATEGREY: '#2F4F4F',
            DARKTURQUOISE: '#00CED1',
            DARKVIOLET: '#9400D3',
            DEEPPINK: '#FF1493',
            DEEPSKYBLUE: '#00BFFF',
            DIMGRAY: '#696969',
            DIMGREY: '#696969',
            DODGERBLUE: '#1E90FF',
            FIREBRICK: '#B22222',
            FLORALWHITE: '#FFFAF0',
            FORESTGREEN: '#228B22',
            FUCHSIA: '#FF00FF',
            GAINSBORO: '#DCDCDC',
            GHOSTWHITE: '#F8F8FF',
            GOLD: '#FFD700',
            GOLDENROD: '#DAA520',
            GRAY: '#808080',
            GREY: '#808080',
            GREEN: '#008000',
            GREENYELLOW: '#ADFF2F',
            HONEYDEW: '#F0FFF0',
            HOTPINK: '#FF69B4',
            INDIANRED: '#CD5C5C',
            INDIGO: '#4B0082',
            IVORY: '#FFFFF0',
            KHAKI: '#F0E68C',
            LAVENDER: '#E6E6FA',
            LAVENDERBLUSH: '#FFF0F5',
            LAWNGREEN: '#7CFC00',
            LEMONCHIFFON: '#FFFACD',
            LIGHTBLUE: '#ADD8E6',
            LIGHTCORAL: '#F08080',
            LIGHTCYAN: '#E0FFFF',
            LIGHTGOLDENRODYELLOW: '#FAFAD2',
            LIGHTGRAY: '#D3D3D3',
            LIGHTGREY: '#D3D3D3',
            LIGHTGREEN: '#90EE90',
            LIGHTPINK: '#FFB6C1',
            LIGHTSALMON: '#FFA07A',
            LIGHTSEAGREEN: '#20B2AA',
            LIGHTSKYBLUE: '#87CEFA',
            LIGHTSLATEGRAY: '#778899',
            LIGHTSLATEGREY: '#778899',
            LIGHTSTEELBLUE: '#B0C4DE',
            LIGHTYELLOW: '#FFFFE0',
            LIME: '#00FF00',
            LIMEGREEN: '#32CD32',
            LINEN: '#FAF0E6',
            MAGENTA: '#FF00FF',
            MAROON: '#800000',
            MEDIUMAQUAMARINE: '#66CDAA',
            MEDIUMBLUE: '#0000CD',
            MEDIUMORCHID: '#BA55D3',
            MEDIUMPURPLE: '#9370DB',
            MEDIUMSEAGREEN: '#3CB371',
            MEDIUMSLATEBLUE: '#7B68EE',
            MEDIUMSPRINGGREEN: '#00FA9A',
            MEDIUMTURQUOISE: '#48D1CC',
            MEDIUMVIOLETRED: '#C71585',
            MIDNIGHTBLUE: '#191970',
            MINTCREAM: '#F5FFFA',
            MISTYROSE: '#FFE4E1',
            MOCCASIN: '#FFE4B5',
            NAVAJOWHITE: '#FFDEAD',
            NAVY: '#000080',
            OLDLACE: '#FDF5E6',
            OLIVE: '#808000',
            OLIVEDRAB: '#6B8E23',
            ORANGE: '#FFA500',
            ORANGERED: '#FF4500',
            ORCHID: '#DA70D6',
            PALEGOLDENROD: '#EEE8AA',
            PALEGREEN: '#98FB98',
            PALETURQUOISE: '#AFEEEE',
            PALEVIOLETRED: '#DB7093',
            PAPAYAWHIP: '#FFEFD5',
            PEACHPUFF: '#FFDAB9',
            PERU: '#CD853F',
            PINK: '#FFC0CB',
            PLUM: '#DDA0DD',
            POWDERBLUE: '#B0E0E6',
            PURPLE: '#800080',
            REBECCAPURPLE: '#663399',
            RED: '#FF0000',
            ROSYBROWN: '#BC8F8F',
            ROYALBLUE: '#4169E1',
            SADDLEBROWN: '#8B4513',
            SALMON: '#FA8072',
            SANDYBROWN: '#F4A460',
            SEAGREEN: '#2E8B57',
            SEASHELL: '#FFF5EE',
            SIENNA: '#A0522D',
            SILVER: '#C0C0C0',
            SKYBLUE: '#87CEEB',
            SLATEBLUE: '#6A5ACD',
            SLATEGRAY: '#708090',
            SLATEGREY: '#708090',
            SNOW: '#FFFAFA',
            SPRINGGREEN: '#00FF7F',
            STEELBLUE: '#4682B4',
            TAN: '#D2B48C',
            TEAL: '#008080',
            THISTLE: '#D8BFD8',
            TOMATO: '#FF6347',
            TURQUOISE: '#40E0D0',
            VIOLET: '#EE82EE',
            WHEAT: '#F5DEB3',
            WHITE: '#FFFFFF',
            WHITESMOKE: '#F5F5F5',
            YELLOW: '#FFFF00',
            YELLOWGREEN: '#9ACD32'
        };

        let s = colors[color.toUpperCase()] ? colors[color.toUpperCase()] : "";
        return s;
    }

    export function getRGBAColorFromHexColor(color, opacity?: string) {
        opacity = opacity ? opacity : "1";
        let r:number = parseInt(color.substr(1,2), 16);
        let g:number = parseInt(color.substr(3,2), 16);
        let b:number = parseInt(color.substr(5,2), 16);
        return "rgba(" + [r,g,b].join(",") + "," + opacity + ")";
    }

    export interface IChartMetadataColumnIndexesObject {
        valueColumnIndex: null|number|string;
        imageColumnIndex: null|number|string;
        linkLabelColumnIndex: null|number|string;
        nodeColorColumnIndex: null|number|string;
        linkColorColumnIndex: null|number|string;
        fromNodesColumnIndex?: null|number|string;
        toNodesColumnIndex?: null|number|string;
        nodeLabelColumnIndex?: null|number|string;
        categoryClassColumnIndex?: null|number|string;
        nodePopupColumnIndexes?: null|Array<(string|number)>;
        linkWidthColumnIndex?: null|number|string;
    }

    export function getLineDash(config) {
        let width = config.lineWidth;
        let lineDash = [];
        if(config.lineType == "solid") {
            lineDash = [100, 0];
        } else if(config.lineType == "dashed") {
            lineDash = [width+5, width+10];
        } else if(config.lineType == "dotted") {
            lineDash = [width, width+7];
        }
        return lineDash;
    }


    export function rgb2hsl(r,g,b){
		r /= 255, g /= 255, b /= 255;

		let max = Math.max(r, g, b), min = Math.min(r, g, b);
		let h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return [ h, s, l ];
	}

	export function hsl2rgb(h, s, l) {
		let r, g, b;

		if (s == 0) {
			r = g = b = l; // achromatic
		} else {
			function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			let p = 2 * l - q;

			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return [ r * 255, g * 255, b * 255 ];
	}
    export function validateLicense(visual, props):TLicenseStatus{
        let licenseStatus:TLicenseStatus = null;
        license = null;
        if (props.license.key){
            try {
                let x = props.license.key.split("#");
                let y = props.license.hash;
                if (x.length != 2 || !y){
                    return "invalid";
                }
                let text = x[0];
                let signature = x[1]+y;
                signature = atob(signature);
                let signature_hex = "";
                let hex = "";
                for (let i = 0; i < signature.length; i++) {
                    hex = signature.charCodeAt(i).toString(16);
                    if (hex.length == 1)
                        signature_hex += "0";
                    signature_hex += hex;
                }
                /* validate key */
                let date_ok = false;
                let d = text.match(/: ([0-9]+)-([0-9]+)-([0-9]+)/);
                if (d){
                    let d1 = new Date();
                    let d2 = new Date(d[1], d[2]-1, d[3]);
                    date_ok = (d1 < d2)?true:false;
                }
                let ret:any = visual.ZC.ZoomCharts.Internal.Base.RsaCrypto.verifySignature(text, signature_hex);
                visual.licenseCheckStatus = ret;
                visual.licenseDateStatus = date_ok;

                if (ret){
                    license = text.split("#")[0];
                }

                if (ret && date_ok){
                    licenseStatus = "licensed";
                } else {
                    if (ret && !date_ok){
                        if (props.license.key.indexOf("trial") > -1){
                            licenseStatus = "trialExpired";
                        } else {
                            licenseStatus = "expired";
                        }
                    } else {
                        licenseStatus = "invalid";

                    }
                }
            } catch (err) {
                licenseStatus = "unlicensed";
            }
        } else {
            licenseStatus = "unlicensed";
        }
        return licenseStatus;
    }
    export function toggleInfoButton(visual, settings, props){
        let ret:any = visual.licenseCheckStatus;
        let date_ok:any = visual.licenseDateStatus;

        if (props.paid.show){
            /* this works in paid mode only */
            if (visual.currentInfoButtonStatus != props.license.info){
                if (!props.license.info){
                    settings.toolbar = {extraItems: []}
                } else {
                    settings.toolbar = {};
                    settings = addBaseInfoToolbar(settings, visual);
                }
                visual.currentInfoButtonStatus = props.license.info;
            }
        } else {
            if (ret != "licensed"){
                if (!visual.currentInfoButtonStatus){
                    visual.currentInfoButtonStatus = true;
                    if (!settings.toolbar){
                        settings.toolbar = {};
                    }
                    settings = addBaseInfoToolbar(settings, visual);
                }
            }
        }
        return settings;
    }
}
