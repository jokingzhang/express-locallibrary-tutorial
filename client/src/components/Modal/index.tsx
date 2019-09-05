/* tslint:disable */
import React, { Children, cloneElement } from 'react';
import { render as reactRender, unmountComponentAtNode } from 'react-dom';
import Modal, { ModalProps } from 'antd/lib/modal';
import './style.scss';

export default Modal as INewModal;

type INewModal = typeof Modal & {
    open: (
        config: IConfig
    ) => IHandler & {
        result: Promise<any>;
    };
};

interface IHandler {
    close(data: any): void;
    dismiss(reason: any): void;
}

interface IConfig extends Omit<ModalProps, 'onOk' | 'onCancel'> {
    onOk?(e: React.MouseEvent<any>, handler: IHandler): void;
    onCancel?(e: React.MouseEvent<any>, handler: IHandler): void;
    component?: React.ComponentType | React.ReactElement<any>;
}

const defaultSettings = {
    destroyOnClose: true,
    footer: null,
    maskClosable: false,
    closable: false
};

/**
 * @desc 给antd的Modal扩展一个open方法，用来方便的创建更灵活的modal。
 *       默认的Modal组件依赖于组件声明式受控调用，非常麻烦，尤其是需要从组件内部关闭modal时，需要将关闭句柄向下传递；
 *       并且对于多modal场景下，使用也非常麻烦，需要定义多个状态值对应到不同的modal的visible状态！
 *
 *       新增的Modal.open方法，通过封装隐藏了visible控制，通过对外暴漏以及向下传递close、dismiss句柄以及promise，可以方便的用来从外部、组件内部关闭modal，
 *       并且可以方便的通过promise来处理modal关闭的回调！
 *
 * @usage Modal.open({ component: YourComponent / <YourComponent />, ...ModalProps  })
 *
 *        component参数支持传入组件定义，或者直接传入该组件调用的reactNode。
 *        无论哪种方式，Modal.open都会向其传递close、dismiss属性。
 *        在YourComponent组件内部，你可以方便的通过这两种方法来关闭modal。
 *
 *        close、dismiss两个方法都可以用来关闭modal，不同的是他们对于返回的promise的状态有影响：
 *        close => Promise.resolved
 *        dismiss => Promise.rejected
 *
 * @param {Object} config 配置参数，支持Modal的所有的props参数，另外新增扩展了component参数，具体使用参考上方说明!
 *
 * @return {Object} { close, dismiss, result: Promise }
 *          返回一个对象，包含了close、dismiss两个关闭方法，以及一个result的promise对象，可以通过该promise来访问modal关闭时的回调！
 */
export const open = ((Modal as INewModal).open = (props: IConfig = {}) => {
    let destroyed : any;
    let withResolve : any;
    let withReject : any;

    const settings = { ...defaultSettings, ...props };

    if (settings.footer === true) {
        delete settings.footer;
    }

    if (props.onOk) {
        settings.onOk = ev => props.onOk!(ev, { close, dismiss });
    }

    if (props.onCancel) {
        settings.onCancel = ev => props.onCancel!(ev, { close, dismiss });
    }

    const div = document.createElement('div');

    document.body.appendChild(div);

    function destroy() {
        if (!destroyed) {
            destroyed = true;

            unmountComponentAtNode(div);

            document.body.removeChild(div);
        }
    }

    function close(data : any) {
        render(false, () => withResolve(data));
    }

    function dismiss(reason : any) {
        render(false, () => withReject(reason));
    }

    function render(visible : boolean, callback?: () => void) {
        const { component: TheComponent, ...props } = settings;
        const childProps = {
            close,
            dismiss
        };

        let children;

        if (typeof TheComponent === 'function') {
            children = <TheComponent />;
        } else {
            children = TheComponent;
        }

        reactRender(
            // @ts-ignore
            <Modal
                // @ts-ignore
                onCancel={dismiss}
                // @ts-ignore
                onOk={close}
                {...props}
                visible={visible}
                afterClose={() => {
                    if (!callback) {
                        callback = withReject;
                    }

                    callback!();
                    destroy();
                }}>
                {Children.map(children, child => cloneElement(child as React.ReactElement<any>, childProps))}
            </Modal>,
            div
        );
    }

    render(true);

    return {
        close,
        dismiss,
        result: new Promise((resolve, reject) => {
            withResolve = resolve;
            withReject = reject;
        })
    };
});
