/**
 * Created by yayowd on 2018/2/3.
 */
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import R from 'ramda';

import {addRoute} from "../nav";
import {actors, addActor, identicalActor, storeActor} from './actor';
import {Store} from "./ui/store";
import {catesearchSaga, storeSaga} from "./saga";
import {ImageDetail} from "../main/ui/imagedetail";
import {MainStore} from "./ui/mainstore";
import {ImageDetail_} from "../main";
import {SuccPay} from "./ui/succpay";
import {FailPay} from "./ui/failpay";

export const Store_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    // ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Store);


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

export const SuccPay_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    // ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(SuccPay);

export const FailPay_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    // ...getmainpageSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(FailPay);

// routes
addRoute('Store', Store_, {start: false});
addRoute('SuccPay', SuccPay_, {start: false});
addRoute('FailPay', FailPay_, {start: false});
