import React, { useEffect, useContext } from 'react'
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList,
} from './store/actionCreators'
import Horizen from '../../baseUI/horizen-item'
import Scroll from '../../baseUI/scroll/index'
import { categoryTypes, areaTypes, alphaTypes } from '../../api/config'
import { NavContainer, List, ListContainer, ListItem } from './style'
import { connect } from 'react-redux'
import Loading from '../../baseUI/loading/index'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { CategoryDataContext, CHANGE_ALPHA, CHANGE_GATEGORY, CHANGE_AREA, Data } from './data'

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
})

const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList())
    },
    updateDispatch(category, area, alpha) {
      dispatch(changePageCount(0))
      dispatch(changeEnterLoading(true))
      dispatch(getSingerList(category, area, alpha))
    },
    pullUpRefreshDispatch(category, area, alpha, hot, count) {
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count + 1))
      if (hot) {
        dispatch(refreshMoreHotSingerList())
      } else {
        dispatch(refreshMoreSingerList(category, area, alpha))
      }
    },
    pullDownRefreshDispatch(category, area, alpha) {
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0))
      if (category === '' && alpha === '' && area === '') {
        dispatch(getHotSingerList())
      } else {
        dispatch(getSingerList(category, area, alpha))
      }
    },
  }
}

function Singers(props) {
  // 引入useContext 注释掉useState
  // let [category, setCategory] = useState("");
  // let [alpha, setAlpha] = useState("");
  const { data, dispatch } = useContext(CategoryDataContext)
  const { category, area, alpha } = data.toJS()

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props
  const { getHotSingerDispatch, updateDispatch, pullUpRefreshDispatch, pullDownRefreshDispatch } = props

  let handleUpdateCatetory = (val) => {
    // setCategory(val);
    dispatch({ type: CHANGE_GATEGORY, data: val })
    updateDispatch(val, area, alpha)
  }

  let handleUpdateArea = (val) => {
    dispatch({ type: CHANGE_AREA, data: val })
    updateDispatch(category, val, alpha)
  }

  let handleUpdateAlpha = (val) => {
    // setAlpha(val);
    dispatch({ type: CHANGE_ALPHA, data: val })
    updateDispatch(category, area, val)
  }

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, area, alpha, category === '', pageCount)
  }

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, area, alpha)
  }

  useEffect(() => {
    if (!singerList.size) {
      getHotSingerDispatch()
    }
  }, [])

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : []
    return (
      <List>
        {list.map((item, index) => {
          return (
            <ListItem key={item.accountId + '' + index}>
              <div className="img_wrapper">
                <LazyLoad placeholder={<img width="100%" height="100%" alt="music" src={require('./singer.png')} />}>
                  <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          )
        })}
      </List>
    )
  }

  return (
    <div>
      <Data>
        <NavContainer>
          <Horizen list={categoryTypes} title={'分类(默认热门):'} handleClick={handleUpdateCatetory} oldVal={category}></Horizen>
          <Horizen list={areaTypes} title={'地区:'} handleClick={handleUpdateArea} oldVal={area}></Horizen>
          <Horizen list={alphaTypes} title={'首字母:'} handleClick={(val) => handleUpdateAlpha(val)} oldVal={alpha}></Horizen>
        </NavContainer>
        <ListContainer>
          <Scroll
            pullUp={handlePullUp}
            pullDown={handlePullDown}
            pullUpLoading={pullUpLoading}
            pullDownLoading={pullDownLoading}
            onScroll={forceCheck}
          >
            {renderSingerList()}
          </Scroll>
          <Loading show={enterLoading}></Loading>
        </ListContainer>
      </Data>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))
