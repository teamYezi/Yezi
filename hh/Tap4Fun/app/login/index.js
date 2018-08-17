/**
 * Created by loveMei on 2018/7/18.
 */
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import R from 'ramda';

import {addRoute} from "../nav";
import {Login} from "./ui/login";
import {getinfoSaga, loginSaga, signupSaga, smsSaga,upinfoSage} from "./saga";
import {Signup} from "./ui/signup";
import {PersonInfo} from "./ui/PersonInfo";

// routes
const Login_ = connect((state, ownProps) => ({
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Login);

const Signup_ = connect((state, ownProps) => ({
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    ...smsSaga.prop(state),
    ...signupSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Signup);

const PersonInfo_ = connect((state, ownProps) => ({
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...signupSaga.prop(state),
    ...upinfoSage.prop(state),
    ...getinfoSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(PersonInfo);

addRoute('LoginScreen', Login_, {start: false  });
addRoute('SignupScreen', Signup_, {start: false});
addRoute('PersonInfoScreen', PersonInfo_, {start: false});

// addRoute('routeTest2', Route2);
