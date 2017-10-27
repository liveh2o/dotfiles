Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getBufferPositionFromMouseEvent = getBufferPositionFromMouseEvent;
exports.mouseEventNearPosition = mouseEventNearPosition;
exports.hasParent = hasParent;

var TOOLTIP_WIDTH_HIDE_OFFSET = 30;

function getBufferPositionFromMouseEvent(event, editor, editorElement) {
  var pixelPosition = editorElement.component.pixelPositionForMouseEvent(event);
  var screenPosition = editorElement.component.screenPositionForPixelPosition(pixelPosition);
  if (Number.isNaN(screenPosition.row) || Number.isNaN(screenPosition.column)) return null;
  // ^ Workaround for NaN bug steelbrain/linter-ui-default#191
  var expectedPixelPosition = editorElement.pixelPositionForScreenPosition(screenPosition);
  var differenceTop = pixelPosition.top - expectedPixelPosition.top;
  var differenceLeft = pixelPosition.left - expectedPixelPosition.left;
  // Only allow offset of 20px - Fixes steelbrain/linter-ui-default#63
  if ((differenceTop === 0 || differenceTop > 0 && differenceTop < 20 || differenceTop < 0 && differenceTop > -20) && (differenceLeft === 0 || differenceLeft > 0 && differenceLeft < 20 || differenceLeft < 0 && differenceLeft > -20)) {
    return editor.bufferPositionForScreenPosition(screenPosition);
  }
  return null;
}

function mouseEventNearPosition(_ref) {
  var event = _ref.event;
  var editor = _ref.editor;
  var editorElement = _ref.editorElement;
  var tooltipElement = _ref.tooltipElement;
  var screenPosition = _ref.screenPosition;

  var pixelPosition = editorElement.component.pixelPositionForMouseEvent(event);
  var expectedPixelPosition = editorElement.pixelPositionForScreenPosition(screenPosition);
  var differenceTop = pixelPosition.top - expectedPixelPosition.top;
  var differenceLeft = pixelPosition.left - expectedPixelPosition.left;

  var editorLineHeight = editor.lineHeightInPixels;
  var elementHeight = tooltipElement.offsetHeight + editorLineHeight;
  var elementWidth = tooltipElement.offsetWidth;

  if (differenceTop > 0) {
    // Cursor is below the line
    if (differenceTop > elementHeight + 1.5 * editorLineHeight) {
      return false;
    }
  } else if (differenceTop < 0) {
    // Cursor is above the line
    if (differenceTop < -1.5 * editorLineHeight) {
      return false;
    }
  }
  if (differenceLeft > 0) {
    // Right of the start of highlight
    if (differenceLeft > elementWidth + TOOLTIP_WIDTH_HIDE_OFFSET) {
      return false;
    }
  } else if (differenceLeft < 0) {
    // Left of start of highlight
    if (differenceLeft < -1 * TOOLTIP_WIDTH_HIDE_OFFSET) {
      return false;
    }
  }
  return true;
}

