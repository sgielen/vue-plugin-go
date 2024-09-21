import { defineComponent as _defineComponent } from 'vue';
import { render } from "./MyComponent.template.js";

export default /*@__PURE__*/ _defineComponent({
    setup(__props) {
        // TODO: don't use a global for this
        const exposed = window.MyComponentSetup();
        console.log(exposed);
        return exposed;
    },
    render,
});
