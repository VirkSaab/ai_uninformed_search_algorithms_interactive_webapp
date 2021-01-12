/* Helper functions and classes
Author: Jitender Singh Virk
Last updated: 5 Nov 2020
*/

// For stop button
var stop_execution_flag = false;

function stop_exec() { stop_execution_flag = true; }

function make_dropdown_list(data, selected) { // Make initial state and goal state selection list
    let ddlist = "";
    for (key in data) {
        if (data[key] === selected) {
            ddlist += `<option selected=${selected}>${data[key]}</option>`;
        } else {
            ddlist += `<option>${data[key]}</option>`;
        }
    }
    return ddlist;
}

function makeNetworkInfo() {
    let size = "; padding-left: 3rem; padding-top: .8rem; border: none;"
    let info = "";
    info += `<li><b>Initial State:</b> <button type="button" class="btn btn-danger" style="background-color:${initialNodeStyle.color}${size}"></button></li>`
    info += `<li><b>Goal State:</b> <button type="button" class="btn btn-success" style="background-color:${goalNodeStyle.color}${size}"></button></li>`
    info += `<li><b>Explored State:</b> <button type="button" class="btn btn-warning" style="background-color:${exploredNodeStyle.color}${size}"></button></li>`
    info += `<li><b>Current State:</b> <button type="button" class="btn btn-primary" style="background-color:${currentNodeStyle.color}${size}"></button></li>`
    return info;
}

function showGoalAlert() {
    document.getElementById("goalAlertID").innerHTML = `
    <div class="alert alert-success" role="alert" style="max-width: max-content;">
        <h4 class="alert-heading">Goal reached!</h4>
    </div>`;
}

function algoSelectFunc() {
    algoSelectID = document.getElementById("algoDDList").value
        // console.log("algoSelectFunc --> algoSelectID: ", algoSelectID);
    if (algoSelectID === "Depth Limited Search") {
        document.getElementById("DLSLimitID").innerHTML = `
            <label for="Goal">Enter depth limit:</label>
            <input type="number" id="DLSValueID" value="5" min=1>`;
    } else {
        document.getElementById("DLSLimitID").innerHTML = "";
    }
}

function initialStateFunc() { // This function reflects the initial node color when selected from Goal State list
    // console.log(chart.series[0].nodes);
    initialStateID = document.getElementById("initialStateDDList").value
    nodes = chart.series[0].nodes;
    let index = 0;
    chart.series[0].nodes.forEach(function(node) {
        // console.log(node.id);
        if (node.id === initialStateID) {
            Object.assign(nodes[index], initialNodeStyle);
        } else if (node.id === goalStateID) {} else {
            Object.assign(nodes[index], defaultNodeStyle);
        }

        index++;
    })
    chart.redraw();
}

function goalStateFunc() { // This function reflects the goal node color when selected from Goal State list
    // console.log(chart.series[0].nodes);
    goalStateID = document.getElementById("goalStateDDList").value
    nodes = chart.series[0].nodes;
    let index = 0;
    chart.series[0].nodes.forEach(function(node) {
        // console.log(node.id);
        if (node.id === goalStateID) {
            Object.assign(nodes[index], goalNodeStyle);
        } else if (node.id === initialStateID) {} else {
            Object.assign(nodes[index], defaultNodeStyle);
        }

        index++;
    })
    chart.redraw();
}



// ============================== DATA STRUCTURES

class FIFOQueue { // Source: https://www.javascripttutorial.net/javascript-queue/
    constructor() {
        this.elements = [];
    }

    enqueue(elem) {
        this.elements.push(elem);
    }

    dequeue(elem) {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length == 0;
    }

    length() {
        return this.elements.length;
    }

    peek() {
        return !this.isEmpty() ? this.elements[0] : undefined;
    }

}

class LIFOQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(elem) {
        this.elements.push(elem);
    }

    dequeue(elem) { // the only difference is pop here than FIFO
        return this.elements.pop();
    }

    isEmpty() {
        return this.elements.length == 0;
    }

    length() {
        return this.elements.length;
    }

    peek() {
        return !this.isEmpty() ? this.elements[0] : undefined;
    }

}