import alt from 'alt-server';
import connection from '../../PSF_database/server/db';
import * as hash from '../../PSF_database/server/hash';


function getRealDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let a = yyyy + mm + dd;
    return a;
}

function setSpawnPlayer(player: alt.Player) {
    if (player.getStreamSyncedMeta("Player::Logged")) {
        player.model = 'mp_m_freemode_01';
        player.spawn(0, 0, 0, 2500);
    }
}


function imgetting(player: alt.Player, v: any, password: any) {
    let date = getRealDate();
    let hashed = hash.hashPassword(password);

    alt.log(`Encryption password is succesful result: ${hashed}`);
    alt.emitClient(null, "yepss", v, password);
    // if connection is successful
    connection.query("SELECT * FROM bpv_accounts WHERE Nick=?", [v], function (err, result, fields) {
        if (result?.length) {
            alt.logError(`${v} is already in use`);
            return;
        }

        connection.query("INSERT INTO bpv_accounts SET Nick=?, Password=?, DATE_REGISTER=?", [v, hashed, date]);
    });
}
alt.onClient("so", imgetting)


function Playerlogging(player: alt.Player, v: any, password: any) {
    alt.emitClient(null, "Login:ThirdEvent", v, password);
    // if connection is successful
    connection.query("SELECT * FROM bpv_accounts WHERE Nick=?", [v, password], function (err, result, fields) {
        const user = result?.[0];
        if (err) {
            throw err;
        }
        if (user) {
            const hashed_password = user.Password;
            if (hash.verifyPassword(password, hashed_password)) {
                alt.log(`~lg~Konto poprawne`);
                alt.emitClient(player, "destroy");
                player.setStreamSyncedMeta("Player::Logged", "Player")
                setSpawnPlayer(player)
            } else {
                alt.log(`~lr~Konto niepoprawne`);
            };
        }
    });
}
alt.onClient("MYSQL:LOGIN:TO_CLIENT", Playerlogging);


