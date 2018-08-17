/**
 * Created by yayowd on 2018/2/6.
 */
import {Net} from "../net";

export class Upload extends Net {
    static upload = {
        r: new Upload().api_('uploadImg', 'upload'),
        p: (phone, price,imgName,postfix,size,resolution,description,imgTag,ctag,forsale) => ({
            phone,
            price,
            imgName,
            postfix,
            size,
            resolution,
            description,
            imgTag,
            ctag,
            forsale
        }),
    };
    static uploadraw ={
        r:new Upload().api_("uploadRaw","Raw"),
        p:(phone,postfix,img_id,MD5)=>({
            phone,
            postfix,
            img_id,
            MD5
        })
    }

}
