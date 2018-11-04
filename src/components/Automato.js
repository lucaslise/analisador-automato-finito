import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, Tag } from 'antd';
import _ from 'lodash';
import { getNaoTerminais, FINALIZADOR, findNextRule, isAFND } from '../services/helper';

class Automato extends Component {
  state = {};

  render() {
    const rules = [
      ...this.props.rules,
      {
        name: 'X',
        value: '',
      },
    ];

    const addColumns = getNaoTerminais(this.props.rules).map(naoTerminal => {
      return {
        title: naoTerminal,
        key: naoTerminal,
        width: 400,
        align: 'center',
        render: (rule) => {
          const next = findNextRule(rule.value, naoTerminal);

          return next.length ? next.join(', ') : '-'
        } ,
      };
    });

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
              {rule.name}
            </Fragment>
          )
        } else {
          return rule.value.indexOf(FINALIZADOR) > -1 || rule.name === 'X' ? `* ${rule.name}` : rule.name;
        }
      }
    },
    ...addColumns];

    return (
      <div>
        {rules[0].name === 'X'
          ? <p style={{ textAlign: 'center' }}>Adicione uma Gramática Regular</p>
          :<div>
            <Table bordered dataSource={rules} columns={columns} pagination={false} />
            <p style={{ textAlign: 'center', marginTop: 10 }}>{isAFND(this.props.rules) ? <Tag color="red">Autômato Finito Não Determinístico</Tag> : <Tag color="blue">Autômato Finito Determinístico</Tag> }</p>
          </div>}
      </div>
    );
  }
}

Automato.propTypes = {
  rules: PropTypes.array.isRequired,
}

export default Automato;
