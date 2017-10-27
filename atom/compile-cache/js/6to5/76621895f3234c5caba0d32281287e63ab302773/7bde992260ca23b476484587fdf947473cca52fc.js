var quicksort = function () {
  var sort = function (items) {
    if (items.length <= 1) return items;
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

  return sort(Array.apply(this, arguments));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy90YWJzL3NwZWMvZml4dHVyZXMvc2FtcGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksWUFBWSxZQUFZO0FBQzFCLE1BQUksT0FBTyxVQUFTLE9BQU87QUFDekIsUUFBSSxNQUFNLFVBQVUsR0FBRyxPQUFPO0FBQzlCLFFBQUksUUFBUSxNQUFNO1FBQVM7UUFBUyxPQUFPO1FBQUksUUFBUTtBQUN2RCxXQUFNLE1BQU0sU0FBUyxHQUFHO0FBQ3RCLGdCQUFVLE1BQU07QUFDaEIsZ0JBQVUsUUFBUSxLQUFLLEtBQUssV0FBVyxNQUFNLEtBQUs7O0FBRXBELFdBQU8sS0FBSyxNQUFNLE9BQU8sT0FBTyxPQUFPLEtBQUs7OztBQUc5QyxTQUFPLEtBQUssTUFBTSxNQUFNLE1BQU0iLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy9maXh0dXJlcy9zYW1wbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcXVpY2tzb3J0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc29ydCA9IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA8PSAxKSByZXR1cm4gaXRlbXM7XG4gICAgdmFyIHBpdm90ID0gaXRlbXMuc2hpZnQoKSwgY3VycmVudCwgbGVmdCA9IFtdLCByaWdodCA9IFtdO1xuICAgIHdoaWxlKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIGN1cnJlbnQgPSBpdGVtcy5zaGlmdCgpO1xuICAgICAgY3VycmVudCA8IHBpdm90ID8gbGVmdC5wdXNoKGN1cnJlbnQpIDogcmlnaHQucHVzaChjdXJyZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHNvcnQobGVmdCkuY29uY2F0KHBpdm90KS5jb25jYXQoc29ydChyaWdodCkpO1xuICB9O1xuXG4gIHJldHVybiBzb3J0KEFycmF5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xufTsiXX0=