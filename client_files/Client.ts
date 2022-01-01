import alt from 'alt-client';
import native from 'natives'

let View: alt.WebView;


View = new alt.WebView("http://resource/client_files/HTML/index.html");
View.focus();

alt.showCursor(true);

let myAudio = new alt.Audio('@audio/client/need.wav', 1, 'radio', false);
myAudio.addOutput(alt.Player.local);
myAudio.play();
let idTick = alt.everyTick(() => {
    native.disableAllControlActions(0);
});


function destroyView(v) {
    alt.setTimeout(() => {
        View.unfocus();
        View.destroy();
        alt.showCursor(false);
        alt.clearEveryTick(idTick);
        myAudio.destroy();
    }, 2000);

}
alt.onServer('destroy', destroyView);



let someVariable;

function Yeo(value: any, x: any) {
    someVariable = value;
    alt.emit("yep", value);
    alt.emitServer("so", value, x)
    console.log(`Registration successful data: ${"Login:" + value} ${"Password:" + x}`)

}
View.on('someEvent', Yeo)

function some(v: any) {
    console.log(`Client to client: ${v}`)

}
alt.on("yep", some)
alt.onServer("yepss", some)


//////////////////////////////////


let loggVariable;

function Login(value: any, x: any) {
    loggVariable = value;
    alt.emit("Login:Some", value);
    alt.emitServer("MYSQL:LOGIN:TO_CLIENT", value, x)
    console.log(`Registration successful data: ${"Login:" + value} ${"Password:" + x}`);

};
View.on('Login:Event', Login);

function SomeLogin(v: any) {
    console.log(`Login client ${v}`);

};
alt.on("Login:Some", SomeLogin)
alt.onServer("Login:ThirdEvent", SomeLogin)
