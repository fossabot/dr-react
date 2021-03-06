import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { color } from 'source/style/color'
import { RulerHorizontal, RulerVertical } from './Ruler'

const SIZE_RULER = '16px'

const BaseDiv = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: ${SIZE_RULER};
  height: ${SIZE_RULER};
`

const IntersectionButton = styled(BaseDiv.withComponent('button'))`
  border: 0;
  border-right: 1px solid ${color.border};
  border-bottom: 1px solid ${color.border};
  background: ${color.background};
  transition: background 0.3s ease;
  &.active { background: ${color.text}; }
`

const RulerHorizontalDiv = styled(BaseDiv.withComponent(RulerHorizontal))`
  left: ${SIZE_RULER};
  width: calc(100% - ${SIZE_RULER});
  border-bottom: 1px solid ${color.border};
`

const RulerVerticalDiv = styled(BaseDiv.withComponent(RulerVertical))`
  top: ${SIZE_RULER};
  height: calc(100% - ${SIZE_RULER});
  border-right: 1px solid ${color.border};
`

const ContentDiv = styled(BaseDiv)`
  top: ${SIZE_RULER};
  left: ${SIZE_RULER};
  width: calc(100% - ${SIZE_RULER});
  height: calc(100% - ${SIZE_RULER});
`

const RulerLayer = ({ zoom, valueX, valueY, onClick, className, children }) => {
  const isActive = (valueX !== 0 || valueY !== 0)
  return <div className={className || ''}>
    <IntersectionButton className={isActive ? 'active' : ''} onClick={isActive ? onClick : null} disabled={!isActive} />
    <RulerHorizontalDiv zoom={zoom} valueX={valueX} />
    <RulerVerticalDiv zoom={zoom} valueY={valueY} />
    <ContentDiv>
      {children}
    </ContentDiv>
  </div>
}
RulerLayer.propTypes = {
  zoom: PropTypes.number,
  valueX: PropTypes.number,
  valueY: PropTypes.number,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
}

export { RulerLayer }
