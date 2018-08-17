/**
 * Created by yayowd on 2018/2/3.
 */
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import R from 'ramda';

import {addRoute} from "../nav";
import {actors, addActor, identicalActor, storeActor} from './actor';
import {Main} from "./ui/main";
import {commentsSaga, getmainpageSaga, searchSaga, userpageSaga} from "./saga";
import {NewFlatlist} from "./ui/newflatlist";
import {ImageDetail} from "./ui/imagedetail";
import {MainStore} from "../store/ui/mainstore";
import {ShoppingCart} from "../store/ui/shoppingcart";
import {add2cartSaga, catesearchSaga, otherpaySaga, storecartSaga, storepaySaga} from "../store/saga";
import {UserMainPage} from "./ui/usermainpage";
import {Search} from "./ui/search";

// routes
export const Main_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Main);

export const NewFlatlist_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(NewFlatlist);

export const ImageDetail_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...add2cartSaga.prop(state),
    ...commentsSaga.prop(state),
    ...storepaySaga.prop(state),
    ...otherpaySaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    // ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(ImageDetail);

export const MainStore_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...catesearchSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    // ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(MainStore);

export const ShoppingCart_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...storecartSaga.prop(state),
    ...storepaySaga.prop(state),
    ...otherpaySaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    // ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(ShoppingCart);

export const UserMainPage_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...userpageSaga.prop(state),
    // ...storecartSaga.prop(state),
    // ...storepaySaga.prop(state),
    // ...otherpaySaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    // ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(UserMainPage);

export const Search_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...userpageSaga.prop(state),
    ...searchSaga.prop(state),
    // ...storecartSaga.prop(state),
    // ...storepaySaga.prop(state),
    // ...otherpaySaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    // ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Search);

addRoute('MainPage', Main_, {start: false  });
addRoute('NewFlatlist', NewFlatlist_, {start: false  });
addRoute('ImageDetail', ImageDetail_, {start: false  });
addRoute('MainStore', MainStore_, {start: false});
addRoute('ShoppingCart', ShoppingCart_, {start: false});
addRoute('UserMainPage', UserMainPage_, {start: false});
addRoute('Search', Search_, {start: false});
