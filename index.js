console.log('a');

$('#create').click(e => {
    console.log('a');
    window.location.href = `https://cretgp.com/lab/codraw/play.html?room=${document.getElementById('create-room-name').value}&pass=${document.getElementById('create-room-pass').value}`;
});
$('#join').click(e => {
    console.log('a');
    window.location.href = `https://cretgp.com/lab/codraw/play.html?room=${document.getElementById('join-room-name').value}&pass=${document.getElementById('join-room-pass').value}`;
});
