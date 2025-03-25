import openEllipsis from '../index.js'
import '../ellipsis.css'

export default {
    /**
     * Description placeholder
     *
     * @param {*} app
     * @param {string} [thema='element-dark']
     */
    thema: 'element-dark',
    install(app) {
        const doc = document.documentElement
        doc.dataset.ellipsis = this.thema

        app.directive('ell', {
            mounted: function (dom, binding) {
                const { value, arg, modifiers } = binding
                if (value === false) {
                    return
                }
                setTimeout(
                    () => {
                        const positionMap = {
                            l: 'left',
                            r: 'right',
                            b: 'bottom',
                            t: 'top',
                        }
                        let position = 'top',
                            type
                        if (/[lrbt]-a/.test(arg)) {
                            position = positionMap[arg[0]]
                            type = 'always'
                            dom.classList.add('ell-a-' + arg[0])
                            if (value) {
                                dom.setAttribute('ell-value', value)
                            }
                        } else if (/[lrbt]-\d+/.test(arg)) {
                            position = positionMap[arg[0]]
                            type = 'multiple'
                            dom.classList.add('ell-m-' + arg[0])
                            dom.style.setProperty('--ell-line', parseInt(arg.slice(2)))
                        } else {
                            position = positionMap[arg]
                            if (!position) {
                                position = 'top'
                                dom.classList.add('ell-t')
                            } else {
                                dom.classList.add('ell-' + arg)
                            }
                        }

                        // 获取浏览器信息，并转小写
                        const userAgent = navigator.userAgent.toLowerCase()
                        // 用 test 匹配浏览器信息
                        if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(userAgent)) {
                            dom.ontouchstart = (e) => {
                                e.preventDefault()
                                openEllipsis(dom, position, type)
                            }
                            dom.ontouchend = (e) => {
                                e.preventDefault()
                                const tooltip = document.getElementById('simply-ellipsis-tooltip')
                                if (tooltip) {
                                    tooltip.classList.remove('has-ell-visibility')
                                }
                            }
                            dom.touchcancel = (e) => {
                                e.preventDefault()
                                const tooltip = document.getElementById('simply-ellipsis-tooltip')
                                if (tooltip) {
                                    tooltip.classList.remove('has-ell-visibility')
                                }
                            }
                        } else {
                            dom.onmouseover = () => {
                                openEllipsis(dom, position, type)
                            }
                            dom.onmouseleave = () => {
                                const tooltip = document.getElementById('simply-ellipsis-tooltip')
                                if (tooltip) {
                                    tooltip.classList.remove('has-ell-visibility')
                                }
                            }
                        }
                    },
                    modifiers?.delay ? 1000 : 16,
                )
            },
            updated: function (dom, binding) {
                const { value, arg } = binding
                if (/[lrbt]-a/.test(arg)) {
                    if (value) {
                        dom.setAttribute('ell-value', value)
                    }
                }
            },
        })
    },
}
