import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Divider, Table, Tag } from 'antd';
import _ from 'lodash';

const FINALIZADOR = '#';

class Automato extends Component {
  state = {
    afnd: false,
  };

  getNaoTerminais = () => {
    const values = this.props.rules.map(({ value }) => value);
    const naoTerminais = values.map(value => {
      const naoTerminal = value.split('').map(v => {
        if ('0' === v || '1' === v || (v != _.upperCase(v) && v !== '|' && v !== ' ') && FINALIZADOR !== v) return v;
      });
      return _.compact(naoTerminal);
    })

    return _.uniq(_.flatten(naoTerminais));
  }

  findNextRule = (value, char) => {
    const groups = value.split('|');

    let resp = groups.map(g => {
      g = g.replace(/ /g, '');

      if (g[0] === char) {
        return g[1] || 'X';
      } else if (g[1] === char) {
        return g[0];
      }
    });
    resp = _.compact(resp);

    return resp.join(', ')
  }

  render() {
    const rules = [
      ...this.props.rules,
      {
        name: 'X',
        value: '',
      },
    ];

    const addColumns = this.getNaoTerminais().map(naoTerminal => {
      return {
        title: naoTerminal,
        key: naoTerminal,
        width: 400,
        render: (rule) => this.findNextRule(rule.value, naoTerminal) || '-' ,
      };
    });

    const columns = [{
      key: 'name',
      width: 200,
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
          return rule.value.indexOf(FINALIZADOR) > -1 ? `* ${rule.name}` : rule.name;
        }
      }
    },
    ...addColumns];

    return (
      rules[0].name === 'X'
       ? <p style={{ textAlign: 'center' }}>Adicione uma Gramática Regular</p>
       : <div>
         <Table bordered dataSource={rules} columns={columns} pagination={false} />
       <p style={{ textAlign: 'center', marginTop: 10 }}>{this.state.afnd ? <Tag color="red">Autômato Finito Não Determinístico</Tag> : <Tag color="blue">Autômato Finito Determinístico</Tag> }</p>
      </div>
    );
  }
}

Automato.propTypes = {
  rules: PropTypes.array.isRequired,
}

export default Automato;
