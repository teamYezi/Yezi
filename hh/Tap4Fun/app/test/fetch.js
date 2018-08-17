/**
 * Created by yayowd on 2018/2/6.
 */
import {Net} from "../net";

export class Test extends Net {
    static login = {
        r: new Test().api_('login', 'getPersonLogin'),
        p: (login, password) => ({
            login,
            password,
        }),
    };
}
