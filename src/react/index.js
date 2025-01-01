import openEllipsis from '../index.js'
import '../ellipsis.css'
import React, { useCallback, useEffect, useRef } from 'react'

const placementMap = {
    left: 'l',
    right: 'r',
    bottom: 'b',
    top: 't',
}

export default function ({ placement = 'top', always, title, line, children }) {
    const argRef = useRef(placementMap[placement] || 't')
    const typeRef = useRef()
    const domRef = useRef()
    const ellRef = useRef()

    useEffect(() => {
        if (ellRef.current) {
            domRef.current = ellRef.current
            if (always) {
                typeRef.current = 'always'
                domRef.current.classList.add('ell-a-' + argRef.current)
                if (title) {
                    domRef.current.setAttribute('ell-value', title)
                }
            } else if (typeof line === 'number' && line > 0) {
                typeRef.current = 'multiple'
                domRef.current.classList.add('ell-m-' + argRef.current)
                domRef.current.style.setProperty('--ell-line', line)
            } else {
                domRef.current.classList.add('ell-' + argRef.current)
            }
        }
    }, [always, line, title])

    const onMouseOver = useCallback(() => {
        openEllipsis(domRef.current, placement, typeRef.current)
    }, [placement])

    const onMouseLeave = useCallback(() => {
        const tooltip = document.getElementById('simply-ellipsis-tooltip')
        if (tooltip) {
            tooltip.classList.remove('has-ell-visibility')
        }
    }, [])

    if (children) return React.cloneElement(children, { onMouseOver, onMouseLeave, ref: ellRef })
    return null
}
