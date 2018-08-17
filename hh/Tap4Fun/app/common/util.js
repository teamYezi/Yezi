/**
 * Created by yayowd on 2018/2/2.
 */
import R from "ramda";
import Toast from "react-native-root-toast";

export const showToast = msg => {
    if (!isEmpty(msg)) {
        const toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
        // Toast.hide(toast);
        return toast;
    }
};

// validate
export const error = (...ps) => {
    console.error(...ps);
    throw new Error(ps.join(', '));
};
export const isEmpty = data => (R.isNil(data) || R.isEmpty(data));
export const validate = (errorTest, tip, err = tip) => {
    if (errorTest) {
        showToast(tip);
        throw new Error(err);
    }
};
export const validateNonEmpty = (data, tip, err = 'data is empty') => {
    validate(isEmpty(data), tip, err);
};

// reducer
export const nothing = () => {
};
export const identity = v => v;
export const defReducer = (state, {payload}) => payload;
export const cf = (name, payload = {}, ps = [], def = identity) => R.pathOr(def, [name])(payload)(...ps);
export const cfCb = (payload = {}, ...ps) => cf('cb', payload, ps);
