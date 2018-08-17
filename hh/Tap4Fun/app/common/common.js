/**
 * Created by LoveMei on 2018/7/15.
 */
import {
    Platform,
    NativeModules,
    NativeEventEmitter,
    Dimensions
} from 'react-native';
const {width, height} = Dimensions.get('window');
// import * as DeviceInfo from 'react-native-device-info';
// import {MapView, MapTypes, MapModule, Geolocation,} from 'react-native-baidu-map';
import R from 'ramda';
import Qiniu, { Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu';
Conf.ACCESS_KEY = "BN55sa8rG_ysQVGM8wyLwSSlVAzqm7vJcu-9w4ym";
Conf.SECRET_KEY = "4inBI5B0kAsp13jzk9_oJn1O_ozSgpJK6mlQdjQN";
Conf.UP_HOST = "http://up-z2.qiniu.com";
import moment from 'moment'
//设置公钥 密钥 和你服务器所在的HOST 这里可以通过服务器获取


    export const isIphoneX =(height/width>2)?true:false


// import * as beacons from './beacons';

/////////////////////////////////////////////
// 业务常量

// 设备类型
export const phoneType = Platform.select({
    ios: 1,
    android: 2,
});
// 设备编码
// export const phoneCode = DeviceInfo.getUniqueID();
//时间显示格式函数
export const showTime=(time)=>{
    let currtime=new Date();
    let diff=currtime-time;
    if(diff<60000){
        return Math.round(diff/1000)+'秒前'
    }else if(diff>=60000&&diff<60*60*1000){
        return Math.round(diff/1000/60)+'分钟前'
    }else if(diff>=60*60*1000&&diff<60*60*1000*24){
        return Math.round(diff/1000/60/60)+'小时前'
    }
    else if(diff>=24*3600000&&diff<3600000*24*7){
        return Math.round(diff/1000/60/60/24)+'天前'
    }else {
        time=new moment(parseInt(time)).format("YYYY-MM-DD")
        return time
    }

}

/////////////////////////////////////////////
// saga 辅助函数

//七牛上传图片函数
export const uploadImg=(bucket,key,local_url,filename,size,width,height)=>{
    let params = {
        uri: local_url,//图片路径  可以通过第三方工具 如:ImageCropPicker等获取本地图片路径
        key: key,//要上传的key
    }
    let letbody = new FormData();

    // let putPolicy=new Qiniu.auth.PutPolicy2(
    //     {scope:`${bucket}:${key}`}
    // )

    let policy = {
        scope: `${bucket}:${key}`,//记得这里如果格式为<bucket>:<key>形式的话,key要与params里的key保持一致,详见七牛上传策略
        expires: 7200,
        returnBody://returnBody 详见上传策略
            {
                name: `$(${filename})`,//获取文件名
                size: `$(${size})`,//获取文件大小
                w: `$(${width})`,//...
                h: `$(${height})`,//...
            },
    };
    Rpc.uploadFile(params, policy).then((data)=>{
        console.log("uploadImg====>>",data)
    })
// token和key都是通过七牛返回的参数
//     body.append('token',uptoken);
//     body.append('key',key);
//     body.append('file',{
//         // 设定上传的格式
//         type : 'image/jpeg',
//         // 通过react-native-image-picker获取的图片地址
//         uri : local_url,
//         name : key,
//     });


// 开启XMLHttpRequest服务
//     let xhr = new XMLHttpRequest();
//
//     /** 上传到七牛云的地址 */
//     let url = 'http://up-z2.qiniu.com/';

// 开启post上传
//     xhr.open('POST',url);

// 如果正在上传,返回上传进度
//     if (xhr.upload){
//         xhr.upload.onprogress = (event)=>{
//             if (event.lengthComputable){
//                 let perent = event.loaded / event.total.toFixed(2);
//                 // 打印上传进度
//                 console.log(perent);
//             }
//         }
//     }

    // 上传过成功的返回
    // xhr.onload = ()=>{
    //     // console.log(xhr.status);
    //     // 状态码如果不等于200就代表错误
    //     if (xhr.status !== 200){
    //         alert('请求失败');
    //         console.log(xhr.responseText);
    //         return;
    //     }
    //     if (!xhr.responseText){
    //         alert('请求失败');
    //         console.log(xhr.responseText);
    //         return;
    //     }
    //     // 服务器最后返回的数据
    //     let response;
    //     try{
    //         // 将返回数据还原
    //         response = JSON.parse(xhr.response);
    //         console.log(response);
    //         // ...通过返回数据做接下来的处理
    //     }
    //
    //     // 发送请求
    //     xhr.send(body);
    // }


    // let putPolicy=new qiniu.auth.PutPolicy2(
    //     {scope:`${bucket}:${key}`}
    // )
    // let uptoken=putPolicy.token();
    //
    // let formData = new FormData();
    // formData.append("token", uptoken);
    // formData.append("key", key);
    // formData.append("file", bucket);
    //
    // // qiniu.rpc.uploadImage(local_url,key,function (resp) {
    // //     console.log("resp=====>>>",resp)
    // // })
    // fetch('http://up-z2.qiniu.com/',{
    //     method:'POST',
    //     headers:{
    //         'Content-Type':'multipart/form-data',
    //     },
    //     body:formData,
    // })
    //     .then((response) => response.json())
    //     .then((responseData)=>{
    //         console.log('responseData=',responseData);
    //
    //     })
    //     .catch((error)=>{console.error('error=',error)});

}


// 获取登录信息（全）
// export const getLoginInfo = state => loginSaga.saData(state);
// export const getBluInfo = state => getblueSaga.saData(state);
// export const getBindInfo = state =>bindSage.saData(state);
// // 获取用户编号
// export const getPerson = state => R.prop('person', getLoginInfo(state));
// export const getPersonId = state => R.path(['person', 'id'], getLoginInfo(state));
// export const getUserId = state => R.path(['user', 'id'], getLoginInfo(state));
// export const getPersonPhone = state => R.prop('personPhone', getLoginInfo(state));
// export const getBindPersonPhone = state => R.prop('personId', getBindInfo(state));
// export const getPassword = state => R.prop('password', getLoginInfo(state));
// // export const getPassword = state => getLoginInfo(state).password;
// export const getUuid = state => {
//     const [{id} = {}] = getBluInfo(state);
//     return id;
// };
//
// export const getBlueCode = state => {
//     const [{code} = {}] = getBluInfo(state);
//     return code;
// };


/////////////////////////////////////////////
// 蓝牙相关

// 设备蓝牙状态
// const {BleManager} = NativeModules;
// const bleManagerEmitter = new NativeEventEmitter(BleManager);
// export const bleCheckState = () => new Promise((resolve, reject) => {
//     const onState = args => {
//         bleManagerEmitter.removeListener('BleManagerDidUpdateState', onState);
//         // The new state: args.state
//         const {state} = args;
//         resolve(state);
//     };
//     bleManagerEmitter.addListener('BleManagerDidUpdateState', onState);
//     bleManager.checkState();
// });

// beacons监测：开始
// export const startScanBeacons = async (regions: [{ identifier: String, uuid: String }], cb) => {
//     beacons.init();
//     await beacons.start(regions, cb);
// };
// export const stopScanBeacons = async () => {
//     await beacons.stop();
// };


/////////////////////////////////////////////
// 地图相关

// 获取当前位置
export const location = () => new Promise((resolve, reject) => {
    // RN官方定位API
    // 在Android上总是出现timed out
    // ** 不再使用 **
    // navigator.geolocation.getCurrentPosition(
    //     position => resolve(position),
    //     error => reject(error),
    //     {enableHighAccuracy: true, timeout: 30000, maximumAge: 0}
    // );
    // 百度地图定位API
    // position  = {
    //     "province": "贵州省",
    //     "city": "毕节市",
    //     "district":"七星关区",
    //     "streetName": "兴海大街",
    //     "address": "贵州省毕节市七星关区兴海大街",
    //     "streetNumber": "",
    //     "latitude": 27.368,
    //     "longitude": 105.395897,
    // }
    Geolocation.getCurrentPosition().then(position => {
        console.log(`Geolocation.getCurrentPosition: pos=${JSON.stringify(position)}`);
        // const {latitude, longitude} = pos;
        resolve(position);
    }).catch(error => {
        console.log(`Geolocation.getCurrentPosition error: ${error}`);
        reject(error);
    });
});
