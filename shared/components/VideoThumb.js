import React, { Component } from 'react';
import { connect } from 'react-redux'
import SmallDropdownButton from './SmallDropdownButton';
import EditThumbTitleForm from './EditThumbTitleForm';
import ReactDOM from 'react-dom';
import { deleteVideo } from 'actions/VideoActions';
import ConfirmModal from './ConfirmModal';

class VideoThumb extends Component {
  state = {
    title: this.props.video.title,
    onEdit: false,
    confirmModalShown: false
  }

  onEditTitle () {
    this.setState({onEdit: true})
  }

  onEditFinish (editedTitle) {
    this.setState({onEdit: false});
    if (editedTitle) {
      this.setState({title: editedTitle})
    }
  }

  onDeleteClick () {
    this.setState({confirmModalShown: true});
  }

  onDeleteConfirm () {
    const { dispatch, video, arrayNumber, lastVideoId } = this.props;
    dispatch(deleteVideo(video.id, arrayNumber, lastVideoId));
  }

  onHideModal () {
    this.setState({confirmModalShown: false});
  }

  render () {
    const { onEdit, title, confirmModalShown } = this.state;
    const { size, editable, video } = this.props;
    const menuProps = [
      {
        label: 'Edit',
        onClick: this.onEditTitle.bind(this)
      },
      {
        label: 'Remove',
        onClick: this.onDeleteClick.bind(this)
      }
    ]
    return (
      <div
        className={size}
        key={ video.id }
      >
        <div
          className="thumbnail"
          ref="thumbnail"
        >
          {
            editable &&
            <SmallDropdownButton
              menuProps={menuProps}
            />
          }
          <img
            src={`http://img.youtube.com/vi/${video.videocode}/0.jpg`}
          />
          <div className="caption"
            style={{
              height: '8rem'
            }}
          >
            {
              onEdit ?
              <div
                className="input-group col-sm-12"
                style={{
                  paddingBottom: '0.3em'
                }}
              >
                <EditThumbTitleForm
                  arrayNumber={this.props.arrayNumber}
                  videoId={ video.id }
                  value={ title }
                  onEditFinish={ this.onEditFinish.bind(this) }
                />
              </div>
              :
              <div>
                <h5 style={{
                  whiteSpace: 'nowrap',
                  textOverflow:'ellipsis',
                  overflow:'hidden',
                  lineHeight: 'normal'
                }}>{title}</h5>
              </div>
            }
            <small style={{
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              overflow:'hidden'
            }}>{video.uploadername}</small>
          </div>
        </div>
        <ConfirmModal
          title="Delete Video"
          show={confirmModalShown}
          onHide={this.onHideModal.bind(this)}
          onConfirm={this.onDeleteConfirm.bind(this)} />
      </div>
    )
  }
}

export default connect()(VideoThumb);