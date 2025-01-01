function getClientSize() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight,
        }
    } else if (document.compatMode === 'BackCompat') {
        return {
            w: document.body.clientWidth,
            h: document.body.clientHeigth,
        }
    } else {
        return {
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight,
        }
    }
}


export default function (dom, position, type) {
    let isAlways = false
    if (type === 'always') {
        isAlways = true
    } else if (type === 'multiple') {
        if (!(dom.scrollHeight > dom.offsetHeight)) {
            return
        }
    } else {
        if (!isOverFlow(dom)) {
            return
        }
    }
    const padding = 5 //定义弹框距边界的位置
    const anglePadding = 9 //定义小三角距边界的位置，padding加上圆角尺寸
    // 获取dom的尺寸
    const { innerText, clientWidth, clientHeight } = dom
    const { w, h } = getClientSize() //浏览器可见区域高宽尺寸
    const { left, top, bottom, right } = dom.getClientRects()[0]
    let content
    //只有isAlways为true才会从ell-value取值
    //解决vue更新dom时,只要dom的文本更新,dom节点本身没更新,导致还存放着上一次的ell-value值
    if (isAlways) {
        content = dom.getAttribute('ell-value') || innerText
    } else {
        content = innerText
    }

    //如果仍为空,则可能值在input之类的元素中,文本需通过input.value获取
    if (!content) {
        content = dom.querySelector('input').value
    }
    //若此时仍为空,则直接结束,防止弹出空提示
    if (!content) {
        return
    }
    dom.setAttribute('ell-value', content)

    // 获取目标dom的style并封装成对象，便于修改
    const cssTextArr = dom.style.cssText.split(';')
    const cssObj = {}
    cssTextArr.forEach((item) => {
        const arr = item.split(':')
        cssObj[arr[0]] = arr[1]
    })

    //获取ell:after的尺寸
    let afterDom = window.getComputedStyle(dom, ':after')
    const afterWidth = parseInt(afterDom.width)
    const afterMaxWidth = parseInt(
        window.getComputedStyle(document.documentElement).getPropertyValue('--ell-max-width'),
    )
    if (afterWidth >= afterMaxWidth) {
        cssObj['--ell-wrap'] = 'pre-wrap'
        cssObj['--ell-min-width'] = afterMaxWidth
        cssObj['--ell-width'] = afterMaxWidth
    } else {
        cssObj['--ell-width'] = afterDom.width
    }
    cssObj['--ell-wrap'] = 'pre-wrap'

    let cssString = ''
    for (const key in cssObj) {
        cssString += key + ':' + cssObj[key] + ';'
    }
    dom.style.cssText = cssString
    // return
    afterDom = window.getComputedStyle(dom, ':after')
    var { paddingBottom, paddingLeft, paddingRight, paddingTop, height, width, borderWidth } = afterDom
    let obj = {
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        height,
        width,
        borderWidth,
    }
    for (const key in obj) {
        obj[key] = parseInt(obj[key])
    }
    var { paddingBottom, paddingLeft, paddingRight, paddingTop, height, width, borderWidth } = obj

    borderWidth = borderWidth || 0 //在firefox中为空字符串，parseInt后为NaN
    const afterDomOffsetWidth = width + paddingLeft + paddingRight + borderWidth * 2

    const afterDomOffsetHeight = height + paddingTop + paddingBottom + borderWidth * 2

    //获取ell:before，即气泡框上的小三角的尺寸
    const beforeDom = window.getComputedStyle(dom, ':before')

    const beforeDomWidth = parseInt(beforeDom.width) + 2 * parseInt(beforeDom.borderWidth)

    // 根据上一步获取的尺寸，计算ell堤示框能否在视野内完全显示，若不能，强制更换其显示位置
    if (left - afterDomOffsetWidth - beforeDomWidth < 0 && position === 'left') position = 'right'
    if (right + afterDomOffsetWidth + beforeDomWidth > w && position === 'right') position = 'left'
    if (top - afterDomOffsetHeight - beforeDomWidth < 0 && position === 'top') position = 'bottom'
    if (bottom + afterDomOffsetHeight + beforeDomWidth > h && position === 'bottom') position = 'top'

    //根据ell位置，给style对象设置新值
    let ellLeft = padding
    let ellTop = padding
    let angleTop = anglePadding
    switch (position) {
        case 'top':
            ellLeft = left - (afterDomOffsetWidth - clientWidth) / 2
            ellLeft = Math.max(ellLeft, padding)
            ellLeft = Math.min(ellLeft, w - afterDomOffsetWidth - padding)
            cssObj['--ell-left'] = `${ellLeft}px`
            cssObj['--ell-top'] = `${top - afterDomOffsetHeight - (beforeDomWidth / 2) * Math.sqrt(2)}px`
            cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - beforeDomWidth / 2}px`
            cssObj['--ell-angle-top'] = `${top - beforeDomWidth - (beforeDomWidth / 2) * (Math.sqrt(2) - 1)}px`
            break
        case 'bottom':
            ellLeft = left - (afterDomOffsetWidth - clientWidth) / 2
            ellLeft = Math.max(ellLeft, padding)
            ellLeft = Math.min(ellLeft, w - afterDomOffsetWidth - padding)
            cssObj['--ell-left'] = `${ellLeft}px`
            cssObj['--ell-top'] = `${bottom + (beforeDomWidth / 2) * Math.sqrt(2)}px`
            cssObj['--ell-angle-left'] = `${left + clientWidth / 2 - beforeDomWidth / 2}px`
            cssObj['--ell-angle-top'] = `${bottom + (beforeDomWidth / 2) * (Math.sqrt(2) - 1)}px`
            break
        case 'right':
            ellTop = top - (afterDomOffsetHeight - clientHeight) / 2
            ellTop = Math.max(ellTop, padding)
            ellTop = Math.min(ellTop, h - afterDomOffsetHeight - padding)

            angleTop = top + (clientHeight - beforeDomWidth) / 2
            angleTop = Math.max(angleTop, anglePadding)
            angleTop = Math.min(angleTop, h - beforeDomWidth * 2 - anglePadding)

            cssObj['--ell-left'] = `${right + (beforeDomWidth / 2) * Math.sqrt(2)}px`
            cssObj['--ell-top'] = `${ellTop}px`
            cssObj['--ell-angle-left'] = `${right + (beforeDomWidth / 2) * (Math.sqrt(2) - 1)}px`
            cssObj['--ell-angle-top'] = `${angleTop}px`

            break
        case 'left':
            ellTop = top - (afterDomOffsetHeight - clientHeight) / 2
            ellTop = Math.max(ellTop, padding)
            ellTop = Math.min(ellTop, h - afterDomOffsetHeight - padding)

            angleTop = top + (clientHeight - beforeDomWidth) / 2
            angleTop = Math.max(angleTop, anglePadding)
            angleTop = Math.min(angleTop, h - beforeDomWidth * 2 - anglePadding)

            cssObj['--ell-left'] = `${left - afterDomOffsetWidth - (beforeDomWidth / 2) * Math.sqrt(2)}px`
            cssObj['--ell-top'] = `${ellTop}px`
            cssObj['--ell-angle-left'] = `${left - beforeDomWidth - (beforeDomWidth / 2) * (Math.sqrt(2) - 1)}px`
            cssObj['--ell-angle-top'] = `${angleTop}px`
            break
        default:
            break
    }

    //将新的style对象重新拼接成字符串
    let cssTextString = ''
    for (const key in cssObj) {
        if (key.indexOf('--') > -1) {
            cssTextString += key + ':' + cssObj[key] + ';'
        }
    }
    let tooltip = document.getElementById('simply-ellipsis-tooltip')
    if (!tooltip) {
        tooltip = document.createElement('div')
        tooltip.setAttribute('id', 'simply-ellipsis-tooltip')
        document.body.append(tooltip)
    }
    tooltip.setAttribute('ell-value', content)
    tooltip.style.cssText = cssTextString
    //由于tooltipdom始终只有一个,故需移除上次添加的class样式
    tooltip.classList.remove('has-ell-left', 'has-ell-right', 'has-ell-top', 'has-ell-bottom')
    tooltip.classList.add('has-ell-' + position)
    tooltip.classList.add('has-ell')
    tooltip.classList.add('has-ell-visibility')
}

function isOverFlow(dom) {
    if (dom.scrollWidth > dom.offsetWidth) {
        return true
    }

    // const domStyle = document.defaultView.getComputedStyle(dom, '')
    // const padding = parseInt(domStyle.paddingLeft || 0) + parseInt(domStyle.paddingRight || 0)

    // const range = document.createRange()
    // range.setStart(dom, 0)
    // range.setEnd(dom, dom.childNodes.length)
    // const rangeWidth = range.getBoundingClientRect().width

    // return rangeWidth + padding > dom.offsetWidth
    let result
    if (dom.children?.length) {
        for (let i = 0; i < dom.children.length; i++) {
            const item = dom.children[i]
            result = isOverFlow(item)
            if (result) {
                break
            }
        }
    }
    return result
}
