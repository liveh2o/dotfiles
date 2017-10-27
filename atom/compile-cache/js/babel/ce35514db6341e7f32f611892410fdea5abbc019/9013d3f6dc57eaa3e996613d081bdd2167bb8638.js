Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conditionPromise = conditionPromise;
/** @babel */

function conditionPromise(predicate) {
  return new Promise(function (resolve) {
    setInterval(function () {
      if (predicate()) resolve();
    }, 100);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL3Rlc3QvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFTyxTQUFTLGdCQUFnQixDQUFFLFNBQVMsRUFBRTtBQUMzQyxTQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzlCLGVBQVcsQ0FBQyxZQUFNO0FBQ2hCLFVBQUksU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUE7S0FDM0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtHQUNSLENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL3Rlc3QvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmRpdGlvblByb21pc2UgKHByZWRpY2F0ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAocHJlZGljYXRlKCkpIHJlc29sdmUoKVxuICAgIH0sIDEwMClcbiAgfSlcbn1cbiJdfQ==