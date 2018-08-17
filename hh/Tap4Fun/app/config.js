/**
 * Created by yayowd on 2018/2/2.
 */
import {Platform, StatusBar, Dimensions, NativeModules} from 'react-native';
// import codePush from "react-native-code-push";
import React from 'react';
import PropTypes from 'prop-types';

// const DEBUG = false;
const DEBUG = false;
if (!DEBUG) {
    console.log = () => {
    };
}

const {PMInterface,} = NativeModules;
export const {width, height} = Dimensions.get('window');
const lh = Platform.select({
    ios: 0,//PMInterface.deviceModel === 'iPhoneX' ? 10 : 0,
    android: 0,
});
const paddingTop = lh + Platform.select({
    ios: StatusBar.currentHeight > 0 ? StatusBar.currentHeight : 20,
    android: 0,
});


React.PropTypes = PropTypes;


export const config = {
    // codepush升级配置
    // codePushOptions: {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME},
    // 个推配置
    getui: {
        AppID: 'jI9hjJf2hp50Ajdy0V2DlA',
        AppSecret: 'vX5eFiP7Q872qkgGIFmYR7',
        AppKey: 'yZysh8RXSu6B6QQoCleq18',
    },


    // 颜色：透明
    COLOR_TRANSPARENT: 'transparent',

    //屏幕宽
    screenWidth: width < height ? width : height,
    //屏幕高
    screenHeight: width < height ? height : width,

    // 颜色：APP背景
    COLOR_BACKGROUND: '#fff',
    // 颜色：只读背景
    COLOR_READONLY_BACKGROUND: '#fff2',
    // 颜色：内容背景：透明度
    COLOR_CONTENT_BACKGROUND: '#0000',
    // 颜色：标题栏背景
    // COLOR_HEADER_BACKGROUND: '#ff000f',
    // COLOR_HEADER_BACKGROUND: '#4abfee',
    COLOR_HEADER_BACKGROUND: '#ff9800',
    // 颜色：搜索栏背景
    COLOR_SEARCHBAR_BACKGROUND: '#fff6',
    // 颜色：标题栏文本
    COLOR_HEADER_TEXT: '#fff',
    // 颜色：内容文本
    COLOR_CONTENT_TEXT: '#777',
    // 颜色：工具栏按钮选中背景
    COLOR_FOOTER_ACTIVE_BACKGROUND: '#73bef0',
    // 颜色：工具栏按钮背景
    COLOR_FOOTER_RED_BUTTON_BACKGROUND: '#c9caca',
    // 颜色：工具栏按钮背景
    COLOR_TOOLBAR_RED_BUTTON_BACKGROUND: '#f04f14',
    // 颜色：列表项标题
    // COLOR_LIST_ITEM_TITLE_TEXT: '#rgba(0,118,255,0.9)',
    COLOR_LIST_ITEM_TITLE_TEXT: '#333',
    // 颜色：列表项备注
    COLOR_LIST_ITEM_MEMO_TEXT: 'gray',
    // 颜色:警告异常按钮颜色
    COLOR_WARN_LOST_GARY_BUT: 'gray',
    // 颜色: 列表内容颜色
    COLOR_LIST_CONTENT_TEXT: '#A5A5A5',

    // 字体：尺寸：标题文本
    FONT_SIZE_HEADER_TEXT: 19,
    // 字体：尺寸：内容文本
    FONT_SIZE_CONTENT_TEXT: 15,
    // 字体：尺寸：按钮文本
    FONT_SIZE_BUTTON_TEXT: 12,

    // 附件图片：最多列数
    IMAGE_THUMB_MAX_COL: 4,
    // 附件图片：最多行数
    IMAGE_THUMB_MAX_ROW: 5,

    // 内边距：屏幕-顶部-状态栏
    PADDING_TOP: paddingTop,
    // 内边距：内容
    // PADDING_CONTENT: 19,
    PADDING_CONTENT: 0,
    // 内边距：工具栏
    PADDING_TOOLBAR: 12,

    // 外边距：内容
    MARGIN_CONTENT: 9,

    // 圆角：内容
    RADIUS_CONTENT: 9,
    // 圆角：工具栏
    RADIUS_FOOTER: 19,

    // 高度：标题栏
    HEIGHT_HEADER: 44,
    // 高度：低栏
    HEIGHT_FOOTER: 44,
    // 高度：工具栏
    HEIGHT_TOOLBAR: 44,

    // 翻页：页面大小
    PAGE_SIZE: 9,


};

// 版本号
// export const VERSION_NATIVE = PMInterface.version;
export const VERSION_JSBUNDLE = '0.1.1';
export const VERSION = `(${VERSION_JSBUNDLE})`;
// export const VERSION = `${VERSION_NATIVE}(${VERSION_JSBUNDLE})`;
