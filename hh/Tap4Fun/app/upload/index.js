/**
 * Created by yayowd on 2018/2/3.
 */
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import R from 'ramda';

import {addRoute} from "../nav";
import {UploadEdit} from "./ui/uploadedit";
import {uploadrawSaga, uploadSaga} from "./saga";
import {UploadRaw} from "./ui/uploadraw";
import {Checking} from "../store/ui/checking";

// routes
const UploadEdit_ = connect((state, ownProps) => ({
    ...uploadSaga.prop(state),
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(UploadEdit);

const UploadRaw_ = connect((state, ownProps) => ({
    ...uploadrawSaga.prop(state),
    // ...uploadSaga.prop(state),
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(UploadRaw);

const Checking_ = connect((state, ownProps) => ({
    // ...uploadrawSaga.prop(state),
    // ...uploadSaga.prop(state),
    // ...actors.prop(state),
    // ...addActor.prop(state),
    // ...identicalActor.prop(state),
    // ...storeActor.prop(state),
    // ...yySaga.prop(state),
    // ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Checking);
addRoute('UploadEdit', UploadEdit_, {start: false});
addRoute('UploadRaw', UploadRaw_, {start: false});
addRoute('Checking', Checking_, {start: false});
