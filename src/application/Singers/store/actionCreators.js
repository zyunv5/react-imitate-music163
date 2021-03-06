import {
  getHotSingerListRequest,
  getSingerListRequest,
} from "../../../api/request";
import {
  CHANGE_SINGER_LIST,
  CHANGE_PAGE_COUNT,
  CHANGE_ENTER_LOADING,
  CHANGE_PULLUP_LOADING,
  CHANGE_PULLDOWN_LOADING,
} from "./constants";
import { fromJS } from "immutable";

const changeSingerList = (data) => ({
  type: CHANGE_SINGER_LIST,
  data: fromJS(data),
});
export const changePageCount = (data) => ({
  type: CHANGE_PAGE_COUNT,
  data,
});

//进场loading
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data,
});
export const changePullUpLoading = (data) => ({
  type: CHANGE_PULLUP_LOADING,
  data,
});
export const changePullDownLoading = (data) => ({
  type: CHANGE_PULLDOWN_LOADING,
  data,
});

//第一次加载热门歌手
export const getHotSingerList=()=>{
  return(dispatch)=>{
    getHotSingerListRequest(0).then(res=>{
      const data=res.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false))
    }).catch(()=>{
      console.log('热门歌手数据获取失败')
    })
  }
}

//加载更多热门歌手
export const refreshMoreHotSingerList=()=>{
  return (dispatch,getState)=>{
    const pageCount=getState().getIn(['singers','pageCount'])
    const singerList=getState().getIn(['singers','singerList']).toJS();
    console.log(pageCount);
    getHotSingerListRequest(pageCount).then(res=>{
      const data=[...singerList,...res.artists];
      dispatch(changeSingerList(data));
      dispatch(changePullDownLoading(false))
    }).catch(()=>{
      console.log('热门歌手数据获取失败');
    })
  }
}

//第一次加载时对应类别的歌手
export const getSingerList=(category,area,alpha)=>{
  return (dispatch,getState)=>{
    getSingerListRequest(category,area,alpha,0).then(res=>{
      const data=res.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false));
    }).catch(()=>{
      console.log("歌手数据获取失败");
    })
  }
}

//加载更多的歌手
export const refreshMoreSingerList=(category,area,alpha)=>{
  return (dispatch,getState)=>{
    const pageCount=getState().getIn(['singers','pageCount']);
    const singerList=getState().getIn(['singers','singerList']).toJS();
    getSingerListRequest(category,area,alpha,pageCount).then(res=>{
      const data=[...singerList,...res.artists];
      dispatch(changeSingerList(data));
      dispatch(changePullUpLoading(false));
    }).catch(()=>{
      console.log("歌手数据获取失败")
    })
  }
}
