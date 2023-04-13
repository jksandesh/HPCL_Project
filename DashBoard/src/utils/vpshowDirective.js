module.exports = {
    inViewport(el, topOffset, bottomOffset) {
        const rect = el.getBoundingClientRect();
        return !(rect.bottom - bottomOffset < 0 || rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.top + topOffset > window.innerHeight)
    },

    bind(el, binding) {
        const offsetExists = typeof binding.value === "string" && binding.value.split(",").length > 0;
        let offsetTop = 0;
        let offsetBottom = 0;
        if (offsetExists) {
            const offsets = binding.value.split(",");
            offsetTop = parseFloat(offsets[0]);
            offsetBottom = offsets.length > 1 ? parseFloat(offsets[1]) : 0;
        }
        el.classList.add('before-enter');
        el.$onScroll = function () {
            if (binding.def.inViewport(el, offsetTop, offsetBottom)) {
                el.classList.add('enter');
                el.classList.remove('before-enter');
                binding.def.unbind(el, binding)
            }
        };
        document.addEventListener('scroll', el.$onScroll)
    },

    inserted(el, binding) {
        el.$onScroll()
    },

    unbind(el, binding) {
        document.removeEventListener('scroll', el.$onScroll);
        delete el.$onScroll
    }
};
