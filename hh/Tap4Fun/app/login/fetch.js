/**
 * Created by yayowd on 2018/2/6.
 */
import {Net} from "../net";
import {Test} from "../test/fetch";


//sms 短信验证码
export class Login extends Net {
    static login = {
        r: new Login().api_('login', 'getPersonLogin'),
        p: (phone, password) => ({
            phone,
            password,
        }),
    };
    static sms={
        r:new Login().api_('','getSMS'),
        p:(phone)=>({
            phone
        })
    }
    static signup={
        r:new Login().api_('signup','Signup'),
        p:(phone,code,password)=>({
            phone,
            code,
            password
        })
    };
    static  personinfo={
        r:new Login().api_("personInfo","personInfo"),
        p:(postfix,name,gender,birthday,signature,id,check)=>({
            postfix,
            name,
            gender,
            birthday,
            signature,
            id,
            check
        })
    }
    static  getinfo={
        r:new Login().api_("getpersonInfo","getpersonInfo"),
        p:(phone)=>({
            phone
        })
    }
}
