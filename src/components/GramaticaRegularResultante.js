import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import _ from 'lodash';

class GramaticaRegularResultante extends Component {
  state = {};

  getGR = () => {
    const result = [];
    this.props.groups.forEach((group) => {
      let value = {
        variable: group.variable,
        finished: group.finished,
      };

      const res = this.props.terminais.map((terminal) => {
        if (group[terminal].length > 1) {
          return `${terminal}${group[terminal].replace('*', '')}`;
        }

        return null;
      });

      value = _.merge(value, { value: res });

      result.push(value);
    });

    return result;
  }

  render() {
    return (
      <Card title="Gramática Regular Resultante" style={{ marginTop: 15 }}>
        {this.getGR().map(gr => (
          <div>
            {`${gr.variable} ::= `}
            {_.compact(gr.value).join(' | ')}
            {gr.finished ? ' | #' : ''}
          </div>
        ))}
      </Card>
    );
  }
}

GramaticaRegularResultante.propTypes = {
  groups: PropTypes.array.isRequired,
  terminais: PropTypes.array.isRequired,
};

export default GramaticaRegularResultante;
