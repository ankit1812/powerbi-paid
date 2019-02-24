module powerbi.extensibility.visual {
    export class Data {
        public static convert(visual:any, host: IVisualHost, target: HTMLElement, options: VisualUpdateOptions) {
            if (isDebugVisual) {
                console.log("Debug info: Chart data update called", options);
            }

            let root = {
                nodes: [],
                links: [],
                classes: [],
                format: null
            };

            let ids: Array<visuals.ISelectionId>;
 
            let dataView = options.dataViews[0];
            if (!dataView) {
                displayMessage(target, "Either the data loading is taking longer than usual or the data fields for the visual are not properly configured.", "Incorrect data", false);
                return root;
            }


            if (typeof(dataView.categorical.categories) == "undefined"){
                displayMessage(target, "Please, select at least one category for node grouping", "Incorrect data", false);
                return root;
            }

            let categories = dataView.categorical.categories.length;
            if (categories < 1){
                displayMessage(target, "Please, select at least one category for node grouping", "Incorrect data", false);
                return root;
            }
            let values = dataView.categorical.categories[0].values.length;
            let props = mergePropertiesIntoNew(visual.customProperties, visual.defaultProperties);
            let tableRows = Data.getTableRows(dataView);
            let columns = Data.getMetadataColumns(dataView);
            let columnIndexes = Data.getMetadataColumnIndexes(dataView);

            visual.columnIndexes = columnIndexes;
            
            let fromNodesColumnIndex = columnIndexes.fromNodesColumnIndex;
            let toNodesColumnIndex = columnIndexes.toNodesColumnIndex;
            let imageColumnIndex = columnIndexes.imageColumnIndex;
            let linkLabelColumnIndex = columnIndexes.linkLabelColumnIndex;
            let nodeColorColumnIndex = columnIndexes.nodeColorColumnIndex;
            let linkColorColumnIndex = columnIndexes.linkColorColumnIndex;
            let valueColumnIndex = columnIndexes.valueColumnIndex;
            let nodeLabelColumnIndex = columnIndexes.nodeLabelColumnIndex;
            let categoryClassColumnIndex = columnIndexes.categoryClassColumnIndex;
            let nodePopupColumnIndexes = columnIndexes.nodePopupColumnIndexes;
            let linkWidthColumnIndex = columnIndexes.linkWidthColumnIndex;

            //Clear currentCategories
            if(visual.currentCategories) {
                for (let k of Object.keys(visual.currentCategories)) {
                    visual.currentCategories[k] = false;
                }
            }

            let colorMap = [
                "#01b8aa",
                "#fd7976",
                "#f6da5e",
                "#00b8cf",
                "#374649",
                "#b37fa8",
                "#fea57d",
                "#53a8c2",
                "#778183"
            ];
 
            // If in data we have to specify names, such as, 'category1' till 'category9', then 
            // we safely can do below code for color assignment to 'categoryColorsFromData'
            let categoryColorsFromData = { };
            if (categoryClassColumnIndex != null && nodeColorColumnIndex != null) {
                tableRows.forEach(function(row) {
                    if (row && row[categoryClassColumnIndex] && row[nodeColorColumnIndex]) {
                        let catgeoryClassColumn: any = secureString(row[categoryClassColumnIndex]);
                        if (!categoryColorsFromData.hasOwnProperty(catgeoryClassColumn)) {
                            categoryColorsFromData[catgeoryClassColumn] = removeSpaces(secureString(row[nodeColorColumnIndex]));
                        }
                    }
                });
            }

            let default_shape = Data.nodeShape(props.nodes);

            for (let y = 1; y <= 9; y++){
                //let color = getColor(dataView.categorical.categories[y], y, "fillColor" + (y + 1).toFixed(0));
                let m = y;
                let color = colorMap[y];
                if(props.nodes.colorMode == "fixed" && props.nodes.fillColor) {
                    color = props.nodes.fillColor.solid.color;
                } else if (props.nodes.colorMode == "dynamic" && !isEmptyObject(categoryColorsFromData)) {
                    if (categoryColorsFromData.hasOwnProperty("category" + m)) {
                        color = categoryColorsFromData["category" + m];
                    }
                }

                let shape = default_shape;
                let co = null; //category object containing category specific properties & values
                if(props["category"+m]){
                    co = props["category"+m];
                }

                /*if (co){
                 * TODO apply proper shape using custom settings
                 * move other category dependent settings here from nodeStyle function
                }*/
                if (co && co.show === true) {
                    let customCategoryShape: string = Data.nodeShape(co);
                    if (customCategoryShape !== "") {
                        shape = customCategoryShape;
                    }
                }
                
                let o:any = {
                    className: "category" + m, //y
                    nameLegend: co.name,
                    showInLegend: true,
                    //nameLegend: dataView.categorical.categories[y].source.displayName,
                    style: {
                        fillColor: color,
                        display: shape
                    }
                };

                //override based on category specific values:
                if(co && co.show == true) { //apply category specific values only if category is enabled
                    if(co.colorMode && co.colorMode == "fixed") {
                        if(co.fillColor && co.fillColor.solid.color) {
                            o.style.fillColor = co.fillColor.solid.color;
                        }
                    }
                }
                root.classes.push(o);

                //extra parameter is not a valid parameter for nodeClasses, but this is easier approach 
                //for category processing, so create new object based on 'o' without reference.
                let o2 = Object.create(o);
                o2.extra = {
                    props: co
                };
                visual.currentCategories[m] = o2;
            }

            if (typeof(dataView.categorical.values) == "undefined"){
                displayMessage(target, "Please, select measure to view the network", "Incorrect data", false);
                return root;
            }
            hideMessage(target);
            let format = dataView.categorical.values[0].source.format;
            root.format = format;

            let validCategoryClasses = [];
            for(let cx = 1; cx <= 9; cx++) {
                validCategoryClasses.push("category" + cx);
            }

            let nodeMap2 = {};
            let linkMap2 = {};
            let categoriesFound = [];

            for (let x = 0; x < tableRows.length; x++) {
                let row = tableRows[x];
                let fromNodeId = row[fromNodesColumnIndex].replace(/ /g, "");
                let toNodeIds = row[toNodesColumnIndex];

                //NOTE: y = category index. But in this visual we support only one/single category (index:0);
                let y = 0;
                let sid:any = host.createSelectionIdBuilder().withCategory(dataView.categorical.categories[y], x).createSelectionId();

                if(nodeMap2[fromNodeId]) {
                    let node = nodeMap2[fromNodeId];
                    if(!node.extra.isFilled) {
                        //node created, but not yet filled with data:
                        //fill it:
                        let label = (row && row[nodeLabelColumnIndex]) ? row[nodeLabelColumnIndex] : fromNodeId;
                        let value = row[valueColumnIndex];
                        let image = (row && row[imageColumnIndex]) ? row[imageColumnIndex] : null;
                        let nodeColor = (row && row[nodeColorColumnIndex]) ? row[nodeColorColumnIndex] : null;
                        let categoryClass = (row && row[categoryClassColumnIndex]) ? row[categoryClassColumnIndex] : "category1";

                        node.className = categoryClass;
                        node.extra.isFilled = true;
                        node.extra.name = secureString(label);
                        node.extra.value = value;
                        node.extra.row = row;
                        node.extra.image = secureString(image);
                        node.extra.nodeColor = secureString(nodeColor);
                        node.extra.popup = this.buildNodePopupContent(nodePopupColumnIndexes, row, columns);
                        node.extra.selectionIds = [sid];
                    }
                    //else if node is found and filled, just skip...
                } else {
                    //node is not created, create one:
                    let node = Data.createNode(fromNodeId, row, columnIndexes, columns, sid);
                    nodeMap2[fromNodeId] = node;
                    root.nodes.push(nodeMap2[fromNodeId]);
                }

                if(toNodeIds) {
                    toNodeIds = toNodeIds.replace(/ /g, "");
                    let toIds = toNodeIds.split(",");

                    if(toIds && toIds.length) {
                        for(let x2 = 0; x2 < toIds.length; x2++) {
                            let toNodeId = toIds[x2];
                            
                            if(toNodeId) {
                                if(nodeMap2[toNodeId]) {
                                    let node = nodeMap2[toNodeId];
                                } else {
                                    let node = Data.createNode(toNodeId, null, columnIndexes, columns, sid);
                                    nodeMap2[toNodeId] = node;
                                    root.nodes.push(nodeMap2[toNodeId]);
                                }

                                //create link
                                let linkId = fromNodeId + ":" + toNodeId;
                                let link = Data.createLink(linkId, fromNodeId, toNodeId, row, columnIndexes);
                                root.links.push(link);
                                linkMap2[linkId] = link;
                            }
                        }
                    }
                }

                //validate category class in data
                if(row[categoryClassColumnIndex]) {
                    if(validCategoryClasses.indexOf(row[categoryClassColumnIndex]) == -1) {
                        displayMessage(target, "We support up to 9 category classes like: 'category1', 'category2' up to 'category9'", "Unsupported category class: '" + row[categoryClassColumnIndex] + "'", false);
                        return {
                            nodes: [{"id": "error", "value":0, "loaded":false, "style":{"opacity":0}}],
                            links: [],
                            classes: [],
                            format: null,
                        };
                    } else {
                        if(categoriesFound.indexOf(row[categoryClassColumnIndex]) == -1 ) {
                            categoriesFound.push(row[categoryClassColumnIndex]);
                        }
                    }
                }

            }

            let unusedCategories = validCategoryClasses.filter(function(i) {return categoriesFound.indexOf(i) < 0;});

            //remove unused categories (classNames):
            var rcs = root.classes;
            for(let i = 0; i < unusedCategories.length; i++) {
                let cat = unusedCategories[i];
                let k = cat.replace("category","");
                if(visual.currentCategories[k]) {
                    delete visual.currentCategories[k];
                }
                //don't show in legend if category is not used:
                for(let ix in rcs) {
                    let rc = rcs[ix];
                    if(rc.className == cat) {
                        rc.showInLegend = false;
                    }
                }
            }

            let min = 1.0e12;
            let max = -min;

			function compare(a,b) {
                min = Math.min(min, a.extra.value);
                min = Math.min(min, b.extra.value);
                max = Math.max(max, a.extra.value);
                max = Math.max(max, b.extra.value);
				return a.extra.value - b.extra.value;
			}
			root.nodes = root.nodes.sort(compare);
            

	        /*
             * Group nodes in "ranges"
             * */
            let mode = "ultra-dynamic";
            let base = 21;
            let max_gain = 300;
            
            if (mode == "group"){
                let steps = 6;
                let step = 50;
                let nodes_in_step = Math.round(root.nodes.length / steps);
                for (let x = 0; x < root.nodes.length; x++){
                    let node = root.nodes[x];
                    let belonging_category = this.getNodeBelongingCategory(visual.currentCategories, node);
                    let radius = Math.floor(x / nodes_in_step)*step + base;
                    root.nodes[x].extra.radius = getLimitedRadius(radius, props, belonging_category.props);
                }
            } else if (mode == "dynamic"){
                let range = max-min;
                for (let x = 0; x < root.nodes.length; x++){
                    let node = root.nodes[x];
                    let belonging_category = this.getNodeBelongingCategory(visual.currentCategories, node);
                    let radius = base + (root.nodes[x].extra.value-min)/max * max_gain;
                    root.nodes[x].extra.radius = getLimitedRadius(radius, props, belonging_category.props);
                }
            } else if (mode == "ultra-dynamic"){
                let nodesByCategories:any={};
                let categoriesByIds:any={};
                let minCache:any={};
                let maxCache:any={};
                let absoluteMin:any;
                let absoluteMax:any;
                for (let x = 0; x < root.nodes.length; x++){
                    let node = root.nodes[x];
                    let belonging_category = this.getNodeBelongingCategory(visual.currentCategories, node);
                    let categoryId = "category1"; //default.
                    if(belonging_category) {
                        categoryId = belonging_category.category_id;
                    }
                   
                    if (typeof(nodesByCategories[categoryId]) == "undefined") nodesByCategories[categoryId] = [];
                    nodesByCategories[categoryId].push(node);
                    categoriesByIds[categoryId] = categoryId;
                    if (typeof(absoluteMin) == "undefined"){
                        absoluteMin = node.extra.value;
                        absoluteMax = node.extra.value;
                    } else {
                        if (node.extra.value > absoluteMax) absoluteMax = node.extra.value;
                        if (node.extra.value < absoluteMin) absoluteMin = node.extra.value;
                    }
                    if (typeof(maxCache[categoryId]) == "undefined"){
                        maxCache[categoryId] = node.extra.value;
                        minCache[categoryId] = node.extra.value;
                    } else {
                        if (node.extra.value > maxCache[categoryId]) maxCache[categoryId] = node.extra.value;
                        if (node.extra.value < minCache[categoryId]) minCache[categoryId] = node.extra.value;
                    }
                }
                let absoluteRange = absoluteMax - absoluteMin;
                for (let x in nodesByCategories){
                    if (!nodesByCategories.hasOwnProperty(x)) continue;
                    let nodes = nodesByCategories[x];
                    let range = maxCache[x] - minCache[x];

                    let minRadius = props.nodes.minRadius;
                    let maxRadius = props.nodes.maxRadius;

                    let category = categoriesByIds[x];

                    let relativeMinRadius:any;
                    let relativeMaxRadius:any;

                    if (category){
                        if(category.minRadius) {
                            relativeMinRadius = category.minRadius;
                        }
                        if(category.maxRadius) {
                            relativeMaxRadius = category.maxRadius;
                        }
                    }

                    for (let y = 0; y < nodesByCategories[x].length; y++){
                        let node = nodesByCategories[x][y];
                        let ratio = (absoluteRange != 0)?((node.extra.value-absoluteMin) / (absoluteRange)):1;
                        node.extra.absoluteRatio = ratio;
                        ratio = (range != 0)?((node.extra.value-minCache[x]) / (range)):1;
                        node.extra.relativeRatio = ratio;
                    }
                }
            }


            //iterate links and set linkWidth (radius) relative to value:
            let props_min = props.links.minWidth;

			function compareL(a,b) {
                min = Math.min(min, a.extra.linkWidth);
                min = Math.min(min, b.extra.linkWidth);
                max = Math.max(max, a.extra.linkWidth);
                max = Math.max(max, b.extra.linkWidth);
				return a.extra.linkWidth - b.extra.linkWidth;
            }
            root.links = root.links.sort(compareL);

            base = 1;
            max_gain = 20;
            for(let x in root.links) {
                let radius = base + (root.links[x].extra.linkWidth-min)/max * max_gain;
                radius = Math.max(radius, 1);
                radius = (radius <= props_min) ? props_min : Math.min(radius, 20);
                root.links[x].extra.linkWidth = radius;
            }

            console.log("new data", root);

            return root;
        }

        public static getNodeBelongingCategory(categories, node_data) {
            let className = node_data.className;

            for (let k of Object.keys(categories)) {
                let c = categories[k];
                if (c.className == className) {
                    return {
                        "category_id": c.className,
                        "category_name": c.nameLegend,
                        "props": c.extra.props
                    };
                }
            }
            //can't find belonging category of a node? That actually shouldn't happen.
            return null;
        }

        public static createNode(nodeId, row, columnIndexes, columns, sid) {            
            let fromNodesColumnIndex = columnIndexes.fromNodesColumnIndex;
            let toNodesColumnIndex = columnIndexes.toNodesColumnIndex;
            let imageColumnIndex = columnIndexes.imageColumnIndex;
            let nodeColorColumnIndex = columnIndexes.nodeColorColumnIndex;
            let nodeLabelColumnIndex = columnIndexes.nodeLabelColumnIndex;
            let valueColumnIndex = columnIndexes.valueColumnIndex;
            let categoryClassColumnIndex = columnIndexes.categoryClassColumnIndex;
            let nodePopupColumnIndexes = columnIndexes.nodePopupColumnIndexes;

            let label = (row && row[nodeLabelColumnIndex]) ? row[nodeLabelColumnIndex] : nodeId;
            let value = (row && row[valueColumnIndex]) ? parseFloat(row[valueColumnIndex]) : 1;
            let image = (row && row[imageColumnIndex]) ? row[imageColumnIndex] : null;
            let nodeColor = (row && row[nodeColorColumnIndex]) ? row[nodeColorColumnIndex] : null;
            let categoryClass = (row && row[categoryClassColumnIndex]) ? row[categoryClassColumnIndex] : "category1";

            let node = {
                id: nodeId, 
                loaded: true,
                className: categoryClass,
                extra: {
                    isFilled: row ? true : false,
                    name: secureString(label),
                    id: nodeId,
                    value: value,
                    selectionIds:[sid],
                    rowData: row,
                    image: secureString(image),
                    nodeColor: secureString(nodeColor),
                    absoluteRatio: 1,
                    relativeRatio: 1,
                    popup: this.buildNodePopupContent(nodePopupColumnIndexes, row, columns),
                }
            };

            return node;
        }

        public static createLink(linkId, fromNodeId, toNodeId, row, columnIndexes) {
            let linkLabelColumnIndex = columnIndexes.linkLabelColumnIndex;
            let linkColorColumnIndex = columnIndexes.linkColorColumnIndex;
            let linkWidthColumnIndex = columnIndexes.linkWidthColumnIndex;

            let link = {
                id: linkId,
                from: fromNodeId,
                to: toNodeId,
                extra: { 
                    linkLabel: (linkLabelColumnIndex === null)?"":secureString(row[linkLabelColumnIndex]),
                    linkValue: 0,
                    linkColor: (linkColorColumnIndex === null)?"":secureString(row[linkColorColumnIndex]),
                    linkWidth: (linkWidthColumnIndex === null)? 1 : secureString(row[linkWidthColumnIndex]),
                }
            }

            return link;
        }

        public static getTableRows(dataView: DataView) {
            let table: DataViewTable = dataView && dataView.table;
            //let columns = this.getMetadataColumns(dataView);
            return table.rows;
        }
        public static getMetadataColumns(dataView: DataView) {
            let columns: DataViewMetadataColumn[] = dataView && dataView.metadata && dataView.metadata.columns;
            return columns;
            /*
                return columns && _.mapValues(
                    new Object(),
                    (n, i) => columns.filter(x => x.roles && x.roles[i])[0]
                );
            
            */

        }
        public static buildNodePopupContent(nodePopupColumnIndexes, row, columns) {
            let popup = null;
            if(row) {
                if(nodePopupColumnIndexes.length) {
                    popup = "";
                    for(let i = 0; i < nodePopupColumnIndexes.length; i++) {
                        let index = nodePopupColumnIndexes[i];
                        let name = secureString(columns[index].displayName);
                        let col = secureString(row[index]);
                        if(col) {
                            if(name) {
                                popup += "<span class=\"strong\">" + name + "</span>: ";
                            }
                            popup += col + "<br>\n";
                        }
                    }
                }
            }
            return popup;
        }
        public static getMetadataColumnIndexes(dataView: DataView) {
            let columns: DataViewMetadataColumn[] = dataView && dataView.metadata && dataView.metadata.columns;
            let a: IChartMetadataColumnIndexesObject = {
                fromNodesColumnIndex: null,
                toNodesColumnIndex: null,
                valueColumnIndex: null,
                imageColumnIndex: null,
                linkLabelColumnIndex: null,
                nodeColorColumnIndex: null,
                linkColorColumnIndex: null,
                nodeLabelColumnIndex: null,
                categoryClassColumnIndex: null,
                nodePopupColumnIndexes: [],
                linkWidthColumnIndex: null
            };

            for (let k of Object.keys(columns)) {
                let col = columns[k];
                if(col.roles.fromNodes) {
                    a.fromNodesColumnIndex = k;
                }
                if(col.roles.toNodes) {
                    a.toNodesColumnIndex = k;
                }
                if (col.roles.imageField) {
                    a.imageColumnIndex = k;
                }
                if (col.roles.Size) {
                    a.valueColumnIndex = k;
                } 
                if(col.roles.linkLabelField) {
                    a.linkLabelColumnIndex = k;
                } 
                if(col.roles.nodeColorField) {
                    a.nodeColorColumnIndex = k;
                }
                if(col.roles.linkColorField) {
                    a.linkColorColumnIndex = k;
                } 
                if(col.roles.nodeLabelField) {
                    a.nodeLabelColumnIndex = k;
                } 
                if(col.roles.categoryClassField) {
                    a.categoryClassColumnIndex = k;
                }
                if(col.roles.nodePopupContentFields) {
                    a.nodePopupColumnIndexes.push(k);
                }
                if(col.roles.linkWidthField) {
                    a.linkWidthColumnIndex = k;
                }
                
            }

            return a;
        }

        public static nodeShape(node: any): string {
            let nodeShape: string = "";
            if (node.nodeType && node.nodeType === "default") {
                nodeShape = node.shape;
            } else {
                nodeShape = node.nodeType;
            }
            return nodeShape;
        }
    }

}
