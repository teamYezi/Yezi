/**
 * Created by yayowd on 2017/4/25.
 */
import axios from "axios";
import querystring from "querystring";
import R from 'ramda';

const ax = axios.create({
    headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'application/json',
        'Content-type': 'application/x-www-form-urlencoded'
    },
    timeout: 1000 * 20,
    rejectUnauthorized: false,
    responseType: 'json',
    // httpsAgent: agent,
});

export class NetError extends Error {
    constructor(msg, code) {
        super(msg);
        this.code = code;
        this.name = 'NetError';
    }
}

export class Net {
    constructor(defRes = {}) {
        // 服务器地址
        this.host ='http://172.20.120.194:7001';
        // this.host ='http://127.0.0.1:7001';

        // 访问的模块名称
        this.module = '';
        // 请求成功但返回结果为空时的默认值
        this.defRes = defRes;
    }

    getUrl(api) {
        return `${this.host}${this.module}/${api}?`;
    }
    get(api,ps={}){
        console.log("url=>>",this.host+api,ps)
        let get=ax.get(this.host+api)
        return this.result(get);
    }

    post(api, ps = {}) {
        const url = this.getUrl(api);
        let param=ps.param;
        let count=0;
        param=eval('(' + param + ')')
        let route=""
        Object.keys(param).forEach(function(key){
            route+="&"+key+"="+param[key]
            count++
            console.log(key,param[key],count);
        });
        if(count==1){
            Object.keys(param).forEach(function(key){
                route=key+"="+param[key]
                console.log(key,param[key]);
            });
        }
        console.log(`Net:\n\tget: `+url+route,param);
        let post = ax.get(url+route);
        return this.result(post);
    }

    upload(api, ps = {}, fname, images) {
        const url = this.getUrl(api);
        console.log(`Net:\n\tpost: ${url}\n\tps: ${JSON.stringify(ps)}\n\tname: ${fname}\n\timages: ${images}`);

        // const {resizeImage} = PMInterface;
        const data = new FormData();
        data.append('param', JSON.stringify(ps));
        images.forEach((path, index) => {
            // const u = path.replace('file://', '');
            // resizeImage(u);
            data.append(fname, {
                type: 'image/jpeg',
                uri: path,
                name: `image${index}.jpg`,
            });
        });
        console.log('FormData', data);

        let post = ax.post(url, data);
        return this.result(post);
    }

    async result(post) {
        let data={"data":null}
         await post.then(response => response.data).then(res => {
             data["data"]=JSON.stringify(res)
            console.log(`\tdata11111: ${JSON.stringify(res)}`);
            // const error = code => {
            //     const {result, msg} = res;
            //     const tip = R.is(Number, result) ? msg : result;
            //     throw new NetError(tip, code);
            // };
            // if (R.isNil(res)) {
            //     throw new NetError('返回值为空');
            // } else {
            //     const {succ, success = -1, data = this.defRes, result} = res;
            //     if (succ || success == '1') { // 不使用全等，匹配数字或字符串
            //         return {...res, data};
            //     }
            //     error(success);
            // }
        })
        return data
        //     .catch(error => {
        //     console.log('Net', 'result', 'error', error.message, error.code);
        //     throw new NetError(error.message, error.code)
        // });
    }

    // 添加全局参数
    //  所有请求都会带上这些参数
    static additionPs(ps) {
        // ps.clientId || (ps.clientId = clientId()); // 所有接口带上用户id参数，不覆盖
        // ps.clientid || (ps.clientid = ps.clientId);
        return ps;
    }




    api(name, method) {
        return (ps) => this.post(`${name}.do`, {method, ...Net.additionPs(ps)});
    }

    // 注意：将所有参数封装到param中
    api_(name, method) {
        return (ps) => this.post(`${name}`, {method, param: JSON.stringify(Net.additionPs(ps))});
    }

    api_get(name) {
        return (ps) => this.get(`${name}`, {param: JSON.stringify(Net.additionPs(ps))});
    }


    up(name, method) {
        return ({ps, fname, images}) => this.upload(`${name}.do`, {method, ...Net.additionPs(ps)}, fname, images);
    }

    // 注意：将所有参数封装到param中
    up_(name, method) {
        return ({ps, fname, images}) => this.upload(`${name}.do?method=${method}&param=${encodeURIComponent(JSON.stringify(Net.additionPs(ps)))}`, undefined, fname, images);
    }
}
