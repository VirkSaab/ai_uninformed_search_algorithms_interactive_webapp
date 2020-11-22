/* AI Search Algorithms
Author: Jitender Singh Virk
Last updated: 20 Nov 2020
Algorithm source: Artificial Intelligence - A Modern Approach - Third Edition, Stuart Russell and Peter Norvig, Section 3.3, page 75 onwards
*/

// LIST OF AVAILABLE ALGOs
let algosList = {
    "Breadth First Search": breadth_first_search,
    "Depth First Search": depth_first_search,
    "Depth Limited Search": depth_limited_search,
};



//================================== HELPERS ==========================================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function make_current_to_initial_path(currentNode, initialNode, parents, explored) {
    let no_parent_node_flag = false;
    let pointer = currentNode; // current node to look for parent.
    let path = [pointer];

    // Label explored nodes
    chart.series[0].nodes.forEach(function(node) {
        if (explored.has(node.id)) {
            Object.assign(node, exploredNodeStyle);
        }
        if (node.id === currentNode) {
            Object.assign(node, currentNodeStyle);
        }
    });

    // Build the reverse path from current node to initial node
    while (!no_parent_node_flag) {
        if (pointer in parents) {
            path.push(parents[pointer])
        } else {
            no_parent_node_flag = true;
            break;
        }
        pointer = parents[pointer];
        if (pointer === initialNode) {
            break;
        }
    }
    path = path.reverse();
    document.getElementById("numPathElementsID").innerHTML = `<b>Path elements: </b> ${path.length}`;

    // compute path cost
    let pathCost = 0;
    for (let i = 0; i < path.length - 1; i++) {
        let from = path[i];
        let to = path[i + 1];
        for (entry of chart.series[0].options.data) {
            if ((entry.from === from) && (entry.to === to)) {
                // console.log("COST: ", entry.cost);
                pathCost += entry.cost;
                break
            }
        }
    }
    document.getElementById("pathCostID").innerHTML = `<b>Path Cost: </b> ${pathCost}`;

    // Color code the links
    let coloredData = chart.series[0].options.data;
    let colored_node_idxs = [];
    for (let i = 0; i < path.length - 1; i++) { // make links red
        let from = path[i];
        let to = path[i + 1];
        let counter = 0;
        for (entry of coloredData) { // cannot compute the above path cost here because it will add twice for bidirectional paths
            if (
                ((entry.from === from) && (entry.to === to)) ||
                ((entry.from === to) && (entry.to === from))
            ) { // have to check for bidirectional entries data
                Object.assign(coloredData[counter], { color: 'red' });
                colored_node_idxs.push(counter);
            }
            counter++;
        }
    }
    // make previous paths back to default links
    let counter = 0;
    for (entry of coloredData) {
        if (!colored_node_idxs.includes(counter)) {
            Object.assign(coloredData[counter], { color: 'grey' });
        }
        counter++;
    }

    // put back the colored links
    chart.series[0].options.data = coloredData;
}

function solution(initial_state, goal_state, parents, explored) {
    make_current_to_initial_path(goal_state, initial_state, parents, explored);
    for (node of chart.series[0].nodes) {
        if (node.id === initial_state) {
            Object.assign(node, initialNodeStyle);
        }
        if (node.id === goal_state) {
            Object.assign(node, goalNodeStyle);
        }
    }
}

