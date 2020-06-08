import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Container } from './style'
import { renderRoutes } from 'react-router-config'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll/index'
import { TopDesc, Menu, SongList, SongItem } from './style'
import { getName, getCount } from './../../api/utils'
import style from '../../assets/global-style'
import { connect } from 'react-redux'
import { changeEnterLoading, getAlbumList } from './store/actionCreators'
import { isEmptyObject } from '../../api/utils'
import Loading from '../../baseUI/loading/index'

export const HEADER_HEIGHT = 45
// 映射redux
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
})

const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getAlbumList(id))
    },
  }
}

function Album(props) {
  const [showStatus, setShowStatus] = useState(true)
  const [isMarquee, setIsMarquee] = useState(false)
  const [title, setTitle] = useState('返回')

  const id = props.match.params.id
  const { currentAlbum: currentAlbumImmutable, enterLoading } = props
  const { getAlbumDataDispatch } = props

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  let currentAlbum = currentAlbumImmutable.toJS()

  const headerEl = useRef()

  //useCallback 优化 function props
  //将传给子组件的函数用 useCallback 包裹，这也是 useCallback 的常用场景
  // const handleBack = () => {
  //   setShowStatus(false)
  // }
  // 以此为例，如果不用 useCallback 包裹，父组件每次执行时会生成不一样的 handleBack 和 handleScroll 函数引用，那么子组件每一次 memo 的结果都会不一样，导致不必要的重新渲染，也就浪费了 memo 的价值。因此 useCallback 能够帮我们在依赖不变的情况保持一样的函数引用，最大程度地节约浏览器渲染性能
  const handleBack = useCallback (() => {
    setShowStatus (false);
  }, []);

  // const handleScroll = (pos) => {
  //   let minScrollY = -HEADER_HEIGHT
  //   let percent = Math.abs(pos.y / minScrollY)
  //   let headerDom = headerEl.current
  //   //滑过顶部的高度开始变化
  //   if (pos.y < minScrollY) {
  //     headerDom.style.backgroundColor = style['theme-color']
  //     headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
  //     setTitle(currentAlbum.name)
  //     setIsMarquee(true)
  //   } else {
  //     headerDom.style.backgroundColor = ''
  //     headerDom.style.opacity = 1
  //     setTitle('歌单')
  //     setIsMarquee(false)
  //   }
  // }

  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT
    let percent = Math.abs(pos.y / minScrollY)
    let headerDom = headerEl.current
    //滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style['theme-color']
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
      setTitle(currentAlbum.name)
      setIsMarquee(true)
    } else {
      headerDom.style.backgroundColor = ''
      headerDom.style.opacity = 1
      setTitle('歌单')
      setIsMarquee(false)
    }
  },[currentAlbum])

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10}万</span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }

  const renderSongList = () => {
    return (
      <SongList>
        <div className="first_line">
          <div className="play_all">
            <i className="iconfont">&#xe6e3;</i>
            <span>
              播放全部
              <span className="sum">(共{currentAlbum.tracks.length}首)</span>
            </span>
          </div>
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span>收藏 ({getCount(currentAlbum.subscribedCount)})</span>
          </div>
        </div>
        <SongItem>
          {currentAlbum.tracks.map((item, index) => {
            return (
              <li key={index}>
                <span className="index">{index + 1}</span>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    {getName(item.ar)}-{item.al.name}
                  </span>
                </div>
              </li>
            )
          })}
        </SongItem>
      </SongList>
    )
  }

  return (
    <CSSTransition in={showStatus} timeout={300} classNames="fly" appear={true} unmountOnExit onExited={props.history.goBack}>
      <Container>
        <Header ref={headerEl} isMarquee={isMarquee} title={title} handleClick={handleBack}></Header>
        {enterLoading ? <Loading></Loading> : null}
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {renderSongList()}
            </div>
          </Scroll>
        ) : null}
      </Container>
    </CSSTransition>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))
