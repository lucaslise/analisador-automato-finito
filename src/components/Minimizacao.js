import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';
import {
  getTerminais, getNextVariablesRules, isFinished,
} from '../services/helper';

class Determinizacao extends Component {
  state = {
    oRules: [],
  };

  componentDidUpdate(nextProps) {
    const rules = nextProps.rules.map(rule => getTerminais(nextProps.originalRules).map((terminal) => {
      const next = getNextVariablesRules(rule.name, nextProps.originalRules, terminal);

      return {
        finished: isFinished(rule.name, this.props.originalRules),
        initialValue: rule.name,
        position: terminal,
        value: next,
      };
    }));

    let groupK = rules.map(rule => this.getGroups(rule, true));
    let groupKF = rules.map(rule => this.getGroups(rule, false));

    groupK = _.uniq(_.flatten(_.compact(groupK)));
    groupKF = _.uniq(_.flatten(_.compact(groupKF)));

    const rrr = this.calculaMinimizacao(groupK, groupKF, rules);

    if (JSON.stringify(this.state.oRules) !== JSON.stringify(rrr)) {
      this.setState({
        ...this.state,
        oRules: rrr,
      });
    }
  }

  compairIsSameGroup = (value1, value2, groupK, groupKF, rules) => false

  calculaMinimizacao = (groupK, groupKF, rules) => {
    const result = [{
      valueK: `{ ${groupK.join(', ')} }`,
      valueKF: `{ ${groupKF.join(', ')} }`,
    }];

    let newGroupK = [];
    for (let i = 0; i < groupK.length; i += 1) {
      for (let j = 0; j < groupK.length; j += 1) {
        if (i !== j) {
          const isValid = this.compairIsSameGroup(groupK[i], groupK[j], groupK, groupKF, rules);

          if (isValid) {
            newGroupK = _.concat(newGroupK, [groupK[i], groupK[j]]);
          } else {
            newGroupK = _.uniq(_.concat(newGroupK, [`{ ${groupK[i]} }`]));
          }
        }
      }
    }

    let newGroupKF = [groupKF[0]];
    for (let j = 0; j < groupKF.length; j += 1) {
      const isValid = this.compairIsSameGroup(groupKF[0], groupKF[j], groupKF, groupKF, rules);

      if (isValid) {
        newGroupKF = _.uniq(_.concat(newGroupKF, [groupKF[j]]));
      }
    }

    newGroupKF = [
      newGroupKF,
      _.reject(groupKF, n => _.includes(newGroupKF, n)),
    ];

    const newLine = {
      valueK: newGroupK.join(', '),
      valueKF: newGroupKF.map(n => `{ ${n} }`).join(', '),
    };

    return [
      ...result,
      newLine,
    ];
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
