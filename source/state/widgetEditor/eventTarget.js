import { findKeyInMap } from 'source/__utils__/data'
import { getBranchElementList, getElementCenterUnder } from 'source/__utils__/DOM'

const EVENT_TARGET_TYPE = {
  NULL: 'NULL',
  WIDGET: 'WIDGET',
  WIDGET_SELECT: 'WIDGET_SELECT',
  HANDLE: 'HANDLE'
}

const DEFAULT_EVENT_TARGET_DATA = {
  type: EVENT_TARGET_TYPE.NULL,
  targetWidgetId: null,
  handleType: null,
  hoverTargetType: null
}

const getEventTargetData = (state, elementRefData, eventState) => {
  const { externalData: { lockWidgetId }, selectData: { selectIdList, rangeBoundingRect } } = state
  const {
    elementEditorLayer,
    elementWidgetLayer, elementWidgetMap,
    elementIndicatorLayer, elementIndicatorHandleMap, elementIndicatorHoverTargetMap
  } = elementRefData
  const { target: elementTarget } = eventState.eventStart

  if (elementEditorLayer === elementTarget || !elementEditorLayer.contains(elementTarget)) return DEFAULT_EVENT_TARGET_DATA

  if (elementWidgetLayer.contains(elementTarget)) {
    const [ possibleWidgetElement ] = getBranchElementList(elementWidgetLayer, elementTarget)
    const targetWidgetId = findKeyInMap(elementWidgetMap, ([ , element ]) => element.contains(possibleWidgetElement)) || null
    if (targetWidgetId && (!lockWidgetId || lockWidgetId !== targetWidgetId)) {
      const type = !rangeBoundingRect && selectIdList.includes(targetWidgetId)
        ? EVENT_TARGET_TYPE.WIDGET_SELECT
        : EVENT_TARGET_TYPE.WIDGET

      return { type, targetWidgetId, handleType: null, hoverTargetType: null }
    }
  }

  if (elementIndicatorLayer.contains(elementTarget)) {
    const handleType = findKeyInMap(elementIndicatorHandleMap, ([ , element ]) => element.contains(elementTarget))
    if (handleType) {
      const possibleHoverTargetElement = getElementCenterUnder(eventState.point, [
        ...Object.values(elementIndicatorHandleMap),
        elementWidgetLayer
      ])
      const hoverTargetType = findKeyInMap(elementIndicatorHoverTargetMap, ([ , element ]) => element.contains(possibleHoverTargetElement))

      return { type: EVENT_TARGET_TYPE.HANDLE, targetWidgetId: null, hoverTargetType, handleType }
    }
  }

  return DEFAULT_EVENT_TARGET_DATA
}

export {
  EVENT_TARGET_TYPE,
  getEventTargetData
}
