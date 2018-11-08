import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';
import {
  getNaoTerminais, getNextVariablesRules, isFinished,
} from '../services/helper';

class Determinizacao extends Component {
  state = {};

  render() {
    const rules = this.props.rules.map(rule => getNaoTerminais(this.props.originalRules).map((naoTerminal) => {
      const next = getNextVariablesRules(rule.name, this.props.originalRules, naoTerminal);

      return {
        finished: isFinished(rule.name, this.props.originalRules),
        initialValue: rule.name,
        position: naoTerminal,
        value: next,
      };
    }));
    console.warn(rules);

    const columns = [{
      title: 'K',
      align: 'center',
      render: () => '',
    },
    {
      title: 'K - F',
      align: 'center',
      render: () => '',
    }];

    return (
      <Table bordered dataSource={this.props.rules} columns={columns} pagination={false} />
    );
  }
}

Determinizacao.propTypes = {
  rules: PropTypes.array.isRequired,
  originalRules: PropTypes.array.isRequired,
};

export default Determinizacao;
