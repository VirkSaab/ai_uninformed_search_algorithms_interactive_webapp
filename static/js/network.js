/* Create Network or Map of Nodes for AI Search Algorithms
Author: Jitender Singh Virk
Last updated: 5 Nov 2020
*/

var chart;
let chartWidth, chartHeight = null;
let defaultNodeStyle = { marker: { radius: 10 }, color: "skyblue" };
let initialNodeStyle = { marker: { radius: 20 }, color: "red" };
let goalNodeStyle = { marker: { radius: 20 }, color: "green" };
let exploredNodeStyle = { marker: { radius: 10 }, color: "orange" };
let currentNodeStyle = { marker: { radius: 15 }, color: "blue" };

let initialStateID, goalStateID = null;


function init_graph() {
    document.getElementById("goalAlertID").innerHTML = "";
    document.getElementById("numFrontierNodesID").innerHTML = `<b># nodes in frontier: </b> 0`;
    document.getElementById("numExploredNodesID").innerHTML = `<b># explored nodes: </b> 0`;
    document.getElementById("numPathElementsID").innerHTML = `<b>Path elements: </b> 0`;
    document.getElementById("totalEnqueueID").innerHTML = `<b>Total enqueue: </b> 0`;
    document.getElementById("pathCostID").innerHTML = `<b>Path Cost: </b> 0`;

    fetch(`${window.origin}/networkdata`, {
            method: "POST",
            headers: new Headers({
                "content-type": "application/json"
            })
        })
        .then(function(response) {
            if (response.status !== 200) {
                console.log("Response not 200 :(")
                return;
            }
            response.json().then(function(data) {
                chart = build_graph(data["states_data"], data["coordinates"]);
            });
        })
        // return chart;
}

function build_graph(states_data, coordinates = null) {
    Highcharts.chart('graphContainer', {
        chart: {
            type: 'networkgraph',
            // zoomType: 'xy',
            plotBorderWidth: 1,
            // height: '100%',
            // events: {
            //     load: update_graph
            // }
        },
        title: { text: 'State Space' },

        plotOptions: { networkgraph: { keys: ['from', 'to'] } },

        tooltip: {
            enabled: true,
            useHTML: true,
            style: {
                padding: 0
            },
            backgroundColor: {
                linearGradient: [0, 0, 0, 60],
                stops: [
                    [0, '#FFFFFF'],
                    [1, '#E0E0E0']
                ]
            },
            formatter: function() {
                let out = "<b>Path cost, g(n):</b><ul>";
                for (node of this.series.nodes) {
                    if (node.id == this.point.name) {
                        // console.log(node);
                        for (link of node.linksTo) {
                            out += `<li>to ${link.from} = ${link.cost} </li>`;
                        }
                    }
                }
                out += "</ul>";
                return out;
            }
        },

        series: [{
            name: 'K8',
            dataLabels: {
                enabled: true,
                linkFormat: '', //'{point.cost}',

                style: { // https://api.highcharts.com/class-reference/Highcharts.SeriesNetworkgraphDataLabelsOptionsObject
                    // fontWeight: 'bold',
                    fontSize: "16px"
                }
            },
            // link: {
            //     width: 2,
            //     // color: '#A53E32',
            //     length: 200,
            //     // dashStyle: 'dash'
            // },
            layoutAlgorithm: {
                enableSimulation: true,
                integration: 'verlet',
                // friction: -0.9,
                initialPositions: function() {
                    chart = this.series[0].chart,
                        chartWidth = chart.plotWidth,
                        chartHeight = chart.plotHeight;
                    if (coordinates === null) {
                        this.nodes.forEach(function(node) {
                            // If initial positions were set previously, use that
                            // positions. Otherwise use random position:
                            node.plotX = node.plotX === undefined ?
                                Math.random() * chartWidth : node.plotX;
                            node.plotY = node.plotY === undefined ?
                                Math.random() * chartHeight : node.plotY;
                            if (node.id === initialStateID) {
                                Object.assign(node, initialNodeStyle); // Set node style
                            } else if (node.id === goalStateID) {
                                Object.assign(node, goalNodeStyle); // Set node style
                            } else {
                                Object.assign(node, defaultNodeStyle); // Set node style
                            }

                        });
                    } else {
                        // console.log(this.nodes);
                        // let Coords = scaleCoordinates(coordinates);
                        this.nodes.forEach(function(node) {
                            let fixedX = coordinates[node.id][0] * 2.2;
                            let fixedY = coordinates[node.id][1] * 0.9;
                            node.plotX = fixedX;
                            node.plotY = fixedY;
                            node.fixedPosition = { x: fixedX, y: fixedY };

                            // Set node style
                            if (node.id === initialStateID) {
                                Object.assign(node, initialNodeStyle);
                            } else if (node.id === goalStateID) {
                                Object.assign(node, goalNodeStyle);
                            } else {
                                Object.assign(node, defaultNodeStyle);
                            }

                            // Set nodes FROM and TO links
                            if (node.linksFrom.length === 0) {
                                Object.assign(node.linksFrom, node.linksTo)
                            } else if (node.linksTo.length === 0) {
                                Object.assign(node.linksTo, node.linksFrom)
                            }
                        });
                    }
                }
            },
            data: states_data, //https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-networkgraph/data-options/
            // animation: {
            //     duration: 3
            // },
        }],
    });
    // console.log(chart.series[0].nodes);
    return chart;
}