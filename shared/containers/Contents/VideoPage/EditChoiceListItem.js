import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

export default class EditChoiceListItem extends Component {
  render() {
    return (
      <div className="list-group-item container-fluid">
        <form
          className="pull-left"
          style={{
            paddingLeft: '0px',
            width: '95%'
          }}
        >
          <Textarea
            type="text"
            className="form-control"
            onChange={event => this.props.onEdit(this.props.index, event.target.value)}
            value={cleanString(this.props.text)}
            placeholder={this.props.placeholder}
          >
          </Textarea>
        </form>
        <span className="input pull-right">
          <input
            type="radio"
            onChange={this.props.onSelect}
            checked={this.props.checked}
            style={{
              cursor: 'pointer'
            }}
          />
        </span>
      </div>
    )
  }
}

function cleanString (string) {
	return string ?
  string
  .replace(/<br\s*[\/]?>/gi, "\n")
  .replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">") : '';
}
