/**
 * Created by yayowd on 2018/2/5.
 */
import {isEmpty} from '../common/util';

import {Actor, Actors} from '../saga';

export const namespace = 'test';

class AddActor extends Actor {
    proc(state, action) {
        const {payload = {}} = action;
        const {num1, num2} = payload;
        console.log('aaa', 'num1', num1, 'num2', num2);
        return num1 + num2;
    }

    add(num1, num2) {
        this.dispatch({num1, num2});
    }
}

class IdenticalActor extends Actor {
    identical(name) {
        this.dispatch(name);
    }
}

export const actors = new Actors(namespace);
export const addActor = new AddActor(namespace, 'add', actors);
export const identicalActor = new IdenticalActor(namespace, 'identical', actors);
export const storeActor = new Actor(namespace, 'haha', actors, '12345');
