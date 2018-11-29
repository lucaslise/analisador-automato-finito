import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';
import {
  getTerminais, getNextVariablesRules, isFinished,
} from '../services/helper';
import GramaticaRegularResultante from './GramaticaRegularResultante';

class AutomatoResultante extends Component {
  state = {
    columns: [],
    groups: [],
  };

  componentDidUpdate(nextProps) {
    let columns = [{
      title: '',
      key: '1',
      dataIndex: 'name',
      width: 400,
      align: 'center',
    }];

    columns = _.concat(columns, getTerminais(nextProps.originalRules).map(terminal => ({
      title: terminal,
      key: terminal,
      width: 400,
      align: 'center',
      dataIndex: terminal,
    })));

    if (JSON.stringify(this.state.columns) !== JSON.stringify(columns)) {
      this.setState({
        ...this.state,
        columns,
      });
    }
  }

  getDataSource = () => {
    const dataSource = [];

    this.getGroups().forEach(group => dataSource.push(this.getValue(group)));

    return dataSource;
  }

  getValue = (group) => {
    let value = '';
    let response = {
      name: group.name,
      variable: group.variable,
      finished: group.finished,
    };

    getTerminais(this.props.originalRules).forEach((terminal) => {
      this.props.rules.forEach((rule) => {
        rule.forEach((r) => {
          if (r.position === terminal && `[${_.toString(r.initialValue)}]` === (group.value[0] && group.value[0].replace(/ /g, ''))) {
            value = `[${r.value.join(',')}]`;
          }
        });
      });

      let res = '';
      this.getGroups().forEach((g) => {
        if (_.includes(g.value, value)) {
          res = g.name;
        }
      });

      response = _.merge(response, { [terminal]: res });
    });

    return response;
  }

  getName = (group, index) => {
    if (group.finished) {
      return `*q${index}`;
    }
    return `q${index}`;
  }

  getVariable = (group, index) => `q${index}`;

  getGroups = () => {
    const initialValue = _.compact(this.props.originalRules.map(r => (r.initial ? `[${r.name}]` : null)))[0];

    const groupL = this.props.groupL.map(group => ({
      finished: true,
      value: group,
    }));

    const groupR = this.props.groupR.map(group => ({
      finished: false,
      value: group,
    }));

    let groups = _.concat(groupL, groupR);

    const indexFirstValue = _.findIndex(groups, group => _.includes(group.value, initialValue));

    const ordenedGroups = [];

    for (let i = indexFirstValue; i < groups.length; i += 1) {
      ordenedGroups.push(groups[i]);
    }


    groups.forEach((group) => {
      if (!_.includes(ordenedGroups, group)) {
        ordenedGroups.push(group);
      }
    });

    groups = ordenedGroups[0] && ordenedGroups || groups;

    return groups.map((group, index) => ({
      name: this.getName(group, index),
      variable: this.getVariable(group, index),
      value: group.value.map(v => v && v.replace(/ /g, '')),
      finished: group.finished,
    }));
  }

  render() {
    return (
      <Fragment>
        <Table
          title={() => 'Autômato Resultante'}
          bordered
          dataSource={this.getDataSource()}
          columns={this.state.columns}
          pagination={false}
          style={{ marginTop: 15 }}
        />
        <GramaticaRegularResultante groups={this.getDataSource()} terminais={getTerminais(this.props.originalRules)} />
      </Fragment>
    );
  }
}

AutomatoResultante.propTypes = {
  groupL: PropTypes.array.isRequired,
  groupR: PropTypes.array.isRequired,
  rules: PropTypes.array.isRequired,
  originalRules: PropTypes.array.isRequired,
};

export default AutomatoResultante;
