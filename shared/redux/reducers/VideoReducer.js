import {processedStringWithURL, stringIsEmpty} from 'helpers/stringHelpers';

const defaultState = {
  allVideoThumbs: [],
  loadMoreButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,
  videoPage: {
    comments: [],
    debates: [],
    noComments: false,
    loadMoreCommentsButton: false,
    loadMoreDebatesButton: false
  },
  searchResult: []
};

let loadMoreButton = false;
let loadMoreCommentsButton = false;
let loadMoreDebatesButton = false;
let loadMoreDebateCommentsButton = false;
let allVideosLoaded = false;
export default function VideoReducer(state = defaultState, action) {
  switch(action.type) {
    case 'CLEAR_CONTENT_SEARCH_RESULTS':
      return {
        ...state,
        searchResult: []
      }
    case 'DELETE_VIDEO':
      const newVideoThumbs = state.allVideoThumbs;
      newVideoThumbs.splice(action.arrayIndex, 1);
      return {
        ...state,
        allVideoThumbs: newVideoThumbs.concat(action.data)
      }
    case 'DELETE_VIDEO_COMMENT':
      let newComments = state.videoPage.comments.filter(comment => comment.id !== action.data.commentId);
      let noComments = newComments.length === 0;
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: state.videoPage.debates.map(debate => {
            return {
              ...debate,
              comments: debate.comments.filter(
                comment => comment.id !== action.data.commentId
              ).map(comment => ({
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== action.data.commentId)
              }))
            }
          }),
          comments: newComments.map(comment => ({
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== action.data.commentId)
          })),
          noComments
        }
      }
    case 'EDIT_VIDEO_COMMENT':
      return {
        ...state,
        debates: state.videoPage.debates.map(debate => ({
          ...debate,
          comments: debate.comments.map(comment => {
          if (comment.id === action.data.commentId) {
            comment.content = processedStringWithURL(action.data.editedComment)
          }
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === action.data.commentId) {
                reply.content = processedStringWithURL(action.data.editedComment);
              }
              return reply;
            })
          }})
        })),
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
          if (comment.id === action.data.commentId) {
            return {
              ...comment,
              content: processedStringWithURL(action.data.editedComment)
            }
          }
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === action.data.commentId) {
                return {
                  ...reply,
                  content: processedStringWithURL(action.data.editedComment)
                }
              }
              return reply;
            })
          }})
        }
      }
    case 'GET_VIDEOS':
      if (action.videos.length > 12) {
        action.videos.pop();
        loadMoreButton = true;
      } else {
        allVideosLoaded = true;
        loadMoreButton = false;
      }
      if (action.initialRun) {
        return {
          ...state,
          allVideoThumbs: action.videos,
          loadMoreButton,
          allVideosLoaded
        }
      } else {
        return {
          ...state,
          allVideoThumbs: state.allVideoThumbs.concat(action.videos),
          loadMoreButton,
          allVideosLoaded
        }
      }
    case 'UPLOAD_VIDEO':
      const newState = action.data.concat(state.allVideoThumbs);
      if (action.data.length > 0 && !state.allVideosLoaded) {
        newState.pop();
      }
      return {
        ...state,
        allVideoThumbs: newState,
        addVideoModalShown: false
      }
    case 'EDIT_VIDEO_TITLE':
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.videoId) {
            thumb.title = action.data;
          }
          return thumb;
        })
      }
    case 'VID_MODAL_OPEN':
      return {
        ...state,
        addVideoModalShown: true
      };
    case 'VID_MODAL_CLOSE':
      return {
        ...state,
        addVideoModalShown: false
      }
    case 'LOAD_MORE_COMMENTS':
      loadMoreCommentsButton = false;
      if (action.data.comments.length > 20) {
        action.data.comments.pop();
        loadMoreCommentsButton = true;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.concat(action.data.comments),
          noComments: action.data.noComments,
          loadMoreCommentsButton
        }
      }
    case 'LOAD_MORE_VIDEO_DEBATES':
      loadMoreDebatesButton = false;
      if (action.data.length > 3) {
        action.data.pop();
        loadMoreDebatesButton = true;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: state.videoPage.debates.concat(action.data),
          loadMoreDebatesButton
        }
      }
    case 'LOAD_MORE_VIDEO_DEBATE_COMMENTS':
      loadMoreDebateCommentsButton = false;
      if (action.data.length > 3) {
        action.data.pop();
        loadMoreDebateCommentsButton = true;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: state.videoPage.debates.map(debate => {
            if (debate.id === action.debateId) {
              return {
                ...debate,
                comments: debate.comments.concat(action.data),
                loadMoreDebateCommentsButton
              }
            }
            return debate;
          })
        }
      }
    case 'LOAD_VIDEO_DEBATE_COMMENTS':
      loadMoreDebateCommentsButton = false;
      if (action.data.length > 3) {
        action.data.pop();
        loadMoreDebateCommentsButton = true;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: state.videoPage.debates.map(debate => {
            if (debate.id === action.debateId) {
              return {
                ...debate,
                comments: action.data,
                loadMoreDebateCommentsButton
              }
            }
            return debate;
          })
        }
      }
    case 'LOAD_VIDEO_PAGE':
      return {
        ...state,
        videoPage: {
          ...action.data,
          comments: []
        }
      }
    case 'LOAD_VIDEO_COMMENTS':
      loadMoreCommentsButton = false;
      if (action.data.comments.length > 20) {
        action.data.comments.pop()
        loadMoreCommentsButton = true;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: action.data.comments,
          noComments: action.data.noComments,
          loadMoreCommentsButton
        }
      }
    case 'LOAD_VIDEO_DEBATES':
      loadMoreDebatesButton = false;
      if (action.data.length > 3) {
        action.data.pop()
        loadMoreDebatesButton = true;
      }
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: action.data,
          loadMoreDebatesButton
        }
      };
    case 'UPLOAD_VIDEO_COMMENT':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: action.data.comments,
          noComments: action.data.noComments
        }
      }
    case 'UPLOAD_VIDEO_DEBATE':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: [action.data].concat(state.videoPage.debates)
        }
      }
    case 'UPLOAD_VIDEO_DEBATE_COMMENT':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: state.videoPage.debates.map(debate => {
            if (debate.id === action.data.debateId) {
              return {
                ...debate,
                comments: [action.data].concat(debate.comments)
              }
            }
            return debate;
          }),
          comments: [action.data].concat(state.videoPage.comments),
          noComments: false
        }
      }
    case 'UPLOAD_VIDEO_REPLY':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: state.videoPage.debates.map(debate => {
            return {
              ...debate,
              comments: debate.comments.map(comment => {
                if (comment.id === action.data.commentId) {
                  comment.replies = comment.replies.concat(action.data.reply)
                }
                return comment;
              })
            }
          }),
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                replies: comment.replies.concat(action.data.reply)
              }
            }
            return comment;
          })
        }
      }
    case 'VIDEO_COMMENT_LIKE':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          debates: state.videoPage.debates.map(debate => {
            return {
              ...debate,
              comments: debate.comments.map(comment => {
                if (comment.id === action.data.commentId) {
                  return {
                    ...comment,
                    likes: action.data.likes
                  }
                }
                return comment;
              })
            }
          }),
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                likes: action.data.likes
              }
            }
            return comment;
          })
        }
      }
    case 'VIDEO_REPLY_LIKE':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          comments: state.videoPage.comments.map(comment => {
            if (comment.id === action.data.commentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === action.data.replyId) {
                    return {
                      ...reply,
                      likes: action.data.likes
                    }
                  }
                  return reply;
                })
              }
            }
            return comment;
          })
        }
      }
    case 'VIDEO_LIKE':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          likes: action.data
        },
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.videoId) {
            thumb.numLikes = action.data.length
          }
          return thumb;
        })
      }
    case 'UPLOAD_QUESTIONS':
      return {
        ...state,
        videoPage: {
          ...state.videoPage,
          questions: action.data
        }
      }
    case 'EDIT_VIDEO_PAGE':
      const description = (stringIsEmpty(action.params.description)) ?
      'No description' : processedStringWithURL(action.params.description);
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          if (thumb.id === action.params.videoId) {
            thumb.title = action.params.title
          }
          return thumb;
        }),
        videoPage: {
          ...state.videoPage,
          title: action.params.title,
          description
        }
      }
    case 'RESET_VIDEO_PAGE':
      return {
        ...state,
        videoPage: {
          comments: [],
          noComments: false
        }
      }
    case 'RESET_VID_STATE':
      return {
        ...state,
        allVideoThumbs: [],
        loadMoreButton: false,
        allVideosLoaded: false,
        addVideoModalShown: false
      }
    case 'SEARCH_CONTENT':
      return {
        ...state,
        searchResult: action.data.result
      }
    default:
      return state;
  }
}
