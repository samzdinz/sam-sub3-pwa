const base_url = "https://api.football-data.org/v2/";
const endPoint_liga = `${base_url}competitions/2021/`;
const endPoint_team = `${endPoint_liga}teams/`;
const endPoint_idteam = `${base_url}teams/`;
const endPoint_standing = `${endPoint_liga}standings/`;
const api_token = 'feab1bf419d54e1f9053fc98fbaf2fd9';

const getApi = function(url) {
    return fetch(url, {
        headers: {
            'X-Auth-Token': api_token
        }
    });
};



// Blok kode yang akan di panggil jika fetch berhasil

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

function klasemen() {
    if ("caches" in window) {
        caches.match(endPoint_standing).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    klasemenHtml(data);
                });
            }
        })
    }

    getApi(endPoint_standing)
        .then(status)
        .then(json)
        .then(function(data) {
            klasemenHtml(data);
        });

    function klasemenHtml(data) {

        data.standings.forEach(function(season) {
            if (season.type == "TOTAL") {
                season.table.forEach(function(standing) {
                    var logo_team = standing.team.crestUrl.replace(/^http:\/\//i, 'https://')
                    var isi = ""
                    isi += `
                            <tr class="responsive-table">
                            <td>${standing.position}</td>
                            <td>
                              <img src="${logo_team}"  class="responsive-img" width="20px">
                            </td>
                            <td>
                              <b>${standing.team.name}</b>
                            </td>
                            <td>${standing.playedGames}</td>
                            <td>${standing.won}</td>
                            <td>${standing.draw}</td>
                            <td>${standing.lost}</td>
                            <td>${standing.goalsFor}</td>
                            <td>${standing.points}</td>
                          </tr>
                        `;

                    var html = document.getElementById("klasemen_team").innerHTML + isi;
                    document.getElementById("klasemen_team").innerHTML = html;
                })
            }
        });
    }
}

function teams() {
    if ("caches" in window) {
        caches.match(endPoint_team).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    teamHtml(data);
                });
            }
        })
    }

    getApi(endPoint_team)
        .then(status)
        .then(json)
        .then(function(data) {
            teamHtml(data);
        });

    function teamHtml(data) {

        var isi = "";
        data.teams.forEach(function(team) {
            var logo_team = team.crestUrl.replace(/^http:\/\//i, 'https://')
            isi += `
        
            <div class="col s8 pull-s2 push-s2">
                <h4 class="header">${team.name}</h4>
                <div class="card horizontal">
                  <div class="card-image">
                    <img src="${logo_team}" alt="${team.name}" style="width: 100px; height: 100px; margin-top: 25px;" class="responsive-img">
                  </div>
                  <div class="card-stacked">
                    <div class="card-content">
                      <p>
                      <b>Warna Klub : </b> ${team.clubColors} <br>
                      <b>Venue      : </b> ${team.venue} <br>
                      <b>Alamat    : </b> ${team.address} <br>
                      <b>Website    : </b> ${team.website}<br>
                      </p>
                                   
                    </div>
                    <a href="#" class="fav waves-effect waves-purple right-align" style="padding-right: 30px;">
                   <i class="small material-icons">grade</i>
                 </a>
                    <div class="card-action">
                      <a href="detailteam.html?id_team=${team.id}">Read More</a>
                    </div>
                  </div>
                </div>
              </div>
                        
                  `
        });
        document.getElementById("teams").innerHTML = isi;

        const el = document.getElementById("teams").getElementsByClassName("fav");
        for (let i = 0; i < el.length; i++) {
            el[i].onclick = () => {
                const saveTeam = {
                    id: data.teams[i].id,
                    name: data.teams[i].name,
                    crestUrl: data.teams[i].crestUrl,
                    venue: data.teams[i].venue,
                    address: data.teams[i].address,
                    website: data.teams[i].website
                };
                dbSaveTeam(saveTeam)
            }
        }

    }
}

function teamById() {
    var url = new URLSearchParams(window.location.search);
    var idteam = url.get("id_team");

    if ("caches" in window) {
        caches.match(endPoint_idteam + idteam).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    teamDetail(data);
                });
            }
        })
    }

    getApi(endPoint_idteam + idteam)
        .then(status)
        .then(json)
        .then(function(data) {
            teamDetail(data)
        });

    function teamDetail(data) {
        var isi = '';

        isi = `
                <div class="row">
                    <div class="col s12">
                    <div class="card responsive-img">
                        <div class="card-image ">
                        <img src="${data.crestUrl}" style="width: 200px; height: 200px; margin: auto; padding-top: 20px;">
                        </div>
                        <div class="card-content">
                        <p>
                        <b>Warna Klub : </b> ${data.clubColors} <br>
                        <b>Venue      : </b> ${data.venue} <br>
                        <b>Alamat    : </b> ${data.address} <br>
                        <b>Website    : </b> ${data.website}<br>
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
            `

        var isiPlayer = '';
        data.squad.forEach(function(player) {
            isiPlayer += `
            <div class="row">
                <div class="col s8 pull-s2 push-s2">
                    <ul>
                        <li class="collection-item avatar">
                            <img src="assets/player.png" alt="" class="circle">
                                <span class="tittle">
                                    <b>Nama : ${player.name}</b></span>
                                    <p>
                                    Posisi : ${player.position}<br>
                                    Lahir : ${player.dateOfBirth}<br>
                                    Tempat Kelahiran : ${player.countryOfBirth}<br>
                                    Negara : ${player.nationality}
                                    </p>
                        </li>
                    </ul>
                </div>
            </div>
                `
        });

        document.getElementById("detail_team").innerHTML = isi;
        document.getElementById("team_player").innerHTML = isiPlayer;

    }
}


function teamFavorite() {
    dbteamFavorite();
}