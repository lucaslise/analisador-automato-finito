import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';
import {
  getNaoTerminais, getNextVariablesRules, isFinished,
} from '../services/helper';

class Determinizacao extends Component {
  state = {
    oRules: [],
  };

  componentDidUpdate(nextProps) {
    const rules = nextProps.rules.map(rule => getNaoTerminais(nextProps.originalRules).map((naoTerminal) => {
      const next = getNextVariablesRules(rule.name, nextProps.originalRules, naoTerminal);

      return {
        finished: isFinished(rule.name, this.props.originalRules),
        initialValue: rule.name,
        position: naoTerminal,
        value: next,
      };
    }));

    let groupK = rules.map(rule => this.getGroups(rule, true));
    let groupKF = rules.map(rule => this.getGroups(rule, false));

    groupK = _.uniq(_.flatten(_.compact(groupK))).join(', ');
    groupKF = _.uniq(_.flatten(_.compact(groupKF))).join(', ');

    const oRules = [{
      valueK: `{ ${groupK} }`,
      valueKF: `{ ${groupKF} }`,
    }];

    if (JSON.stringify(this.state.oRules) !== JSON.stringify(oRules)) {
      this.setState({
        ...this.state,
        oRules,
      });
    }
  }

  getGroups = (rule, finished) => {
    const response = _.map(rule, (r) => {
      const res = r.finished === finished && !_.isEmpty(r.initialValue) ? `[${_.toArray(r.initialValue).join(', ')}]` : null;
      return res;
    });

    return _.compact(response);
  }

  render() {
    const columns = [{
      title: 'K',
      align: 'center',
      dataIndex: 'valueK',
    },
    {
      title: 'K - F',
      align: 'center',
      dataIndex: 'valueKF',
    }];

    return (
      <Table title={() => 'Minimização'} bordered dataSource={this.state.oRules} columns={columns} pagination={false} />
    );
  }
}

Determinizacao.propTypes = {
  rules: PropTypes.array.isRequired,
  originalRules: PropTypes.array.isRequired,
};

export default Determinizacao;
