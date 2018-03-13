import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'components/Texts/Textarea'
import Input from 'components/Texts/Input'
import Button from 'components/Button'
import { edit } from 'constants/placeholders'
import { css } from 'emotion'
import {
  addEmoji,
  finalizeEmoji,
  stringIsEmpty,
  turnStringIntoQuestion,
  isValidUrl,
  isValidYoutubeUrl
} from 'helpers/stringHelpers'
import { questionWordLimit as wordLimit } from 'constants/defaultValues'

export default class ContentEditor extends Component {
  static propTypes = {
    comment: PropTypes.string,
    content: PropTypes.string,
    contentId: PropTypes.number.isRequired,
    description: PropTypes.string,
    onDismiss: PropTypes.func.isRequired,
    onEditContent: PropTypes.func.isRequired,
    style: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string.isRequired
  }

  constructor({ comment, description, title, type, content }) {
    super()
    this.state = {
      buttonDisabled: false,
      editedContent: content || '',
      editedComment: comment || '',
      editedDescription: description || '',
      editedTitle: title || '',
      editedUrl:
        type === 'video'
          ? `https://www.youtube.com/watch?v=${content}`
          : content
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const { onDismiss, style, type } = this.props
    const {
      buttonDisabled,
      editedComment,
      editedContent,
      editedDescription,
      editedTitle,
      editedUrl
    } = this.state
    return (
      <div
        style={style}
        className={css`
          small {
            font-size: 1.3rem;
            line-height: 2.5rem;
          }
        `}
      >
        <form onSubmit={this.onSubmit}>
          {(type === 'video' || type === 'url') && (
            <Input
              autoFocus
              onChange={text => {
                const buttonDisabled =
                  (type === 'video' && !isValidYoutubeUrl(text)) ||
                  (type === 'url' && !isValidUrl(text))
                this.setState({
                  editedUrl: text,
                  buttonDisabled
                })
              }}
              placeholder={edit[type]}
              value={editedUrl}
              style={{ marginBottom: '1rem' }}
            />
          )}
          {type !== 'comment' &&
            type !== 'question' && (
              <Input
                autoFocus={type === 'discussion'}
                onChange={text => this.setState({ editedTitle: text })}
                onKeyUp={event =>
                  this.setState({
                    editedTitle: addEmoji(event.target.value),
                    buttonDisabled: stringIsEmpty(event.target.value)
                  })
                }
                placeholder={edit.title}
                value={editedTitle}
              />
            )}
          {type === 'question' && (
            <Fragment>
              <Input
                placeholder={edit['question']}
                value={editedContent}
                onChange={text => {
                  this.setState(() => ({
                    editedContent: text,
                    buttonDisabled: text.length > 100 || stringIsEmpty(text)
                  }))
                }}
              />
              <small
                style={{
                  color: editedContent.length > wordLimit ? 'red' : null
                }}
              >
                {editedContent.length}/{wordLimit} Characters
              </small>
            </Fragment>
          )}
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <Textarea
              autoFocus={type === 'comment'}
              minRows={4}
              onChange={event => {
                const { value } = event.target
                this.setState(state => ({
                  [type === 'comment'
                    ? 'editedComment'
                    : 'editedDescription']: value,
                  buttonDisabled:
                    type === 'comment'
                      ? stringIsEmpty(value)
                      : state.buttonDisabled
                }))
              }}
              placeholder={edit[type === 'comment' ? 'comment' : 'description']}
              value={type === 'comment' ? editedComment : editedDescription}
            />
          </div>
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'row-reverse'
            }}
          >
            <Button primary type="submit" disabled={buttonDisabled}>
              Done
            </Button>
            <Button
              transparent
              style={{ marginRight: '1rem' }}
              onClick={onDismiss}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    )
  }

  onSubmit(event) {
    event.preventDefault()
    const { contentId, onDismiss, onEditContent, type } = this.props
    const {
      editedComment,
      editedContent,
      editedDescription,
      editedTitle
    } = this.state
    const post = {
      ...this.state,
      editedComment: finalizeEmoji(editedComment),
      editedContent: turnStringIntoQuestion(finalizeEmoji(editedContent)),
      editedDescription: finalizeEmoji(editedDescription),
      editedTitle: finalizeEmoji(editedTitle)
    }
    onEditContent({ ...post, contentId, type }).then(() => onDismiss())
  }
}
