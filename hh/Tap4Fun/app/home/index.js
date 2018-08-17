/**
 * Created by loveMei on 2018/7/20.
 */
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import R from 'ramda';

import SideMenu from 'react-native-side-menu'
import {addRoute} from "../nav";
import {Home} from "./ui/home";
import LeftMenu, {SideBar} from "./ui/leftmenu";
import {Store} from "../store/ui/store";
import {ImageDetail} from "../main/ui/imagedetail";
import {mineSaga} from "../mine/saga";
import {AboutUs} from "./ui/aboutus";


// routes
const Home_ = connect((state, ownProps) => ({
    ...mineSaga.prop(state),
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Home);

export const SideBar_ = connect((state, ownProps) => ({
    ...mineSaga.prop(state),
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(SideBar);

export const AboutUs_ = connect((state, ownProps) => ({
    // ...mineSaga.prop(state),
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(AboutUs);


addRoute('HomeScreen', Home_, {start: true});
addRoute('AboutUs', AboutUs_, {start: false});
// addRoute('ImageDetail', ImageDetail_, {start: false});
// addRoute('routeTest2', Route2);
