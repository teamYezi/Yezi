/**
 * Created by yayowd on 2018/2/6.
 */
import {Net} from "../net";

export class MainPage extends Net {
    static getmainpage = {
        r: new MainPage().api_('mainpage', 'getMainpage'),
        p: (phone,page) => ({
            phone,
            page
        }),
    };
    static star={
        r:new MainPage().api_('likeOrUnlike','star'),
        p:(id,phone)=>({
            id,
            phone
        })
    }
    static imagedetail={
        r:new MainPage().api_('imgDetail','imgdetail'),
        p:(id,phone)=>({
            id,
            phone
    })
    };
    static userpage={
        r:new MainPage().api_('userpage','imgdetail'),
        p:(selfID,targetID,page)=>({
            selfID,
            targetID,
            page
        })
    };
    static comments={
        r:new MainPage().api_('imgDetail/comments'),
        p:(id,page)=>({
            id,
            page
        })
    }
    static addcomment={
        r:new MainPage().api_('addcomment'),
        p:(id,phone,cmt)=>({
            id,
            phone,
            cmt
        })
    }
    static search={
        r:new MainPage().api_('search'),
        p:(input,page)=>({
            input,page
        })
    }
}


