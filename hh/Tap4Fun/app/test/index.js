/**
 * Created by yayowd on 2018/2/3.
 */
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import R from 'ramda';

import {addRoute} from "../nav";
import {Route} from './ui/route';
import {Route2} from './ui/route2';
import {actors, addActor, identicalActor, storeActor} from './actor';
import {yySaga, loginSaga} from './saga';

// routes
const Route_ = connect((state, ownProps) => ({
    ...actors.prop(state),
    ...addActor.prop(state),
    ...identicalActor.prop(state),
    ...storeActor.prop(state),
    ...yySaga.prop(state),
    ...loginSaga.prop(state),
    ...ownProps
}), (dispatch, ownProps) => bindActionCreators({
    // _login: actorLogin.actions_.login,
}, dispatch))(Route);
addRoute('routeTest', Route_, {start: false});
addRoute('routeTest2', Route2);
