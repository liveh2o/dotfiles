/**
 * Sample quicksort code
 * TODO: This is the first todo
 *
 * LOONG: Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam, id ante molestias, ipsum lorem magnis et. A eleifend ipsum. Pellentesque aliquam, proin mollis sed odio, at amet vestibulum velit. Dolor sed, urna integer suspendisse ut a. Pharetra amet dui accumsan elementum, vitae et ac ligula turpis semper donec.
 */

var quicksort = function quicksort() {
  var sort = function sort(items) {
    if (items.length <= 1) {
      return items;
    }
    var pivot = items.shift(),
        current,
        left = [],
        right = [];
    while (items.length > 0) {
      current = items.shift();
      current < pivot ? left.push(current) : right.push(current);
    }
    return sort(left).concat(pivot).concat(sort(right));
  };

  // TODO: This is the second todo

  return sort(Array.apply(this, arguments)); // DEBUG

  // FIXME: Add more annnotations :)
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvc3BlYy9maXh0dXJlcy9zYW1wbGUxL3NhbXBsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBT0EsSUFBSSxTQUFTLEdBQUcsU0FBWixTQUFTLEdBQWU7QUFDMUIsTUFBSSxJQUFJLEdBQUcsU0FBUCxJQUFJLENBQVksS0FBSyxFQUFFO0FBQ3pCLFFBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFBRSxhQUFPLEtBQUssQ0FBQztLQUFFO0FBQ3hDLFFBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUU7UUFBRSxPQUFPO1FBQUUsSUFBSSxHQUFHLEVBQUU7UUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQzFELFdBQU0sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEIsYUFBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QixhQUFPLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM1RDtBQUNELFdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7R0FDckQsQ0FBQzs7OztBQUlGLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7OztDQUczQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvc3BlYy9maXh0dXJlcy9zYW1wbGUxL3NhbXBsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2FtcGxlIHF1aWNrc29ydCBjb2RlXG4gKiBUT0RPOiBUaGlzIGlzIHRoZSBmaXJzdCB0b2RvXG4gKlxuICogTE9PTkc6IExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBkYXBpYnVzIHJob25jdXMuIFNjZWxlcmlzcXVlIHF1YW0sIGlkIGFudGUgbW9sZXN0aWFzLCBpcHN1bSBsb3JlbSBtYWduaXMgZXQuIEEgZWxlaWZlbmQgaXBzdW0uIFBlbGxlbnRlc3F1ZSBhbGlxdWFtLCBwcm9pbiBtb2xsaXMgc2VkIG9kaW8sIGF0IGFtZXQgdmVzdGlidWx1bSB2ZWxpdC4gRG9sb3Igc2VkLCB1cm5hIGludGVnZXIgc3VzcGVuZGlzc2UgdXQgYS4gUGhhcmV0cmEgYW1ldCBkdWkgYWNjdW1zYW4gZWxlbWVudHVtLCB2aXRhZSBldCBhYyBsaWd1bGEgdHVycGlzIHNlbXBlciBkb25lYy5cbiAqL1xuXG52YXIgcXVpY2tzb3J0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc29ydCA9IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA8PSAxKSB7IHJldHVybiBpdGVtczsgfVxuICAgIHZhciBwaXZvdCA9IGl0ZW1zLnNoaWZ0KCksIGN1cnJlbnQsIGxlZnQgPSBbXSwgcmlnaHQgPSBbXTtcbiAgICB3aGlsZShpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjdXJyZW50ID0gaXRlbXMuc2hpZnQoKTtcbiAgICAgIGN1cnJlbnQgPCBwaXZvdCA/IGxlZnQucHVzaChjdXJyZW50KSA6IHJpZ2h0LnB1c2goY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiBzb3J0KGxlZnQpLmNvbmNhdChwaXZvdCkuY29uY2F0KHNvcnQocmlnaHQpKTtcbiAgfTtcblxuICAvLyBUT0RPOiBUaGlzIGlzIHRoZSBzZWNvbmQgdG9kb1xuXG4gIHJldHVybiBzb3J0KEFycmF5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpOyAgLy8gREVCVUdcblxuICAvLyBGSVhNRTogQWRkIG1vcmUgYW5ubm90YXRpb25zIDopXG59O1xuIl19