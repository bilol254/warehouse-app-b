import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
const ToastContext = React.createContext(undefined);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type = 'info') => {
        const id = Date.now().toString();
        const newToast = { id, message, type };
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };
    return (_jsxs(ToastContext.Provider, { value: { toasts, addToast, removeToast }, children: [children, _jsx("div", { className: "fixed bottom-4 right-4 z-50 space-y-2", children: toasts.map((toast) => (_jsx("div", { className: `toast toast-${toast.type}`, onClick: () => removeToast(toast.id), children: toast.message }, toast.id))) })] }));
}
export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast faqat ToastProvider ichida ishlaydi');
    }
    return context;
}
