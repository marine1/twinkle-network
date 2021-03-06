import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DropdownButton from 'components/DropdownButton'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/Texts/UsernameText'
import EditTextArea from 'components/Texts/EditTextArea'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { timeSince } from 'helpers/timeStampHelpers'
import { Color } from 'constants/css'
import LongText from 'components/Texts/LongText'

export default class Comment extends Component {
  static propTypes = {
    comment: PropTypes.shape({
      id: PropTypes.number,
      content: PropTypes.string,
      timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    profilePicId: PropTypes.number,
    userId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      onEdit: false,
      confirmModalShown: false
    }
    this.onDelete = this.onDelete.bind(this)
    this.onEditDone = this.onEditDone.bind(this)
  }

  render() {
    const { comment, username, userId, profilePicId } = this.props
    const { onEdit, confirmModalShown } = this.state
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          paddingTop: '1rem'
        }}
      >
        {!onEdit && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row-reverse'
            }}
          >
            <DropdownButton
              snow
              icon="pencil"
              direction="left"
              style={{ position: 'absolute' }}
              opacity={0.8}
              menuProps={[
                {
                  label: 'Edit',
                  onClick: () => this.setState({ onEdit: true })
                },
                {
                  label: 'Remove',
                  onClick: () => this.setState({ confirmModalShown: true })
                }
              ]}
            />
          </div>
        )}
        <div style={{ display: 'flex', width: '100%' }}>
          <ProfilePic
            style={{ width: '5rem', height: '5rem' }}
            userId={userId}
            profilePicId={profilePicId}
          />
          <div style={{ width: '90%', marginLeft: '2%' }}>
            <div>
              <UsernameText
                style={{ fontSize: '1.7rem' }}
                user={{
                  name: username,
                  id: userId
                }}
              />{' '}
              <small style={{ color: Color.gray() }}>
                &nbsp;{timeSince(comment.timeStamp)}
              </small>
            </div>
            {onEdit ? (
              <EditTextArea
                autoFocus
                text={comment.content}
                onCancel={() => this.setState({ onEdit: false })}
                onEditDone={this.onEditDone}
                rows={2}
              />
            ) : (
              <div style={{ paddingLeft: '0px' }}>
                <LongText
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    margin: '0.5rem 0 1rem 0'
                  }}
                >
                  {comment.content}
                </LongText>
              </div>
            )}
          </div>
        </div>
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => this.setState({ confirmModalShown: false })}
            title="Remove Comment"
            onConfirm={this.onDelete}
          />
        )}
      </div>
    )
  }

  onDelete() {
    const { comment, onDelete } = this.props
    onDelete(comment.id)
  }

  onEditDone(editedComment) {
    const { comment, onEditDone } = this.props
    return onEditDone({ editedComment, commentId: comment.id }).then(() =>
      this.setState({ onEdit: false })
    )
  }
}
