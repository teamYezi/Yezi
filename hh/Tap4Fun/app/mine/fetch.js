/**
 * Created by yayowd on 2018/2/6.
 */
import {Net} from "../net";

export class Mine extends Net {
    static mine = {
        r: new Mine().api_('myInfo', 'getPersonLogin'),
        p: (phone) => ({
                phone
        }),
    };
    static published={
        r:new Mine().api_('myImg/published','published'),
        p:(phone,page)=>({
            phone,page
        })
    };
    static pending={
        r:new Mine().api_('myImg/pending','pending'),
        p:(phone,page)=>({
            phone,page
        })
    };
    static follow={
        r:new Mine().api_('myImg/follow','follow'),
        p:(phone,page)=>({
            phone,
            page
        })
    };
    static fans={
        r:new Mine().api_('myImg/fans','fans'),
        p:(phone,page)=>({
            phone,
            page
        })
    };
    static onfollow={
        r:new Mine().api_('follow','follow'),
        p:(selfID,targetID)=>({
            selfID,
            targetID
        })
    }
    static  mybalance={
        r:new Mine().api_('mybalance','follow'),
        p:(phone)=>({
            phone
        })
    }
    static moneydetail={
        r:new Mine().api_("mybalance/details",'detail'),
        p:(phone,page)=>({
            phone,
            page
        })}
    static messagelikes={
        r:new Mine().api_("mymessage/likes",'likes'),
        p:(phone,page)=>({
            phone,
            page
        })
    }
    static msgcomments={
        r:new Mine().api_("mymessage/comments",'comments'),
        p:(phone,page)=>({
            phone,
            page
        })
    }
    static notification={
        r:new Mine().api_("mymessage/notification",'notification'),
        p:(phone,page)=>({
            phone,
            page
        })
    }
    static income={
        r:new Mine().api_("mytransaction",'income'),
        p:(phone,page)=>({
            phone,
            page
        })
    }
    static mylikes={
        r:new Mine().api_("mylikes",'income'),
        p:(phone,page)=>({
            phone,
            page
        })
    }
    static myorder={
        r:new Mine().api_("myorders","orders"),
        p:(phone,page,category)=>({
            phone,
            page,
            category
        })
    }
    static deposit={
        r:new Mine().api_("other/deposit"),
        p:(phone,rmb)=>({
            phone,
            rmb
        })
    }
    static withdraw={
        r:new Mine().api_("other/withdraw"),
        p:(phone,rmb)=>({
            phone,
            rmb
        })
    }
}
