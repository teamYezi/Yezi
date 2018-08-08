'use strict';

var Yezi = function(obj) {
    //序列化
    if (typeof obj === "string") {
        obj = JSON.parse(obj);
    }
    if (typeof obj === "object") {
        this.img_url = obj.img_url;
        this.time = obj.time;
        this.phone = obj.phone;
        this.id = obj.id;
        this.img_id = obj.img_id;
        this.MD5 = obj.MD5;
    } else {
        this.img_url = "";
        this.time = "";
        this.phone = "";
        this.id = "";
        this.img_id = "";
        this.MD5 = "";
    }
};

Yezi.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

//超星日记本智能合约
var Yeziapp = function() {
    LocalContractStorage.defineProperties(this, {
        _name: "yezicopyright", //合约名字
        _creator: 'yezi' //合约创建者
    });

    LocalContractStorage.defineMapProperties(this, {
        //定义日记的Map容器，用来存放每一个数据
        "diarys": {
            parse: function(value) {
                return new Diary(value);
            },
            stringify: function(o) {
                return o.toString();
            }
        }
    });
};
Yeziapp.prototype = {
    //初始化
    init: function() {
        this._name = "YeziCopyRight of Nebulas";
        this._creator = Blockchain.transaction.from;
    },
    //添加日记数据
    addDiaryInfo: function(img_url, time, phone, id, img_id, MD5) {
        var from = Blockchain.transaction.from;
        var diaryItem = this.diarys.get(id);

        //判断日记是否存在
        if (diaryItem) {
            throw new Error("id重复！");
        }

        //新增一个日记数据
        var diaryItem = new Diary({
            "img_url": img_url,
            "time": time,
            "phone": phone,
            "id": id,
            "img_id": img_id,
            "MD5": MD5,
        });

        this.diarys.put(id, diaryItem);
    },
    //查看数据
    getDiaryInfo: function(id) {
        return 1;
    }
};

module.exports = Yeziapp;