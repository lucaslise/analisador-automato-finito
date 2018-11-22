import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Icon, Table, Tag, Row, Col,
} from 'antd';
import _ from 'lodash';
import {
  getTerminais, FINALIZADOR, findNextRule, isAFND,
} from '../services/helper';

class Automato extends Component {
  state = {};

  filterCorrectRules = rules => _.reject(rules, rule => rule.value === '' && rule.name !== 'X');

  render() {
    let rules = [
      ...this.props.rules,
      {
        name: 'X',
        value: '',
      },
    ];

    rules = this.filterCorrectRules(rules);

    const addColumns = getTerminais(this.props.rules).map(terminal => ({
      title: terminal,
      key: terminal,
      width: 400,
      align: 'center',
      render: (rule) => {
        const next = findNextRule(rule.value, terminal);

        return next.length ? next.join(', ') : '-';
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
              {rule.name}
            </Fragment>
          );
        }
        return rule.value.indexOf(FINALIZADOR) > -1 || rule.name === 'X' ? `* ${rule.name}` : rule.name;
      },
    },
    ...addColumns];


    return (
      <div>
        {rules[0] && rules[0].name === 'X'
          ? <p style={{ textAlign: 'center' }}>Adicione uma Gramática Regular</p>
          : (
            <div>
              <Table
                title={() => (
                  <div style={{
                    display: rules[0] ? 'block' : 'none',
                  }}
                  >
                    <Row>
                      <Col xs={12}>
                        Autômato Finito
                      </Col>
                      <Col xs={12} style={{ textAlign: 'right' }}>
                        {isAFND(this.props.rules) ? <Tag color="red">Autômato Finito Não Determinístico</Tag> : <Tag color="blue">Autômato Finito Determinístico</Tag> }
                      </Col>
                    </Row>
                  </div>
                )
              }
                bordered
                dataSource={rules}
                columns={columns}
                pagination={false}
              />
            </div>
          )}
      </div>
    );
  }
}

Automato.propTypes = {
  rules: PropTypes.array.isRequired,
};

export default Automato;
