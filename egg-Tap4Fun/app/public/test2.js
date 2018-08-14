'use strict';

//定义日记数据
var Diary = function(obj) {

    //序列化
    if (typeof obj === "string") {
        obj = JSON.parse(obj);
    }

    if (typeof obj === "object") {
        this.title = obj.title; //日记标题
        this.content = obj.content; //日记内容
        this.author = obj.author; //日记作者
    } else {
        this.title = "";
        this.content = "";
        this.author = "";
    }
};

Diary.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

//超星日记本智能合约
var SuperstarDiary = function() {

    LocalContractStorage.defineProperties(this, {
        _name: null, //合约名字
        _creator: null //合约创建者
    });

    LocalContractStorage.defineMapProperties(this, {
        //定义日记的Map容器，用来存放每一个日记数据
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

SuperstarDiary.prototype = {

    //初始化
    init: function() {
        this._name = "SuperstarDiary of Nebulas";
        this._creator = Blockchain.transaction.from;
    },

    //添加日记数据
    addDiaryInfo: function(title, content) {

        if (title === "") {
            throw new Error("日记标题不能为空！");
        }
        if (content === "") {
            throw new Error("日记内容不能为空！");
        }

        var from = Blockchain.transaction.from;
        var diaryItem = this.diarys.get(title);

        //判断日记是否存在
        if (diaryItem) {
            throw new Error("日记已经存在！");
        }

        //新增一个日记数据
        var diaryItem = new Diary({
            "title": title,
            "content": content,
            "author": from
        });

        this.diarys.put(title, diaryItem);
    },

    //查询日记数据
    getDiaryInfo: function(title) {
        if (title === "") {
            throw new Error("日记数据为空！");
        }
        return this.diarys.get(title);
    }
};

module.exports = SuperstarDiary;