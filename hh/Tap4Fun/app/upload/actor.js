/**
 * Created by yayowd on 2018/2/5.
 */
import {isEmpty} from '../common/util';

import {Actor, Actors} from '../saga';

export const namespace = 'upload';



export const actors = new Actors(namespace);