async function graphSearch(initial_state, goal_state, frontier) {
    // Goal test and queue initialization
    if (initial_state === goal_state) {
        return alert("Both initial and goal states are same!");
    }
    // set frontier and explored
    let explored = new Set();
    // Add initial node to the frontier
    frontier.enqueue(initial_state);
    // console.log(chart.series[0].options.data);
    let parents = {}; // {<child>: <parent>} to create paths
    let total_enqueue = 0;
    while (!frontier.isEmpty()) { // loop do (loop-line 1)
        if (stop_execution_flag === true) {
            return null;
        }
        document.getElementById("numFrontierNodesID").innerHTML = `<b># nodes in frontier: </b> ${frontier.length()}`;
        document.getElementById("numExploredNodesID").innerHTML = `<b># explored nodes: </b> ${explored.size}`;
        document.getElementById("totalEnqueueID").innerHTML = `<b>Total enqueue: </b> ${total_enqueue}`;

        let current_state = frontier.dequeue(); // loop-line 2
        if (current_state === undefined) { // Error Handling
            alert("Error! Current state is undefined.")
            break;
        }
        // console.log("---> current_state: ", current_state);
        explored.add(current_state); // loop-line 3
        if (explored.size === chart.series[0].nodes.length) { // Error Handling
            alert("Failed! :( All nodes are explored!")
            break;
        }

        // path from initial node to current node and color code nodes and links
        make_current_to_initial_path(current_state, initial_state, parents, explored);
        // console.log("path:", path);

        for (node of chart.series[0].nodes) { // for each action... loop
            if (node.id === current_state) {
                // Object.assign(node, currentNodeStyle);
                chart.series[0].options.data.every(function(link, idx) { // Find CHILD-NODE(s)
                    // link.from = current node and link.to = neighbours
                    if (link.from === node.id) {
                        // console.log(link);
                        // link.color = 'red';
                        if (!frontier.elements.includes(link.to) && !explored.has(link.to)) { // if child.STATE...
                            // add the parent of the current node
                            parents[link.to] = node.id;
                            // check if any child is the goal node
                            if (link.to === goal_state) {
                                goal_test_flag = true;
                                return false; // to break every loop
                            }
                            frontier.enqueue(link.to); // Add child nodes to frontier
                            total_enqueue++;
                        }
                    }
                    return true; // to continue every loop
                });
                if (goal_test_flag === true) {
                    break;
                }
            }
        }

        if (goal_test_flag === true) { // if goal test flag turns true
            console.log("Goal reached!")
            solution(initial_state, goal_state, parents, explored);
            showGoalAlert();
            // alert("Goal reached!")
            return true;
        }
        // console.log("frontier:", frontier.elements);
        // console.log("explored:", explored);
        await sleep(document.getElementById("AnimationSpeedID").value * 1000);
        console.log("IN WHILE");
    }
    // Frontier Empty :(
    alert("Failed! :( All nodes are explored");
}



//============================== UNINFORMED SEARCH ALGOs ==================================

/* whereas breadth-first-search uses a FIFO queue, depth-first search uses a LIFO queue.
Therefore we will use graphSearch function to pass FIFO queue for BFS and LIFO queue for
DFS to save code duplicacy.
 */
// Breadth First Search (BFS)
async function breadth_first_search(initial_state, goal_state) { // Figure 3.11
    let frontier = new FIFOQueue();
    goal_test_flag = false; //reset goal test
    return await graphSearch(initial_state, goal_state, frontier)
}

// Depth First Search (DFS)
async function depth_first_search(initial_state, goal_state) { // Section 3.4.3
    let frontier = new LIFOQueue(); // Stack
    goal_test_flag = false; //reset goal test
    return await graphSearch(initial_state, goal_state, frontier)
}


// Depth Limited Search (DLS)
async function depth_limited_search(initial_state, goal_state, limit) { // Section 3.4.4 & Figure 3.17
    // Goal test
    if (initial_state === goal_state) {
        return alert("Both initial and goal states are same!");
    }

    // set frontier and explored
    let frontier = new LIFOQueue(); // Stack
    let explored = new Set(); // visited nodes list

    // Add initial node to the frontier
    frontier.enqueue(initial_state);

    let parents = {}; // {<child>: <parent>} to create paths
    let total_enqueue = 0;

    while (!frontier.isEmpty()) {
        let current_state = frontier.dequeue();
        goal_test_flag, limit = await recursive_depth_limited_search(current_state, goal_state, limit, initial_state, frontier, explored, parents, total_enqueue, goal_test_flag);
        // limit = limit - 1;

        if (goal_test_flag === true) { // if goal reached, return solution 
            console.log("Goal reached!")
            solution(initial_state, goal_state, parents, explored);
            showGoalAlert();
            // alert("Goal reached!")
            return true;
        }
        if (limit == 0) {
            alert(`Cutoff occurred! No solution within the depth limit = ${document.getElementById("DLSValueID").value}`);
            break;
        }
        // explored = new Set(); // reset explored
    }
    if (goal_test_flag === true) {
        return goal_test_flag;
    }
}

