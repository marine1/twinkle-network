import React, {Component} from 'react';
import UserLink from '../UserLink';
import ContentLink from '../ContentLink';
import {timeSince} from 'helpers/timeStampHelpers';
import LikeButton from 'components/LikeButton';
import {connect} from 'react-redux';
import {likeVideoAsync} from 'redux/actions/FeedActions';
import {cleanString} from 'helpers/stringHelpers';


@connect(
  null,
  {onLikeVideoClick: likeVideoAsync}
)
export default class Heading extends Component {
  render() {
    const {
      type,
      videoTitle,
      action,
      content,
      uploader,
      targetReplyUploader,
      targetCommentUploader,
      parentContent,
      parentContentId,
      timeStamp,
      onPlayVideoClick,
      attachedVideoShown,
      parentContentLikers = [],
      myId,
      onLikeVideoClick
    } = this.props;

    let targetAction;

    if (!!targetReplyUploader) {
      targetAction = <span><UserLink user={targetReplyUploader} />'s reply on</span>
    }
    else if (!!targetCommentUploader) {
      targetAction = <span><UserLink user={targetCommentUploader} />'s comment on</span>
    }
    let userLikedVideo = false;
    for (let i = 0; i < parentContentLikers.length; i++) {
      if (parentContentLikers[i].userId == myId) userLikedVideo = true;
    }

    const pStyle = {fontSize: '1.4rem'};

    switch (type) {
      case 'video':
        return <div className="panel-heading flexbox-container">
          <p className="panel-title pull-left" style={pStyle}><UserLink user={uploader} /> uploaded a video: <ContentLink content={parentContent}/> <small>{`${!!timeStamp ? '(' + timeSince(timeStamp) + ')' : ''}`}</small></p>
        </div>
      case 'comment':
        return <div className="panel-heading flexbox-container">
          <p className="panel-title pull-left col-xs-11" style={{...pStyle, padding: '0px'}}><UserLink user={uploader} /> {action} {targetAction} video: <ContentLink content={parentContent}/> <small>({timeSince(timeStamp)})</small></p>
          {attachedVideoShown ?
            <LikeButton
              small
              style={{
                marginLeft: 'auto',
                float: 'right'
              }}
              targetLabel="Video"
              liked={userLikedVideo}
              onClick={() => onLikeVideoClick(parentContentId)}
            /> :
            <a
              style={{
                marginLeft: 'auto',
                float: 'right',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onClick={() => onPlayVideoClick()}
            >
              <span className="glyphicon glyphicon-play"></span> Play
            </a>
          }
        </div>
      case 'url':
        return <div className="panel-heading flexbox-container">
            <p className="panel-title pull-left" style={pStyle}><UserLink user={uploader} /> shared a link: <a href={content} target="_blank" style={{color: '#158cba'}}><strong>{cleanString(parentContent.title)}</strong></a> <small>{`${!!timeStamp ? '(' + timeSince(timeStamp) + ')' : ''}`}</small></p>
          </div>
      default:
        return <div className="panpanel-heading flexbox-container">Error</div>
    }
  }
}
