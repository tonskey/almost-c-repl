import React from 'react';
import { Graph } from 'react-d3-graph';

import Form from './Form.js';
import Result from './Result.js';

import { compile } from '../services/almost-c-compiler';

class Repl extends React.Component {
    state = {
        result: null,
        graph: null,
        error: null
    };

    updateCode = code => {
        try {
            if (!code.length) return null;
            const { graph, result } = compile(code);

            this.setState({
                error: null,
                result,
                graph
            });
        } catch (e) {
            if (e.type === 'SYNTAX_ERROR' || e.type === 'LOOP_ERROR') {
                this.setState({
                    error: e,
                    result: null,
                    graph: null
                });
            } else {
                throw e;
            }
        }
    };

    normalizeGraph = () => {
        const nodes = this.state.result.map(node => ({ id: node }));

        // MAKE PLAIN ARRAY [[],[],[]] => [],[],[]
        const links = [].concat(
            ...Object.keys(this.state.graph)
                .filter(key => this.state.graph[key].length)
                .map(key =>
                    this.state.graph[key].map(node => ({
                        source: key,
                        target: node
                    }))
                )
        );

        return {
            nodes: nodes,
            links: links
        };
    };

    render() {
        return (
            <div className="repl-container">
                <h3 className="repl-container__title">
                    REPL for Almost-C language
                </h3>
                <div className="repl-container__row">
                    <div className="repl-container__column --control">
                        <Form updateCode={this.updateCode} />

                        <Result
                            result={this.state.result}
                            error={this.state.error}
                        />
                    </div>
                    <div className="repl-container__column --graph">
                        {this.state.graph && (
                            <Graph
                                id="graph-id"
                                data={this.normalizeGraph()}
                                config={{ width: 500, height: 500 }}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Repl;
