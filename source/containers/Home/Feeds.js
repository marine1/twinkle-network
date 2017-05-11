import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {
  connectHomeComponent,
  fetchMoreFeedsAsync,
  fetchFeedsAsync,
  fetchFeed,
  clearFeeds
} from 'redux/actions/FeedActions'
import FeedInputPanel from './FeedInputPanel'
import FeedPanel from './FeedPanel'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import {connect} from 'react-redux'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'

@connect(
  state => ({
    loadMoreButton: state.FeedReducer.loadMoreButton,
    feeds: state.FeedReducer.feeds,
    homeComponentConnected: state.FeedReducer.homeComponentConnected,
    loaded: state.FeedReducer.loaded,
    userId: state.UserReducer.userId,
    selectedFilter: state.FeedReducer.selectedFilter,
    chatMode: state.ChatReducer.chatMode,
    noFeeds: state.FeedReducer.noFeeds
  }),
  {
    connectHomeComponent,
    fetchMoreFeeds: fetchMoreFeedsAsync,
    fetchFeeds: fetchFeedsAsync,
    clearFeeds,
    fetchFeed
  }
)
export default class Feeds extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    connectHomeComponent: PropTypes.func,
    loaded: PropTypes.bool,
    fetchFeeds: PropTypes.func,
    homeComponentConnected: PropTypes.bool,
    clearFeeds: PropTypes.func,
    history: PropTypes.object,
    feeds: PropTypes.array,
    loadMoreButton: PropTypes.bool,
    userId: PropTypes.number,
    selectedFilter: PropTypes.string,
    fetchMoreFeeds: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      loadingMore: false,
      scrollPosition: 0
    }
    this.applyFilter = this.applyFilter.bind(this)
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount() {
    let {history, clearFeeds, fetchFeeds, connectHomeComponent, feeds, homeComponentConnected} = this.props
    addEvent(window, 'scroll', this.onScroll)
    if (homeComponentConnected || history.action === 'PUSH' || !feeds) {
      connectHomeComponent()
      return clearFeeds().then(
        () => fetchFeeds()
      )
    } else {
      connectHomeComponent()
    }
  }

  componentWillUnmount() {
    removeEvent(window, 'scroll', this.onScroll)
  }

  render() {
    const {feeds, loadMoreButton, userId, loaded} = this.props
    const {loadingMore} = this.state

    return (
      <div>
        <FeedInputPanel />
        {this.renderFilterBar()}
        {!loaded &&
          <Loading text="Loading Feeds..." />
        }
        {loaded && feeds.length === 0 &&
          <p style={{
            textAlign: 'center',
            paddingTop: '1em',
            paddingBottom: '1em',
            fontSize: '2em'
          }}>
            <span>Hello there!</span>
          </p>
        }
        {loaded && feeds.length > 0 &&
          <div>
            {feeds.map(feed => {
              return <FeedPanel key={`${feed.id}`} feed={feed} userId={userId} />
            })}
            {loadMoreButton && <LoadMoreButton onClick={this.loadMoreFeeds} loading={loadingMore} />}
          </div>
        }
      </div>
    )
  }

  applyFilter(filter) {
    const {fetchFeeds, selectedFilter, clearFeeds} = this.props
    if (filter === selectedFilter) return
    return clearFeeds().then(
      () => fetchFeeds(filter)
    )
  }

  loadMoreFeeds() {
    const {feeds, fetchMoreFeeds, selectedFilter} = this.props
    const {loadingMore} = this.state
    if (!loadingMore) {
      this.setState({loadingMore: true})
      fetchMoreFeeds(feeds[feeds.length - 1].id, selectedFilter).then(
        () => this.setState({loadingMore: false})
      )
    }
  }

  onScroll() {
    let {chatMode, feeds} = this.props
    if (!chatMode && feeds.length > 0) {
      this.setState({scrollPosition: document.body.scrollTop})
      if (this.state.scrollPosition >= (document.body.scrollHeight - window.innerHeight) * 0.7) {
        this.loadMoreFeeds()
      }
    }
  }

  renderFilterBar() {
    const {selectedFilter} = this.props
    return (
      <nav className="navbar navbar-inverse">
        <ul className="nav nav-pills col-md-8" style={{margin: '0.5em'}}>
          <li className={selectedFilter === 'all' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('all')}
            >
              All
            </a>
          </li>
          <li className={selectedFilter === 'discussion' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('discussion')}
            >
              Discussions
            </a>
          </li>
          <li className={selectedFilter === 'video' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('video')}
            >
              Videos
            </a>
          </li>
          <li className={selectedFilter === 'url' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('url')}
            >
              Links
            </a>
          </li>
          <li className={selectedFilter === 'comment' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('comment')}
            >
              Comments
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}
