function testAlert() {
  alert('Test alert');
}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('test-alert').addEventListener('click', testAlert);
})
