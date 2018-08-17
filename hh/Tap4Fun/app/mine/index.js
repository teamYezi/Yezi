/**
 * Created by yayowd on 2018/2/3.
 */
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import R from 'ramda';

import {addRoute} from "../nav";
import {actors, addActor, identicalActor, storeActor} from './actor';
import {Mine} from "./ui/mine";
import {balanceSaga, fansSaga, followSaga, incomeSaga, mineSaga, moneydetailSage, mylikesSaga} from "./saga";
import {Product} from "./ui/product";
import {Followed} from "./ui/followed";
import {Fans} from "./ui/fans";
import {Wallet} from "./ui/wallet";
import {MoneyDetail} from "./ui/moneydetail";
import {MyMessage} from "./ui/mymessage";
import {Income} from "./ui/income";
import {MyOrder} from "./ui/myorder";
import {MyStared} from "./ui/mystared";
import {Deposit} from "./ui/deposit";
import {Withdraw} from "./ui/withdraw";

// routes
export const Mine_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Mine);
export const Product_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Product);

export const Followed_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...followSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Followed);

export const Fans_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Fans);
export const Wallet_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...balanceSaga.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Wallet);
export const MoneyDetail_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...moneydetailSage.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(MoneyDetail);
export const MyMessage_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...moneydetailSage.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(MyMessage);

export const Income_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...incomeSaga.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Income);

export const MyOrder_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...incomeSaga.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(MyOrder);

export const MyStared_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...mylikesSaga.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(MyStared);

export const Deposit_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...balanceSaga.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Deposit);

export const Withdraw_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...balanceSaga.prop(state),
    // ...mineSaga.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...fansSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Withdraw);

addRoute('mine', Mine_, {start: false});
addRoute('Product', Product_, {start: false});
addRoute('Followed', Followed_, {start: false});
addRoute('Fans', Fans_, {start: false});
addRoute('Wallet',Wallet_,{start:false});
addRoute("MoneyDetail",MoneyDetail_,{start:false});
addRoute("MyMessage",MyMessage_,{start:false})
addRoute("Income",Income_,{start:false})
addRoute("MyOrder",MyOrder_,{start:false})
addRoute("MyStared",MyStared_,{start:false})
addRoute("Deposit",Deposit_,{start:false})
addRoute("Withdraw",Withdraw_,{start:false})

