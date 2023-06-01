import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return <perspective-viewer />;
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      ratio: 'float',
      lower_bound: 'float',
      upper_bound: 'float',
      trigger_alert: 'float',
      timestamp: 'date',
      price_abc: 'float',
      price_def: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      const tableData: TableData[] = DataManipulator.generateRow(this.props.data);
      this.table.update(tableData);
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinctcount',
        ratio: 'avg',
        lower_bound: 'avg',
        upper_bound: 'avg',
        trigger_alert: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      const tableData: TableData[] = DataManipulator.generateRow(this.props.data);
      this.table.update(tableData);
    }
  }
}

export default Graph;
