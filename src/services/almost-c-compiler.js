const validateRowRegExp = /^[a-zA-Z0-9_$]+ calls [a-zA-Z0-9_$]+[ ]*$/;
const getNodesRegExp = /(^[a-zA-Z0-9_$]+) calls ([a-zA-Z0-9_$]+)[ ]*$/;

const validate = rows => {
    for (const i in rows) {
        const row = rows[i];
        if (!validateRowRegExp.test(row)) {
            const error = new SyntaxError(`error on ${+i + 1} row`);
            error.type = 'SYNTAX_ERROR';
            return error;
        }
    }
};

const getNodesFromEdge = row => {
    const result = row.match(getNodesRegExp);
    return [result[1], result[2]];
};

const getNodes = graph => {
    let nodes = [];
    for (let key in graph) {
        if (!nodes.includes(key)) {
            nodes.push(key);
        }
        nodes = nodes.concat(graph[key].filter(edge => !nodes.includes(edge)));
    }

    return nodes;
};

const sortGraph = graph => {
    const sortedNodes = [];
    const allNodes = getNodes(graph);
    const degrees = Array.from(allNodes)
        .fill(0)
        .map((item, i) => {
            return Object.keys(graph).reduce((acc, key) => {
                return acc + graph[key].filter(n => n === allNodes[i]).length;
            }, 0);
        });

    const queue = allNodes.filter((item, index) => !degrees[index]);

    let cnt = 0;
    while (queue.length) {
        const current = queue.shift();
        sortedNodes.push(current);
        for (const node of graph[current]) {
            degrees[allNodes.indexOf(node)] -= 1;
            if (degrees[allNodes.indexOf(node)] === 0) {
                queue.push(node);
            }
        }

        cnt++;
    }

    sortedNodes.reverse();

    if (cnt !== allNodes.length) {
        const error = new SyntaxError('Check you code at loop');
        error.type = 'LOOP_ERROR';
        throw error;
    } else {
        return sortedNodes;
    }
};

export const compile = code => {
    const rows = code.split('\n').filter(item => item); // REMOVE ALL ENTER  SYMBOLS AFTER CODE

    const error = validate(rows);

    if (error) {
        throw error;
    }

    const graph = {};

    for (const row of rows) {
        const [firstNode, secondNode] = getNodesFromEdge(row);
        graph[firstNode] = graph[firstNode] || [];
        graph[secondNode] = graph[secondNode] || [];

        if (!graph[firstNode].includes(secondNode)) {
            graph[firstNode].push(secondNode);
        }
    }

    return {
        graph,
        result: sortGraph(graph)
    };
};
