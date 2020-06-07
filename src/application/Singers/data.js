import React,{createContext,useReducer} from "react";
import {fromJS} from 'immutable';

//context
export const CategoryDataContext=createContext({})

//相当于之前的constants
export const CHANGE_GATEGORY='singers/CHANGE_CATEGORY';
export const CHANGE_ALPHA="singers/CHANGE_ALPHA";
export const CHANGE_AREA="singers/CHANGE_AREA";

//reducer纯函数
const reducer=(state,action)=>{
  switch(action.type){
    case CHANGE_GATEGORY:
      return state.set('category',action.data);
    case CHANGE_ALPHA:
      return state.set('alpha',action.data);
    case CHANGE_AREA:
      return state.set('area',action.data);
    default:
      return state;
  }
}

//Provider组件
export const Data=props=>{
  //useReducer的第二个参数中传入初始值
  const [data,dispatch]=useReducer(reducer,fromJS({
    category:"",
    area:"",
    alpha:""
  }));
  return(
    <CategoryDataContext.Provider value={{data,dispatch}}>
      {props.children}
    </CategoryDataContext.Provider>
  )
}