function hasParent(givenElement, selector) {
  var element = givenElement;
  do {
    if (element.matches(selector)) {
      return true;
    }
    element = element.parentElement;
  } while (element && element.nodeName !== 'HTML');
  return false;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUlBLElBQU0seUJBQXlCLEdBQUcsRUFBRSxDQUFBOztBQUU3QixTQUFTLCtCQUErQixDQUFDLEtBQWlCLEVBQUUsTUFBa0IsRUFBRSxhQUFxQixFQUFVO0FBQ3BILE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0UsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUM1RixNQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFBOztBQUV4RixNQUFNLHFCQUFxQixHQUFHLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUMxRixNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsR0FBRyxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQTtBQUNuRSxNQUFNLGNBQWMsR0FBRyxhQUFhLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQTs7QUFFdEUsTUFDRSxDQUFDLGFBQWEsS0FBSyxDQUFDLElBQUssYUFBYSxHQUFHLENBQUMsSUFBSSxhQUFhLEdBQUcsRUFBRSxBQUFDLElBQUssYUFBYSxHQUFHLENBQUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FDOUcsY0FBYyxLQUFLLENBQUMsSUFBSyxjQUFjLEdBQUcsQ0FBQyxJQUFJLGNBQWMsR0FBRyxFQUFFLEFBQUMsSUFBSyxjQUFjLEdBQUcsQ0FBQyxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxBQUFDLEVBQ3JIO0FBQ0EsV0FBTyxNQUFNLENBQUMsK0JBQStCLENBQUMsY0FBYyxDQUFDLENBQUE7R0FDOUQ7QUFDRCxTQUFPLElBQUksQ0FBQTtDQUNaOztBQUVNLFNBQVMsc0JBQXNCLENBQUMsSUFBd0UsRUFBVztNQUFqRixLQUFLLEdBQVAsSUFBd0UsQ0FBdEUsS0FBSztNQUFFLE1BQU0sR0FBZixJQUF3RSxDQUEvRCxNQUFNO01BQUUsYUFBYSxHQUE5QixJQUF3RSxDQUF2RCxhQUFhO01BQUUsY0FBYyxHQUE5QyxJQUF3RSxDQUF4QyxjQUFjO01BQUUsY0FBYyxHQUE5RCxJQUF3RSxDQUF4QixjQUFjOztBQUNuRyxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9FLE1BQU0scUJBQXFCLEdBQUcsYUFBYSxDQUFDLDhCQUE4QixDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQzFGLE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxHQUFHLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFBO0FBQ25FLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFBOztBQUV0RSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQTtBQUNsRCxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsWUFBWSxHQUFHLGdCQUFnQixDQUFBO0FBQ3BFLE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUE7O0FBRS9DLE1BQUksYUFBYSxHQUFHLENBQUMsRUFBRTs7QUFFckIsUUFBSSxhQUFhLEdBQUksYUFBYSxHQUFJLEdBQUcsR0FBRyxnQkFBZ0IsQUFBQyxBQUFDLEVBQUU7QUFDOUQsYUFBTyxLQUFLLENBQUE7S0FDYjtHQUNGLE1BQU0sSUFBSSxhQUFhLEdBQUcsQ0FBQyxFQUFFOztBQUU1QixRQUFJLGFBQWEsR0FBSSxDQUFDLEdBQUcsR0FBRyxnQkFBZ0IsQUFBQyxFQUFFO0FBQzdDLGFBQU8sS0FBSyxDQUFBO0tBQ2I7R0FDRjtBQUNELE1BQUksY0FBYyxHQUFHLENBQUMsRUFBRTs7QUFFdEIsUUFBSSxjQUFjLEdBQUksWUFBWSxHQUFHLHlCQUF5QixBQUFDLEVBQUU7QUFDL0QsYUFBTyxLQUFLLENBQUE7S0FDYjtHQUNGLE1BQU0sSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFOztBQUU3QixRQUFJLGNBQWMsR0FBSSxDQUFDLENBQUMsR0FBRyx5QkFBeUIsQUFBQyxFQUFFO0FBQ3JELGFBQU8sS0FBSyxDQUFBO0tBQ2I7R0FDRjtBQUNELFNBQU8sSUFBSSxDQUFBO0NBQ1o7O0FBRU0sU0FBUyxTQUFTLENBQUMsWUFBeUIsRUFBRSxRQUFnQixFQUFXO0FBQzlFLE1BQUksT0FBTyxHQUFHLFlBQVksQ0FBQTtBQUMxQixLQUFHO0FBQ0QsUUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzdCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7QUFDRCxXQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQTtHQUNoQyxRQUFRLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE1BQU0sRUFBQztBQUNoRCxTQUFPLEtBQUssQ0FBQTtDQUNiIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgdHlwZSB7IFBvaW50LCBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcblxuY29uc3QgVE9PTFRJUF9XSURUSF9ISURFX09GRlNFVCA9IDMwXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCdWZmZXJQb3NpdGlvbkZyb21Nb3VzZUV2ZW50KGV2ZW50OiBNb3VzZUV2ZW50LCBlZGl0b3I6IFRleHRFZGl0b3IsIGVkaXRvckVsZW1lbnQ6IE9iamVjdCk6ID9Qb2ludCB7XG4gIGNvbnN0IHBpeGVsUG9zaXRpb24gPSBlZGl0b3JFbGVtZW50LmNvbXBvbmVudC5waXhlbFBvc2l0aW9uRm9yTW91c2VFdmVudChldmVudClcbiAgY29uc3Qgc2NyZWVuUG9zaXRpb24gPSBlZGl0b3JFbGVtZW50LmNvbXBvbmVudC5zY3JlZW5Qb3NpdGlvbkZvclBpeGVsUG9zaXRpb24ocGl4ZWxQb3NpdGlvbilcbiAgaWYgKE51bWJlci5pc05hTihzY3JlZW5Qb3NpdGlvbi5yb3cpIHx8IE51bWJlci5pc05hTihzY3JlZW5Qb3NpdGlvbi5jb2x1bW4pKSByZXR1cm4gbnVsbFxuICAvLyBeIFdvcmthcm91bmQgZm9yIE5hTiBidWcgc3RlZWxicmFpbi9saW50ZXItdWktZGVmYXVsdCMxOTFcbiAgY29uc3QgZXhwZWN0ZWRQaXhlbFBvc2l0aW9uID0gZWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24pXG4gIGNvbnN0IGRpZmZlcmVuY2VUb3AgPSBwaXhlbFBvc2l0aW9uLnRvcCAtIGV4cGVjdGVkUGl4ZWxQb3NpdGlvbi50b3BcbiAgY29uc3QgZGlmZmVyZW5jZUxlZnQgPSBwaXhlbFBvc2l0aW9uLmxlZnQgLSBleHBlY3RlZFBpeGVsUG9zaXRpb24ubGVmdFxuICAvLyBPbmx5IGFsbG93IG9mZnNldCBvZiAyMHB4IC0gRml4ZXMgc3RlZWxicmFpbi9saW50ZXItdWktZGVmYXVsdCM2M1xuICBpZiAoXG4gICAgKGRpZmZlcmVuY2VUb3AgPT09IDAgfHwgKGRpZmZlcmVuY2VUb3AgPiAwICYmIGRpZmZlcmVuY2VUb3AgPCAyMCkgfHwgKGRpZmZlcmVuY2VUb3AgPCAwICYmIGRpZmZlcmVuY2VUb3AgPiAtMjApKSAmJlxuICAgIChkaWZmZXJlbmNlTGVmdCA9PT0gMCB8fCAoZGlmZmVyZW5jZUxlZnQgPiAwICYmIGRpZmZlcmVuY2VMZWZ0IDwgMjApIHx8IChkaWZmZXJlbmNlTGVmdCA8IDAgJiYgZGlmZmVyZW5jZUxlZnQgPiAtMjApKVxuICApIHtcbiAgICByZXR1cm4gZWRpdG9yLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24pXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlRXZlbnROZWFyUG9zaXRpb24oeyBldmVudCwgZWRpdG9yLCBlZGl0b3JFbGVtZW50LCB0b29sdGlwRWxlbWVudCwgc2NyZWVuUG9zaXRpb24gfTogT2JqZWN0KTogYm9vbGVhbiB7XG4gIGNvbnN0IHBpeGVsUG9zaXRpb24gPSBlZGl0b3JFbGVtZW50LmNvbXBvbmVudC5waXhlbFBvc2l0aW9uRm9yTW91c2VFdmVudChldmVudClcbiAgY29uc3QgZXhwZWN0ZWRQaXhlbFBvc2l0aW9uID0gZWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24pXG4gIGNvbnN0IGRpZmZlcmVuY2VUb3AgPSBwaXhlbFBvc2l0aW9uLnRvcCAtIGV4cGVjdGVkUGl4ZWxQb3NpdGlvbi50b3BcbiAgY29uc3QgZGlmZmVyZW5jZUxlZnQgPSBwaXhlbFBvc2l0aW9uLmxlZnQgLSBleHBlY3RlZFBpeGVsUG9zaXRpb24ubGVmdFxuXG4gIGNvbnN0IGVkaXRvckxpbmVIZWlnaHQgPSBlZGl0b3IubGluZUhlaWdodEluUGl4ZWxzXG4gIGNvbnN0IGVsZW1lbnRIZWlnaHQgPSB0b29sdGlwRWxlbWVudC5vZmZzZXRIZWlnaHQgKyBlZGl0b3JMaW5lSGVpZ2h0XG4gIGNvbnN0IGVsZW1lbnRXaWR0aCA9IHRvb2x0aXBFbGVtZW50Lm9mZnNldFdpZHRoXG5cbiAgaWYgKGRpZmZlcmVuY2VUb3AgPiAwKSB7XG4gICAgLy8gQ3Vyc29yIGlzIGJlbG93IHRoZSBsaW5lXG4gICAgaWYgKGRpZmZlcmVuY2VUb3AgPiAoZWxlbWVudEhlaWdodCArICgxLjUgKiBlZGl0b3JMaW5lSGVpZ2h0KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfSBlbHNlIGlmIChkaWZmZXJlbmNlVG9wIDwgMCkge1xuICAgIC8vIEN1cnNvciBpcyBhYm92ZSB0aGUgbGluZVxuICAgIGlmIChkaWZmZXJlbmNlVG9wIDwgKC0xLjUgKiBlZGl0b3JMaW5lSGVpZ2h0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG4gIGlmIChkaWZmZXJlbmNlTGVmdCA+IDApIHtcbiAgICAvLyBSaWdodCBvZiB0aGUgc3RhcnQgb2YgaGlnaGxpZ2h0XG4gICAgaWYgKGRpZmZlcmVuY2VMZWZ0ID4gKGVsZW1lbnRXaWR0aCArIFRPT0xUSVBfV0lEVEhfSElERV9PRkZTRVQpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH0gZWxzZSBpZiAoZGlmZmVyZW5jZUxlZnQgPCAwKSB7XG4gICAgLy8gTGVmdCBvZiBzdGFydCBvZiBoaWdobGlnaHRcbiAgICBpZiAoZGlmZmVyZW5jZUxlZnQgPCAoLTEgKiBUT09MVElQX1dJRFRIX0hJREVfT0ZGU0VUKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQYXJlbnQoZ2l2ZW5FbGVtZW50OiBIVE1MRWxlbWVudCwgc2VsZWN0b3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgZWxlbWVudCA9IGdpdmVuRWxlbWVudFxuICBkbyB7XG4gICAgaWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgfSB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVOYW1lICE9PSAnSFRNTCcpXG4gIHJldHVybiBmYWxzZVxufVxuIl19