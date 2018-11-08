import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, Card } from 'antd';
import _ from 'lodash';
import {
  getNextVariablesRules, getNaoTerminais, FINALIZADOR, isFinished,
} from '../services/helper';
import Minimizacao from './Minimizacao';

class Determinizacao extends Component {
  state = {
    rules: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.rules !== this.props.rules) {
      this.setState({
        rules: [],
      });
    }
  }

  ruleExist = (name) => {
    if (name) {
      const response = _.find(this.state.rules, rule => JSON.stringify(_.toArray(rule.name)) === JSON.stringify(_.toArray(name)));
      return !!response;
    }
  }

  insertNewRule = (name) => {
    if (!this.ruleExist(name)) {
      const rules = [
        ...this.state.rules,
        {
          name,
        },
      ];

      this.setState({
        ...this.state,
        rules,
      });
    }
  }

  render() {
    const addColumns = getNaoTerminais(this.props.rules).map(naoTerminal => ({
      title: naoTerminal,
      key: naoTerminal,
      width: 400,
      align: 'center',
      render: (rule) => {
        const next = getNextVariablesRules(rule.name, this.props.rules, naoTerminal);
        if (next[0]) this.insertNewRule(next);

        return next.length ? `[${next.join(', ')}]` : '-';
      },
    }));

    const columns = [{
      key: 'name',
      width: 200,
      align: 'center',
      render: (rule) => {
        if (rule.initial) {
          return (
            <Fragment>
              {rule.value.indexOf(FINALIZADOR) > -1 ? '* ' : ''}
              <Icon type="arrow-right" style={{ fontSize: 10 }} />
            [
              {rule.name}
]
            </Fragment>
          );
        }

        const finaliza = isFinished(rule.name, this.props.rules);

        const response = finaliza ? `* [${rule.name}]` : `[${rule.name}]`;
        return response;
      },
    },
    ...addColumns,
    {
      title: 'LLC',
      width: 75,
      align: 'center',
      render: () => <Icon type="close" theme="outlined" style={{ color: 'red' }} />,
    },
    {
      title: 'Vivo',
      align: 'center',
      width: 75,
      render: () => <Icon type="check" theme="outlined" style={{ color: 'green' }} />,
    }];

    const firstLine = _.head(this.props.rules);

    const { rules } = this.state;
    if (firstLine !== _.head(rules)) {
      rules[0] = firstLine;
    }

    if (this.state.rules !== rules) {
      this.setState({
        ...this.state,
        rules,
      });
    }

    return (
      <Fragment>
        <Table bordered dataSource={rules} columns={columns} pagination={false} />
        <Card title="Minimização" bordered={false}>
          <Minimizacao rules={rules} originalRules={this.props.rules} />
        </Card>
      </Fragment>
    );
  }
}

Determinizacao.propTypes = {
  rules: PropTypes.array.isRequired,
};

export default Determinizacao;
