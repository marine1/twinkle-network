import React from 'react'
import PropTypes from 'prop-types'
import Content from './Content'
import { cleanString } from 'helpers/stringHelpers'

TargetContent.propTypes = {
  methods: PropTypes.object.isRequired,
  myId: PropTypes.number,
  contentObj: PropTypes.object.isRequired
}
export default function TargetContent({
  myId,
  methods,
  contentObj: {
    commentId,
    discussionId,
    discussionDescription,
    discussionTimeStamp,
    discussionTitle,
    discussionUploaderId,
    discussionUploaderName,
    id,
    replyId,
    rootContent,
    rootId,
    rootType,
    targetComment,
    targetCommentTimeStamp,
    targetCommentUploaderId,
    targetCommentUploaderName,
    targetContentComments = [],
    targetContentLikers,
    targetReply,
    targetReplyTimeStamp,
    targetReplyUploaderName,
    targetReplyUploaderId,
    timeStamp
  }
}) {
  return (
    <div
      css={`
        font-size: 1.5rem;
      `}
    >
      {replyId && (
        <Content
          commentId={commentId}
          comments={targetContentComments}
          content={targetReply}
          contentAvailable={!!targetReply}
          discussionId={discussionId}
          likes={targetContentLikers}
          methods={methods}
          myId={myId}
          panelId={id}
          replyId={replyId}
          rootId={rootId}
          rootContent={rootContent}
          rootType={rootType}
          timeStamp={targetReplyTimeStamp}
          uploader={{
            name: targetReplyUploaderName,
            id: targetReplyUploaderId
          }}
        />
      )}
      {commentId &&
        !replyId && (
          <Content
            commentId={commentId}
            comments={targetContentComments}
            content={targetComment}
            contentAvailable={!!targetComment}
            discussionId={discussionId}
            likes={targetContentLikers}
            myId={myId}
            methods={methods}
            panelId={id}
            rootId={rootId}
            rootContent={rootContent}
            rootType={rootType}
            timeStamp={targetCommentTimeStamp}
            uploader={{
              name: targetCommentUploaderName,
              id: targetCommentUploaderId
            }}
          />
        )}
      {!replyId &&
        !commentId &&
        discussionId && (
          <Content
            comments={targetContentComments}
            content={discussionDescription}
            contentAvailable={!!discussionTitle}
            discussionId={discussionId}
            methods={methods}
            isDiscussion
            panelId={id}
            rootId={rootId}
            rootType={rootType}
            timeStamp={discussionTimeStamp}
            title={cleanString(discussionTitle)}
            uploader={{
              name: discussionUploaderName,
              id: discussionUploaderId
            }}
          />
        )}
    </div>
  )
}