async function recursive_depth_limited_search(current_state, goal_state, limit, initial_state, frontier, explored, parents, total_enqueue) {
    // console.log("LIMIT: ", limit);
    // console.log("current_state: ", current_state);
    // console.log("explored: ", explored)

    if (goal_test_flag === true) {
        // console.log("RETURNING FIRST CONDITION...");
        return true, limit;
    }
    if (current_state === goal_state) { // line 1 (do GOAL-TEST)
        return true, limit;
    }
    if (limit === 0) { // line 2 (check cutoff)
        // console.log("LIMI zero!");
        return false, limit; // return cutoff
    } else {
        let cutoff_occurred = false;
        if (stop_execution_flag === true) {
            return null, limit;
        }
        document.getElementById("numFrontierNodesID").innerHTML = `<b># nodes in frontier: </b> ${frontier.length()}`;
        document.getElementById("numExploredNodesID").innerHTML = `<b># explored nodes: </b> ${explored.size}`;
        document.getElementById("totalEnqueueID").innerHTML = `<b>Total enqueue: </b> ${total_enqueue}`;

        // let current_state = node; //frontier.dequeue(); // loop-line 2
        if (current_state === undefined) { // Error Handling
            alert("Error! Current state is undefined.")
            return null, limit;
        }
        // console.log("---> current_state: ", current_state);
        explored.add(current_state); // loop-line 3
        if (explored.size === chart.series[0].nodes.length) { // Error Handling
            alert("Failed! :( All nodes are explored!")
            return null, limit;
        }

        // path from initial node to current node and color code nodes and links
        make_current_to_initial_path(current_state, initial_state, parents, explored);
        // console.log("path:", path);

        await sleep(document.getElementById("AnimationSpeedID").value * 1000);

        for (node of chart.series[0].nodes) { // for each action... loop
            if (node.id === current_state) {
                // Object.assign(node, currentNodeStyle);
                chart.series[0].options.data.every(function(link, idx) { // Find CHILD-NODE(s)
                    // link.from = current node and link.to = neighbours
                    if (link.from === node.id) {
                        // console.log(link);
                        // link.color = 'red';
                        if (!frontier.elements.includes(link.to) && !explored.has(link.to)) { // if child.STATE...
                            // add the parent of the current node
                            parents[link.to] = node.id;
                            // check if any child is the goal node
                            if (link.to === goal_state) {
                                goal_test_flag = true;
                                // console.log("GOAL FOUND!")
                                return false; // to break every loop
                            }
                            frontier.enqueue(link.to); // Add child nodes to frontier
                            total_enqueue++;
                        }
                    }
                    return true; // to continue every loop
                });
                if (goal_test_flag === true) {
                    return true, limit;
                }
                // console.log("frontier: ", frontier.elements);
                // console.log("-----");
                if (frontier.isEmpty()) {
                    alert("Frontier empty! No solution found!");
                    stop_execution_flag = true;
                    return null;
                }
                current_state = frontier.dequeue()
                goal_test_flag, _ = await recursive_depth_limited_search(current_state, goal_state, limit - 1, initial_state, frontier, explored, parents, total_enqueue)
                if ((goal_test_flag === false) || (limit <= 0)) {
                    cutoff_occurred = true;
                    return false, limit;
                } else if (goal_test_flag === null) {
                    return null, limit;
                } else if (goal_test_flag === true) {
                    return true, limit;
                }
            }
            if (goal_test_flag === true) {
                return true;
            }
        }

        if (cutoff_occurred) {
            return false, limit; // return cutoff
        }
        if (goal_test_flag === true) {
            return true, limit;
        }
    }
    return null, limit;
}