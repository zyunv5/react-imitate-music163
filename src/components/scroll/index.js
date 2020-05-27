import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const Scroll = forwardRef((props, ref) => {
  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props
  const { pullUp, pullDown, onScroll } = props
  const [bScroll, setBScroll] = useState()
  const scrollContainerRef = useRef()
  useEffect(() => {
      //创建实例
    const scroll = new bScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
    })
    setBScroll(scroll)
    return () => {
      //清除实例
      setBScroll(null)
    }
  }, [])
  useEffect(() => {
      //每次重新渲染都要刷新实例
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  });
  useEffect(() => {
      if(!bScroll||onScroll) return
      bScroll.on("scroll")
  })
})

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']), // 滚动的方向
  click: true, // 是否支持点击
  refresh: PropTypes.bool, // 是否刷新
  onScroll: PropTypes.func, // 滑动触发的回调函数
  pullUp: PropTypes.func, // 上拉加载逻辑
  pullDown: PropTypes.func, // 下拉加载逻辑
  pullUpLoading: PropTypes.bool, // 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool, // 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool, // 是否支持向下吸底
}

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true,
}
